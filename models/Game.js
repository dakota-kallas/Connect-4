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
  VICTORY: "VICTORY",
  LOSS: "LOSS",
  UNFINISHED: "UNFINISHED",
  TIE: "TIE",
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
  let gamesArray = Object.values(GAMES);
  let result = gamesArray.filter((game) => gameList.includes(game.id));
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
  game = GAMES[gid];

  for (let row = game.grid.length - 1; row >= 0; row--) {
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
function addToken(gid, row, column) {
  let game = GAMES[gid];

  if (game.grid[row][column] == " ") {
    game.grid[row][column] = "X";

    let computerMoved = false;
    let computerCol;
    let computerRow;
    let isGridFull = isGridFull(game.grid);
    if (!isGridFull) {
      while (!computerMoved) {
        computerCol = Math.floor(Math.random() * 7);
        computerRow = getNextAvailableSlot(gid, computerCol);
        if (computerRow == -1) {
          continue;
        } else if (computerRow == row && computerCol == column) {
          if (computerRow == 0) {
            continue;
          }
          computerRow--;
        }
        if (game.grid[computerRow][computerCol] == " ") {
          game.grid[computerRow][computerCol] = "O";
          computerMoved = true;
        }
      }
    }

    let winner = checkForWin(game.grid);
    if (winner) {
      if (winner == "X") {
        game.status = Statuses.VICTORY;
        if (computerMoved) {
          game.grid[computerRow][computerCol] = " ";
        }
      } else {
        game.status = Statuses.LOSS;
      }
      game.end = new Date(Date.now());
    } else if (isGridFull) {
      game.status = Statuses.TIE;
      game.end = new Date(Date.now());
    }
  }

  return game;
}

/**
 * @param {Game.grid} grid
 * @returns The winning player or null if no one has won
 */
function checkForWin(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Check for horizontal win
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (
        grid[row][col] !== " " &&
        grid[row][col] === grid[row][col + 1] &&
        grid[row][col] === grid[row][col + 2] &&
        grid[row][col] === grid[row][col + 3]
      ) {
        return grid[row][col];
      }
    }
  }

  // Check for vertical win
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        grid[row][col] !== " " &&
        grid[row][col] === grid[row + 1][col] &&
        grid[row][col] === grid[row + 2][col] &&
        grid[row][col] === grid[row + 3][col]
      ) {
        return grid[row][col];
      }
    }
  }

  // Check for diagonal win (top-left to bottom-right)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (
        grid[row][col] !== " " &&
        grid[row][col] === grid[row + 1][col + 1] &&
        grid[row][col] === grid[row + 2][col + 2] &&
        grid[row][col] === grid[row + 3][col + 3]
      ) {
        return grid[row][col];
      }
    }
  }

  // Check for diagonal win (top-right to bottom-left)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 3; col < cols; col++) {
      if (
        grid[row][col] !== " " &&
        grid[row][col] === grid[row + 1][col - 1] &&
        grid[row][col] === grid[row + 2][col - 2] &&
        grid[row][col] === grid[row + 3][col - 3]
      ) {
        return grid[row][col];
      }
    }
  }

  // If no winning combinations are found, return null
  return null;
}

/**
 * @param {Game.grid} grid
 * @returns a boolean representing if the grid is full
 */
function isGridFull(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === " ") {
        return false;
      }
    }
  }
  return true;
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
