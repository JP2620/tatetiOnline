const Partida = require('./server/Partida');
var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var SOCKET_WAIT_Q = new Queue();


/**
 * boilerplate
 */
app.get('', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
serv.listen(PORT);
console.log("Running on port: " + PORT);

var io = require('socket.io')(serv, {});
io.sockets.on('connection', (socket) => {

  //Cuando se conecta lo agrega a la lista de espera

  SOCKET_WAIT_Q.enqueue(socket.id);

  /**
   * Si hace un movimiento, lo hace en el juego y chequea si termino,
   * si termino les avisa si ganaron/perdieron y da por terminada la partida, 
   * dandole un valor undefined
   */

  socket.on('movimiento', (data) => {
    if (socket.partida) {
      let game = socket.partida.game;
      game.mov(data.user_id, data.row, data.col);

      if (game.termino === true) {
        let ganador = game.lastTurn;
        let perdedor = ganador === game.p1 ? game.p2 : game.p1;
        io.sockets.connected[ganador].emit('ganoPartida');
        io.sockets.connected[perdedor].emit('perdioPartida');
        io.sockets.in(socket.partida.room).emit('updBoard', game.tablero);
        io.sockets.connected[ganador].partida = undefined;
        io.sockets.connected[perdedor].partida = undefined;
      } 
      
      else {
        io.sockets.in(socket.partida.room).emit('updBoard', game.tablero);
      }
    }
  });

  /** 
   * Si se desconectó y está en partida le avisa al otro jugador y da por terminada la partida
   * sino, chequea si esta en la lista de espera y lo remueve
   * */

  socket.on('disconnect', () => {
    console.log("Se desconecto alguien, quedan" + Object.keys(io.sockets.connected).length);
    if (socket.partida) {
      let idOtroP = socket.id === socket.partida.game.p1? socket.partida.game.p2 : socket.partida.game.p1;
      let otroPlayer = io.sockets.connected[idOtroP];
      otroPlayer.emit('disconnect_rival');
      otroPlayer.partida = undefined;
    } else if (SOCKET_WAIT_Q.includes(socket.id)) {
      SOCKET_WAIT_Q.remove(socket.id);
    }
  });

  //Si quiere jugar de nuevo lo agrega a la cola de espera
  socket.on('jugarAgain', () => SOCKET_WAIT_Q.enqueue(socket.id));
});

/**
 * Hace polling cada 100ms chequeando si crear partida
 */

setInterval(crearPartida, 100);

/**
 * Si hay mas de un socket esperando partida, saca 2 de la cola y los pone en la misma partida
 * */

function crearPartida() {
  if (SOCKET_WAIT_Q.getLength() > 1) {
    let p1 = io.sockets.connected[SOCKET_WAIT_Q.dequeue()];
    let p2 = io.sockets.connected[SOCKET_WAIT_Q.dequeue()];
    let partida = new Partida(p1.id, p2.id);
    console.log("Creando juego con: ", p1.id, p2.id);
    p1.join(partida.room);
    p2.join(partida.room);
    io.sockets.in(partida.room).emit("inicioPartida");
    p1.partida = partida;
    p2.partida = partida;
  } 
}

// Cola que no agrega repetidos, porque no da jugar contra vos mismo
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

