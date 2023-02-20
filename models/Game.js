const { v4: uuidv4 } = require("uuid");

const GAMES = {};

class Game {
  constructor(theme) {
    this.theme = theme;
    this.start = new Date(Date.now());
    this.end = undefined;
    this.status = Statuses.UNFINISHED;
    this.id = uuidv4();
    this.grid = [
      [" ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " "],
    ];

    GAMES[this.id] = this;
  }
}

const Statuses = {
  VICTORY: "Victory",
  LOSS: "Loss",
  UNFINISHED: "Unfinished",
  TIE: "Tie",
};

/**
 * @returns All declared GAMES
 */
function getGames() {
  let result = Object.values(GAMES);
  return result.map((game) => Object.assign({}, game));
}

/**
 * PRE: A valid list of GIDs is provided
 * @param {ids[]} games
 * @returns
 */
function getGamesFromList(gameList) {
  // let result = Object.values(
  //   GAMES.filter((game) => gameList.includes(game.id))
  // );
  let result = Object.values(GAMES);
  return result.map((game) => Object.assign({}, game));
}

/**
 * PRE: A valid GID was provided
 * @param {id} gid
 * @returns The game associated with the provided GID
 */
function getGameById(gid) {
  let game = GAMES[gid];
  return game && Object.assign({}, game);
}

/**
 * Get the next available slot in a given column.
 * PRE: provided a valid GID.
 * @param {id} gid
 * @param {int} column
 * @returns
 */
function getNextAvailableSlot(gid, column) {
  let game = GAMES[gid];
  for (let row = 0; row < game.grid.length; row++) {
    if (game.grid[row][column] === " ") {
      return row;
    }
  }
  // If all rows in the column are occupied, return -1 to indicate failure
  return -1;
}

/**
 * PRE: the row & column location is unoccupied.
 * @param {id} gid
 * @param {int} row
 * @param {int} column
 * @param {boolean} player
 */
function addToken(gid, row, column, player) {
  let game = GAMES[gid];
  game.grid[row][column] = player ? "X" : "O";
}

module.exports = {
  Game: Game,
  Statuses: Statuses,
  getGames: getGames,
  getGamesFromList: getGamesFromList,
  getGameById: getGameById,
  getNextAvailableSlot: getNextAvailableSlot,
  addToken: addToken,
};
