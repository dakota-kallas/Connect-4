const { v4: uuidv4 } = require("uuid");

class Game {
  constructor(theme, start) {
    this.theme = theme;
    this.start = start;
    this.end = undefined;
    this.status = Statuses.UNFINISHED;
    this.id = uuidv4();
    this.grid = [];
  }
}

const Statuses = {
  VICTORY: "Victory",
  LOSS: "Loss",
  UNFINISHED: "Unfinished",
  TIE: "Tie",
};

module.exports = Game;
