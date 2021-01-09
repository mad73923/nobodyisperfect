const db = require('_helpers/db');
const state = require('_helpers/gameState');
const gameState = require('../_helpers/gameState');
var ObjectId = require('mongoose').Types.ObjectId;
const io = require('_helpers/socketio');

module.exports = {
    getAll,
    getById,
    getAllCanRegisterOrIsPlayer,
    addNewGame,
    updateGame,
    deleteGame,
    joinGame,
    newRound,
    addAnswer
}

const lookupMaster =
{$lookup: 
    {
        from: "users",
        let: {player_id: "$gameMaster"},
        pipeline: 
        [
            {$match: {$expr:{$eq:["$_id", "$$player_id"]}}},
            {$project: {"username":1}}
        ], 
        as: "gameMaster"}};

const lookupPlayers = {$lookup: 
    {
        from: "users", 
        let: {player_id: "$players"}, 
        pipeline: 
        [
            {$match: {$expr:{$in:["$_id", "$$player_id"]}}},
            {$project: {"username":1}}
        ], 
        as: "players"}};

const lookupRound = {$lookup:
    {
        from: "rounds",
        let: {round_id: "$currentRound"},
        pipeline:
        [
            {$match: {$expr:{$eq:["$_id", "$$round_id"]}}},
            // fill question
            {$lookup:
                {
                    from: "questions",
                    let: {question_id: "$currentQuestion"},
                    pipeline:
                    [
                        {$match: {$expr:{$eq:["$_id", "$$question_id"]}}},
                        {$project: {"correctAnswer": 0}}
                    ],
                    as: "currentQuestion"
                }
            },
            {$unwind: "$currentQuestion"},
            {$project: {"correctAnswerPickedBy": 0}},
            // fill reader
            {$lookup:
                {
                    from: "users",
                    let: {reader_id: "$reader"},
                    pipeline:
                    [
                        {$match: {$expr:{$eq:["$_id", "$$reader_id"]}}},
                        {$project: {"username": 1}}
                    ],
                    as: "reader"
                }
            },
            {$unwind: "$reader"},
            // fill answered by
            {$lookup: 
                {
                    from: "answers",
                    let: {answer_id: "$answers"},
                    pipeline:
                    [
                        {$match: {$expr:{$in:["$_id", "$$answer_id"]}}},
                        {$project: {"creator": 1}},
                        // fill creator
                        {$lookup:
                            {
                                from: "users",
                                let: {creator_id: "$creator"},
                                pipeline:
                                [
                                    {$match: {$expr:{$eq:["$_id", "$$creator_id"]}}},
                                    {$project: {"username": 1}}
                                ],
                                as: "creator"
                            }
                        },
                        {$unwind: "$creator"}
                    ],
                    as: "answers"
                }
            }
        ],
        as: "currentRound"
    }
};

async function getAll(){
    return await db.Game.aggregate([lookupMaster, 
    {$unwind: "$gameMaster"},
    lookupPlayers]);
}

async function getAllCanRegisterOrIsPlayer(userId) {
    return await db.Game.aggregate([{$match: {$or: [{currentState: state.Register}, {players: ObjectId(userId)}]}}, lookupMaster, {$unwind: "$gameMaster"}, lookupPlayers]);
}

async function getById(id) {
    return await db.Game.aggregate([{$match: {_id: ObjectId(id)}}, lookupMaster, {$unwind: "$gameMaster"}, lookupPlayers, lookupRound, {$unwind: {path: "$currentRound", preserveNullAndEmptyArrays: true}}]);
}

async function addNewGame(game){
    let newGame =  await db.Game(game).save();
    return getById(newGame._id);
}

