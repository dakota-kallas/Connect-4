var express = require("express");
var router = express.Router();

// Fake Database
let GameDB = require("../models/Game.js");
let TokenDB = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let Error = require("../models/Error.js");
let SessionDB = require("../models/Session.js");

new TokenDB.Token(
  "Sailor Boy",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar37.gif"
);
new TokenDB.Token(
  "Popcorn",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar34.gif"
);
new TokenDB.Token(
  "T-Rex",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar33.gif"
);

let defaultTheme = new Theme(
  "#FF0000",
  TokenDB.getTokenByName("Sailor Boy"),
  TokenDB.getTokenByName("Popcorn")
);

let meta = new Metadata(defaultTheme, TokenDB.getTokens());

// Routes

router.get("/meta/", function (req, res, next) {
  try {
    res.status(200).send(meta);
  } catch (err) {
    res.status(200).send(new Error(err.message));
  }
});

// CREATE NEW SESSION
router.post("/sids/", function (req, res, next) {
  res.status(200).send(new SessionDB.Session());
});

// GET GAMES FOR SESSION
router.get("/sids/:sid", function (req, res, next) {
  try {
    let sessionGIDs = SessionDB.getGamesBySID(req.params.sid);
    let games = GameDB.getGamesFromList(sessionGIDs);
    res.status(200).send(games);
  } catch (err) {
    res.status(200).send(new Error(err.message));
  }
});

// CREATE NEW GAME
router.post("/sids/:sid", function (req, res, next) {
  let color = req.query.color ? `#${req.query.color}` : "#FF0000";
  let theme = new Theme(
    color,
    TokenDB.getTokenByName(req.body.playerToken),
    TokenDB.getTokenByName(req.body.computerToken)
  );
  let game = new GameDB.Game(theme);
  SessionDB.addGame(req.params.sid, game.id);
  res.json(game);
});

// GET GAME FROM ID
router.get("/sids/:sid/gids/:gid", function (req, res, next) {
  try {
    res.status(200).send(GameDB.getGameById(gid));
  } catch (err) {
    res.status(200).send(new Error(err.message));
  }
});

// MAKE A MOVE
router.post("/sids/:sid/gids/:gid", function (req, res, next) {
  try {
    let nextRow = GameDB.getNextAvailableSlot(req.params.gid, req.query.move);
    if (nextRow < 0 || nextRow > 4) {
      res.status(400).send("Invalid input. Please try again.");
    } else {
      let game = GameDB.addToken(req.params.gid, nextRow, req.query.move);
      res.status(200).send(game);
    }
  } catch (err) {
    res.status(200).send(new Error(err.message));
  }
});

module.exports = router;
