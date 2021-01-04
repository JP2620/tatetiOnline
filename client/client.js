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
  socket = io.connect(document.location.protocol+'//'+document.location.host);

  let msgWindow = document.getElementById('msgContainer');
  let loading = document.getElementById("esperandoOponente");
  let botones = document.getElementsByClassName("cell");
  let continuar = document.getElementById('continuarJuego');
  let cartel = document.getElementById('viewFinPartida');
  let cartelTitulo = document.getElementById('tituloFinPartida');
  let cartelMensaje = document.getElementById('textoFinPartida');

  for (let boton of botones) {

    /**
     * Manda al server la posicion del boton para validarlo y 
     * actualizar el estado del tablero
     */
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

  /**
   * Cuando clickea para continuar, le avisa al server
   */

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
    cartelTitulo.textContent = "GANASTE";
    cartelMensaje.textContent = "Se desconecto tu oponente.";
    cartel.style.visibility = 'visible';
  });

  socket.on('perdioPartida', () => {
    cartelTitulo.textContent = "PERDISTE";
    cartelMensaje.textContent = "Inténtalo de nuevo.";
    cartel.style.visibility = 'visible';
  });

  socket.on('ganoPartida', () => {
    cartelTitulo.textContent = "GANASTE";
    cartelMensaje.textContent = "Juega de nuevo.";
    cartel.style.visibility = 'visible';
  });

  socket.on('inicioPartida', () => {
    loading.style.visibility = "hidden";
  });

};
