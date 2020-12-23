const db = require('_helpers/db');
const state = require('_helpers/gameState');
var ObjectId = require('mongoose').Types.ObjectId

module.exports = {
    getAll,
    getById,
    getAllCanRegister,
    addNewGame,
    updateGame,
    deleteGame,
    joinGame
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

async function getAll(){
    return await db.Game.aggregate([lookupMaster, 
    {$unwind: "$gameMaster"},
    lookupPlayers]);
}

async function getAllCanRegister() {
    return await db.Game.aggregate([{$match: {currentState: state.Register}}, lookupMaster, {$unwind: "$gameMaster"}, lookupPlayers]);
}

async function getById(id) {
    return await await db.Game.aggregate([{$match: {_id: ObjectId(id)}}, lookupMaster, {$unwind: "$gameMaster"}, lookupPlayers]);
}

async function addNewGame(game){
    let newGame =  await db.Game(game).save();
    return getById(newGame._id);
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
