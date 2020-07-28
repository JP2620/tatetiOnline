const VACIO = 10;
const P1    = 20;
const P2    = 30;
const SIZE = 3;

class TicTacToe {
  constructor(id_p1, id_p2) {
    this.p1 = id_p1;
    this.p2 = id_p2;
    this.lastTurn = id_p2;
    this.tablero = [];
    this.termino = false;
    for (let i = 0; i < SIZE; i++) {
      this.tablero.push([]);
      for (let j = 0; j < SIZE; j++) {
        this.tablero[i].push(VACIO);
      }
    }
  }

  mov(id_p, row, col) {
    //Chequea que la casilla esté vacía y sea su turno
    if (this.tablero[row][col] === VACIO 
      && this.lastTurn !== id_p) {
      this.tablero[row][col] = id_p === this.p1? P1 : P2;
      if (this.checkWinner(row, col)) {
        this.termino = true;
      }
      this.lastTurn = id_p;
    }
    console.log(this.tablero);
  }

  checkWinner(row, col) {
    //Chequeo fila
    if (this.tablero[row][0] === this.tablero[row][1]
    && this.tablero[row][0] === this.tablero[row][2]) {
      return true;
    }

    //chequeo columna
    else if (this.tablero[0][col] === this.tablero[1][col]
    && this.tablero[0][col] === this.tablero[2][col]) {
      return true;
    }

    //chequeo diagonales si hace falta
    if (row === col || (row + col) === SIZE-1) {
      //diagonal principal
      let result1 = this.tablero[1][1] !== VACIO
        && this.tablero[0][0] === this.tablero[1][1] 
        && this.tablero[0][0] === this.tablero[2][2];
      //la otra
      let result2 = this.tablero[1][1] !== VACIO
        && this.tablero[0][2] === this.tablero[1][1]
        && this.tablero[0][2] === this.tablero[2][0];
        
      return result1 || result2;
    }

    return false;
  }
}


module.exports = TicTacToe;