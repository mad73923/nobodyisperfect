const db = require('_helpers/db');


module.exports = {
    getAll,
    addNewQuestion
}

async function getAll(){
    return await db.Question.find();
}


async function addNewQuestion(question){
    return await(db.Question(question).save());
}
