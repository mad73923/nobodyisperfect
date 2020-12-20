const db = require('_helpers/db');
const { func } = require('@hapi/joi');


module.exports = {
    getAll,
    getById,
    addNewQuestion,
    updateQuestion,
    deleteQuestion
}

async function getAll(){
    return await db.Question.find();
}

async function getById(id) {
    return await db.Question.findById(id);
}


async function addNewQuestion(question){
    return await(db.Question(question).save());
}

async function updateQuestion(question) {
    let updatedQuestion = await db.Question.findOne({_id: question._id});
    if(!updatedQuestion) {
        throw 'Question ID not found';
    }
    const newQuestion = await db.Question.findByIdAndUpdate(question._id, question, {new: true});
    return newQuestion;
}

async function deleteQuestion(id) {
    const deleted = await db.Question.findByIdAndDelete({_id: id}).exec();
    return 'User deleted';
}
