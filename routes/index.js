var express = require("express");
var router = express.Router();

// Fake Database
let Game = require("../models/Game.js");
let Token = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let Error = require("../models/Error.js");

let gameTable = {};
let validTokens = {};

[
  new Token(
    "Kenny",
    "https://charity.cs.uwlax.edu/assets/avatars/avatar37.gif"
  ),
  new Token(
    "Green Girl",
    "https://charity.cs.uwlax.edu/assets/avatars/avatar34.gif"
  ),
  new Token(
    "Alien",
    "https://charity.cs.uwlax.edu/assets/avatars/avatar33.gif"
  ),
].forEach((t) => (validTokens[t.id] = t));

let defaultTheme = new Theme(
  "#FF0000",
  getTokenByName("Kenny"),
  getTokenByName("Green Girl")
);

let meta = new Metadata(defaultTheme, validTokens);

function getGames() {
  return Object.values(gameTable);
}

function getGameById(gid) {
  return gameTable[gid];
}

function getTokens() {
  return Object.values(validTokens);
}

function getTokenByName(name) {
  return Object.values(validTokens).filter((t) => t.name == name);
}

function createGame(game) {
  let newGame = new Game(game.theme, game.start);
  gameTable[newGame.id] = newGame;
  return newGame;
}

function nextAvailableSlot(game, column) {
  for (let row = 0; row < game.grid.length; row++) {
    if (game.grid[row][column] === " ") {
      return row;
    }
  }
  // If all rows in the column are occupied, return -1 to indicate failure
  return -1;
}

function makeMove(gid, move, player) {
  let nextAvailableRow = nextAvailableSlot(gameTable[gid], move);
  if (nextAvailableRow != -1) {
    gameTable[gid].grid[row][column] = player ? "X" : "O";
    return gameTable[gid];
  }
  return -1;
}

// Routes

// GET A LIST OF ALL USERS
router.get("/meta/", function (req, res, next) {
  res.status(200).send(meta);
});

router.get("/sids/:sid/gids/:gid", function (req, res, next) {
  res.status(200).send(getGameById(gid));
});

router.post("/sids/:sid/gids/:gid", function (req, res, next) {
  res.status(200).send(makeMove(req.params.gid, req.params.move));
});

module.exports = router;
