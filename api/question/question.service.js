const db = require('_helpers/db');
const { func } = require('@hapi/joi');
var ObjectId = require('mongoose').Types.ObjectId


module.exports = {
    getAll,
    getById,
    addNewQuestion,
    updateQuestion,
    deleteQuestion,
    getMy
}

async function getAll(){
    return await db.Question.aggregate([{$lookup: {from: "users", localField: "creator", foreignField:"_id", as:"creator"}}, {$unwind: "$creator"}, filterCriticalData]);
}

async function getMy(userid) {
    return await db.Question.aggregate([{$match: {creator: ObjectId(userid)}}, {$lookup: {from: "users", localField: "creator", foreignField:"_id", as:"creator"}}, {$unwind: "$creator"}, filterCriticalData]);
}

async function getById(id) {
    return await db.Question.aggregate([{$match: {_id: ObjectId(id)}}, {$lookup: {from: "users", localField: "creator", foreignField:"_id", as:"creator"}}, {$unwind: "$creator"}, filterCriticalData]);
}


async function addNewQuestion(question){
    let newquestion = await db.Question(question).save();
    return await db.Question.aggregate([{$match: {_id: ObjectId(newquestion._id)}}, {$lookup: {from: "users", localField: "creator", foreignField:"_id", as:"creator"}}, {$unwind: "$creator"}, filterCriticalData]);
}

async function updateQuestion(question) {
    let oldQuestion = await db.Question.findOne({_id: question._id});
    if(!oldQuestion) {
        throw 'Question ID not found';
    }
    // preserve some fields
    question.createdAt = oldQuestion.createdAt;
    question.creator = oldQuestion.creator;
    let newQuestion = await db.Question.findByIdAndUpdate(question._id, question, {new: true});
    return await db.Question.aggregate([{$match: {_id: ObjectId(newQuestion._id)}}, {$lookup: {from: "users", localField: "creator", foreignField:"_id", as:"creator"}}, {$unwind: "$creator"}, filterCriticalData]);
}

async function deleteQuestion(id) {
    const deleted = await db.Question.findByIdAndDelete({_id: id}).exec();
    return 'Question deleted';
}

const filterCriticalData = {
    $unset: ["creator.passwordHash", "creator.firstName", "creator.lastName", "creator.role"]
};
