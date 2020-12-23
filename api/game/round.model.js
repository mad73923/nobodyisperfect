const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;

const schema = new Schema({
    currentQuestion: { type: ObjectId, ref: 'Question', required: true },
    fromGame: {type: ObjectId, ref: 'Game', required: true },
    correctAnswerPickedBy: [{ type: ObjectId, ref: 'User'}],
    answers: [{ type: ObjectId, ref: 'Answer'}],
    reader: { type: ObjectId, ref: 'User', required: true },
    creator: { type: ObjectId, ref: 'User', required: true },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Round', schema);
