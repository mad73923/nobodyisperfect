const db = require('_helpers/db');
const state = require('_helpers/gameState');
const gameState = require('../_helpers/gameState');
var ObjectId = require('mongoose').Types.ObjectId;
const io = require('_helpers/socketio');

module.exports = {
    getAll,
    getById,
    getAllCanRegister,
    addNewGame,
    updateGame,
    deleteGame,
    joinGame,
    newRound
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
            {$project: {"correctAnswerPickedBy": 0}}
        ],
        as: "currentRound"
    }
};

async function getAll(){
    return await db.Game.aggregate([lookupMaster, 
    {$unwind: "$gameMaster"},
    lookupPlayers]);
}

async function getAllCanRegister() {
    return await db.Game.aggregate([{$match: {currentState: state.Register}}, lookupMaster, {$unwind: "$gameMaster"}, lookupPlayers]);
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
