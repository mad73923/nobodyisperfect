const db = require('_helpers/db');
const state = require('_helpers/gameState')

module.exports = {
    getAll,
    getById,
    getAllCanRegister,
    addNewGame,
    updateGame,
    deleteGame
}

async function getAll(){
    return await db.Game.aggregate([{$lookup: {from: "users", localField: "gameMaster", foreignField:"_id", as:"gameMaster"}}, {$unwind: "$gameMaster"}, filterCriticalData]);
}

async function getAllCanRegister() {
    return await db.Game.aggregate([{$match: {currentState: state.Register}}, {$lookup: {from: "users", localField: "gameMaster", foreignField:"_id", as:"gameMaster"}}, {$unwind: "$gameMaster"}, filterCriticalData]);
}

async function getById(id) {
    return await db.Game.findById(id);
}

async function addNewGame(game){
    return await db.Game(game).save();
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
    const deleted = await db.Game.findByIdAndDelete({_id: id}).exec();
    return 'Game deleted';
}

const filterCriticalData = {
    $unset: ["gameMaster.passwordHash", "gameMaster.firstName", "gameMaster.lastName", "gameMaster.role"]
};
