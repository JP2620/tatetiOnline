var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
serv.listen(2000);

var io = require('socket.io') (serv, {});
io.sockets.on('connection', (socket) => {
  console.log('socket connection');


  socket.on('movimiento', () => {
    console.log("hola");
  });
})