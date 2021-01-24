// TODO update to socketio 3
var sio = require('socket.io');
const { use } = require('../users/users.controller');
var io = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  io = sio(server);

  io.on('connection', (socket) => {
      let username = '';
      let gameid = '';
      let focus = false;

      socket.on('gameJoined', (pgameid, pusername) => {
          username = pusername;
          gameid = pgameid;
          socket.join(gameid);
          text = `${username} has connected to the game.`
          io.in(gameid).emit('logUpdate', text);
          focus = true;
      });

      socket.on('disconnecting', () => {
        if(username && gameid){
            text = `${username} has left the game.`
            io.in(gameid).emit('logUpdate', text);
        }
      });

      socket.on('focusLost', () => {
        if(username && gameid && focus){
          io.in(gameid).emit('logUpdate', `${username} has lost focus on game.`)
        }
        focus = false;
      });

      socket.on('focusBack', () => {
        if(username && gameid && !focus){
          io.in(gameid).emit('logUpdate', `${username} focuses back in game.`)
        }
        focus = true;
      });

  });
};
