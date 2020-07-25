var socket;
window.onload = () => {
  socket = io.connect('http://localhost:2000');

  let botones = document.getElementsByClassName("cell");
  for (let boton of botones) {
    boton.addEventListener('click', () => {
      boton.style.backgroundColor = 'brown';
      let row = /(?<=row)\d+/g.exec(boton.parentElement.id);
      let column = /(?<=tatetiCol)\d+/g.exec(boton.classList[0]);
      socket.emit('movimiento', {
        user_id: socket.id,
        row: Number(row[0]),
        col: Number(column[0])
      });
    });
  }



  socket.on('updBoard', (board) => {
    console.log("updBoard");
    console.log(board);
  });


};
