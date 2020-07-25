const TicTacToe = require('./server/TicTacToe.js');
var PORT = 2000;
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var SOCKET_WAIT_Q = new Queue();



app.get('', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
serv.listen(PORT);
console.log("Running on port: " + PORT);

var io = require('socket.io')(serv, {});
io.sockets.on('connection', (socket) => {

  SOCKET_WAIT_Q.enqueue(socket.id);

  socket.on('movimiento', (data) => {
    if (io.sockets.connected[data.user_id].game) {
      let game = io.sockets.connected[data.user_id].game;
      game.mov(data.user_id, data.row, data.col);
      io.sockets.connected[game.p1].emit('updBoard',
        game.tablero);
      io.sockets.connected[game.p2].emit('updBoard',
        game.tablero);
    }
  });

  socket.on('disconnect', () => {
    if (socket.game) {
      let idOtroP = socket.id === socket.game.p1? socket.game.p2 : socket.game.p1;
      let otroPlayer = io.sockets.connected[idOtroP];
      otroPlayer.emit('disconnect_rival');
      otroPlayer.game = undefined;

      console.log(socket.game.tablero);
    }

  });

  socket.on('jugarAgain', () => SOCKET_WAIT_Q.enqueue(socket.id));



});

setInterval(crearGame, 100);

function Queue() { var a = [], b = 0; this.getLength = function () { return a.length - b }; this.isEmpty = function () { return 0 == a.length }; this.enqueue = function (b) { a.push(b) }; this.dequeue = function () { if (0 != a.length) { var c = a[b]; 2 * ++b >= a.length && (a = a.slice(b), b = 0); return c } }; this.peek = function () { return 0 < a.length ? a[b] : void 0 } };
function crearGame() {
  if (SOCKET_WAIT_Q.getLength() > 1) {
    let game = new TicTacToe(SOCKET_WAIT_Q.dequeue(), SOCKET_WAIT_Q.dequeue());
    console.log("Creando juego con: ", game.p1, game.p2);
    io.sockets.connected[game.p1].emit("inicioPartida");
    io.sockets.connected[game.p2].emit("inicioPartida");
    io.sockets.connected[game.p1].game = game;
    io.sockets.connected[game.p2].game = game;
  } 
}