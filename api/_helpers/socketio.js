// TODO update to socketio 3
var sio = require('socket.io');
var io = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  io = sio(server);

  io.on('connection', () => {
      console.log("connected")
  }) 
};
