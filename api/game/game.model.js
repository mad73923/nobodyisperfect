const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const state = require('../_helpers/gameState');

const schema = new Schema({
    name: { type: String, required: true },
    gameMaster: { type: ObjectId, ref: 'User', required: true },
    createdAt: {type: Date, default: Date.now},
    players: [{ type: ObjectId, ref: 'User'}],
    currentState:{ type: String, required: true, enum: Object.values(state), default: state.Register },
    stateUntil: {type: Date},
    currentRound: { type: ObjectId, ref: 'Round'},
});

module.exports = mongoose.model('Game', schema);
