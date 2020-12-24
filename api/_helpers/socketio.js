// TODO update to socketio 3
var sio = require('socket.io');
var io = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  io = sio(server);

  io.on('connection', (socket) => {
      let username = '';
      let gameid = '';

      socket.on('gameJoined', (pgameid, pusername) => {
          username = pusername;
          gameid = pgameid;
          socket.join(gameid);
          text = `${username} has connected to the game.`
          io.in(gameid).emit('logUpdate', text);
      });

      socket.on('disconnecting', () => {
        if(username && gameid){
            text = `${username} has left the game.`
            io.in(gameid).emit('logUpdate', text);
        }
      }); 

  });
};
