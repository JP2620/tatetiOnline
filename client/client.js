var socket;
let indexMatToArr = function(matriz, fila, columna) {
  return fila * matriz.length + columna;
}

function resetearTablero(arrayDeCasillas) {
  for (let boton of arrayDeCasillas) {
    boton.textContent = '';
  }
}

window.onload = () => {
  socket = io.connect('http://localhost:2000');

  let loading = document.getElementById("esperandoOponente");
  let botones = document.getElementsByClassName("cell");
  let cartel = document.getElementById('viewFinPartida');
  let continuar = document.getElementById('continuarJuego');

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

  continuar.addEventListener('click', () => {
    cartel.style.visibility = 'hidden';
    loading.style.visibility = 'visible';
    resetearTablero(botones);
    socket.emit('jugarAgain');
  });

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


  socket.on('disconnect_rival', () => {
    let cartel = document.getElementById('viewFinPartida');
    cartel.style.visibility = 'visible';
  });

  socket.on('inicioPartida', () => {
    loading.style.visibility = "hidden";
  });
};
