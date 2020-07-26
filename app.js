const TicTacToe = require('./server/TicTacToe.js');
var PORT = process.env.PORT || 5000;
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
      if (game.termino === true) {
        let ganador = game.lastTurn;
        let perdedor = ganador === game.p1 ? game.p2 : game.p1;
        io.sockets.connected[ganador].emit('ganoPartida');
        io.sockets.connected[perdedor].emit('perdioPartida');
      }
      io.sockets.connected[game.p1].emit('updBoard',
        game.tablero);
      io.sockets.connected[game.p2].emit('updBoard',
        game.tablero);
    }
  });

  socket.on('disconnect', () => {
    console.log("Se desconecto alguien, quedan" + Object.keys(io.sockets.connected).length);
    if (socket.game) {
      let idOtroP = socket.id === socket.game.p1? socket.game.p2 : socket.game.p1;
      let otroPlayer = io.sockets.connected[idOtroP];
      otroPlayer.emit('disconnect_rival');
      otroPlayer.game = undefined;
    } else if (SOCKET_WAIT_Q.includes(socket.id)) {
      SOCKET_WAIT_Q.remove(socket.id);
    }
  });

  socket.on('jugarAgain', () => SOCKET_WAIT_Q.enqueue(socket.id));



});

setInterval(crearGame, 100);

//function Queue() { var a = [], b = 0;this.getArray = function() {return a} ;this.getLength = function () { return a.length - b }; this.isEmpty = function () { return 0 == a.length }; this.enqueue = function (b) { a.push(b) }; this.dequeue = function () { if (0 != a.length) { var c = a[b]; 2 * ++b >= a.length && (a = a.slice(b), b = 0); return c } }; this.peek = function () { return 0 < a.length ? a[b] : void 0 } };
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

// Cola que no agrega repetidos
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    for (let i = 0; i < this.getLength(); i++) {
      if (this.getArray()[i] === item) {
        return;
      }
    } 
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

  this.getArray = function() {
    return queue;
  }

  this.includes = function(elem) {
    return this.getArray().includes(elem);
  }

  this.remove = function(elem) {
    const index = queue.indexOf(elem);
    if (index > -1) {
      queue.splice(index, 1);
    }
  }


}

