var socket;

let indexMatToArr = function(matriz, fila, columna) {
  return fila * matriz.length + columna;
}

window.onload = () => {
  socket = io.connect('https://tatetitest.herokuapp.com/:2000');

  let botones = document.getElementsByClassName("cell");
  for (let boton of botones) {
    boton.addEventListener('click', () => {
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
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let boton = botones[indexMatToArr(board, i, j)];
        switch(board[i][j]) {
          case 20:
            boton.textContent = 'X';
            break;
          case 30:
            boton.textContent = 'O';
            break;
          default:
            boton.textContent = '';
        }
      }
    }
  });


};
