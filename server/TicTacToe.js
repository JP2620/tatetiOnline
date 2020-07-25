const VACIO = 10;
const P1    = 20;
const P2    = 30;
const SIZE = 3;

class TicTacToe {
  constructor(id_p1, id_p2) {
    this.p1 = id_p1;
    this.p2 = id_p2;
    this.tablero = [];
    for (let i = 0; i < SIZE; i++) {
      this.tablero.push([]);
      for (let j = 0; j < SIZE; j++) {
        this.tablero[i].push(VACIO);
      }
    }
    console.log(this.tablero);
  }

  mov(id_p, row, col) {
    console.log(id_p);
    console.log(this);
    if (this.tablero[row][col] === VACIO) {
      this.tablero[row][col] = id_p === this.p1? P1 : P2;
    }
  }
}


module.exports = TicTacToe;