async function newRound(id) {
    // TODO move this logic to controller
    let game = await db.Game.findOne({_id: ObjectId(id)});
    if(!game){
        throw "No game found"
    }
    if(!game.players){
        throw "No players registered"
    }
    let usedQuestions = await db.Round.find({fromGame: ObjectId(id)});
    usedQuestions = usedQuestions.map(x => x.currentQuestion);
    // pick random new question
    let newQuestion = await db.Question.aggregate([
        {$match:{_id: {$nin: usedQuestions}, accepted: true}},
        {$sample: {size: 1}}
    ]);
    if(!newQuestion.length){
        throw "No more new questions available"
    }
    newQuestion = newQuestion[0];
    let nextReader;
    // find next reader
    if(!game.currentRound){
        // create the first round
        nextReader = game.players[0];
    }else{
        game.currentRound = await db.Round.findOne({_id: ObjectId(game.currentRound)});
        let currentReaderIndex = game.players.toString().indexOf(game.currentRound.reader._id);
        if(currentReaderIndex < game.players.length - 1){
            // pick next player
            nextReader = game.players[currentReaderIndex + 1];
        }else{
            // start from beginning
            nextReader = game.players[0];
        }
    }
    let newRound = await db.Round({
        currentQuestion: newQuestion,
        fromGame: ObjectId(id),
        reader: nextReader
    }).save();
    game.currentState = gameState.ReadQuestion;
    game.currentRound = newRound._id;
    let ret = await db.Game.updateOne({_id: game._id}, game);
    io.io().in(game.id).emit('logUpdate', 'New round started');
    io.io().in(game.id).emit('gameUpdate');
    return ret;
}

async function addAnswer(answer, user) {
    let game = await db.Game.findOne({_id: ObjectId(answer.game)});
    if(!game){
        throw "Game not found";
    }
    if(game.currentState != gameState.ReadQuestion){
        throw "Wrong game state";
    }
    // check if player is part of game
    if(!game.players.includes(ObjectId(user.id))){
        throw "Player not part of the game"
    }
    let round = await db.Round.findOne({_id: ObjectId(game.currentRound)})
    if(!round){
        throw "No current round.";
    }
    // check if already handed in answer
    let handedIn = await db.Round.aggregate([
        {$match: {_id: ObjectId(round._id)}},
        {$lookup: {
            from: "answers",
            let: {answer_id: "$answers"},
            pipeline:
            [
                {$match: {$expr:{$in:["$_id", "$$answer_id"]}}},
                {$project: {"creator": 1}},
                // fill creator
                {$lookup:
                    {
                        from: "users",
                        let: {creator_id: "$creator"},
                        pipeline:
                        [
                            {$match: {$expr:{$eq:["$_id", "$$creator_id"]}}},
                            {$project: {"_id": 1}}
                        ],
                        as: "creator"
                    }
                },
                {$unwind: "$creator"}
            ],
            as: "answeredby"
        }}
    ]);
    handedIn[0].answeredby.map(x => {
        if(x.creator._id == user.id){
            throw "User already answered this question!"
        }
    })
    await db.Answer(answer).save((err, answer) => {
        return db.Round.updateOne({_id: round._id}, {$addToSet: {answers: answer._id}})
        .then(data => {
        io.io().in(game.id).emit('logUpdate', `A player has handed in a answer.`);
        io.io().in(game.id).emit('gameUpdate');
            return data;});
        // TODO ERROR handling
    });
}

async function updateGame(game) {
    let oldGame = await db.Game.findOne({_id: game._id});
    if(!oldGame) {
        throw 'Game ID not found';
    }
    // preserve some fields
    game.createdAt = oldGame.createdAt;
    const newGame = await db.Game.findByIdAndUpdate(game._id, game, {new: true});
    return newGame;
}

async function deleteGame(id) {
    await db.Game.findByIdAndDelete({_id: id}).exec();
    return 'Game deleted';
}

async function joinGame(userId, gameid) {
    // addToSet: avoid double registration
    await db.Game.updateOne({_id: ObjectId(gameid)}, {$addToSet: {players: ObjectId(userId)}});
    return 'Player joined.';
}
