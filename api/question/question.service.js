const db = require('_helpers/db');


module.exports = {
    getAll,
    addNewQuestion,
    updateQuestion
}

async function getAll(){
    return await db.Question.find();
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
