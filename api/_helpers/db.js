const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('users/user.model'),
    Question: require('question/question.model'),
    Game: require('game/game.model'),
    RefreshToken: require('users/refresh-token.model'),
    Answer: require('game/answer.model'),
    Round: require('game/round.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
