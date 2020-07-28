const TicTacToe = require('./TicTacToe.js');

class Partida {
  constructor(id_p1, id_p2) {
    this.game = new TicTacToe(id_p1, id_p2);
    this.room = String(Date.now());
  }
}

module.exports = Partida;