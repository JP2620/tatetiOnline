const TicTacToe = require('./server/TicTacToe.js');
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var SOCKET_LIST = [];
var GAMES_LIST = [];

app.get('', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
serv.listen(2000);

var io = require('socket.io') (serv, {});
io.sockets.on('connection', (socket) => {
  console.log(socket.id);
  SOCKET_LIST.push(socket);
  if (SOCKET_LIST.length == 2) {
    GAMES_LIST.push(new TicTacToe(SOCKET_LIST[0].id, SOCKET_LIST[1].id));
  }


  socket.on('movimiento', (data) => {
    console.log(data);
    if (GAMES_LIST[0]) {
      GAMES_LIST[0].mov(data.user_id, data.row, data.col);
      console.log(GAMES_LIST[0].tablero);
      io.sockets.connected[SOCKET_LIST[0].id].emit('updBoard', 
       GAMES_LIST[0].tablero);
      io.sockets.connected[SOCKET_LIST[1].id].emit('updBoard',
       GAMES_LIST[0].tablero);
    }
  });
})