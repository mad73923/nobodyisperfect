const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;

const schema = new Schema({
    text: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    creator: { type: ObjectId, ref: 'User', required: true },
    createdAt: {type: Date, default: Date.now},
    accepted: {type: Boolean, default: false},
    imagePath: {type: String}
});

module.exports = mongoose.model('Question', schema);
