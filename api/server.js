﻿require('rootpath')();
const express = require('express');
const app = express();
const http = require('http');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

// create test user in db on startup if required
const createTestUser = require('_helpers/create-test-user');
createTestUser();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => {
    callback(null, true);
}, credentials: true }));

// api routes
app.use('/users', require('./users/users.controller'));
// question routes
app.use('/question', require('./question/question.controller'))
// game routes
app.use('/game', require('./game/game.controller'))


// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
var server = http.createServer(app);

var io = require('socket.io')(server, {
    cors: 
        {origin: (origin, callback) => {
            callback(null, true);
        }, 
        credentials: true
    }
    });

server.listen(port, () => {
    console.log('Server listening on port ' + port);
});

io.on('connection', (socket) => {
    console.log('a user connected');
  });

module.exports = app;
