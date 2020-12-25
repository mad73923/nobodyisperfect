const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;

const schema = new Schema({
    creator: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: {type: Date, default: Date.now},
    pickedBy: [{ type: ObjectId, ref: 'User'}],
    fromQuestion: { type: ObjectId, ref: 'Question', required: true}
});

module.exports = mongoose.model('Answer', schema);
