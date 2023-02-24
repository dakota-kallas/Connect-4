var express = require("express");
var router = express.Router();
router.use(express.urlencoded({ extended: true }));

// Fake Database
let GameDB = require("../models/Game.js");
let TokenDB = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let ErrorReport = require("../models/Error.js");
let SessionDB = require("../models/Session.js");

new TokenDB.Token("Sailor Boy", "./assets/sailorboy.gif");
new TokenDB.Token("Popcorn", "./assets/popcorn.gif");
new TokenDB.Token("T-Rex", "./assets/trex.gif");
new TokenDB.Token("Carl", "./assets/carl.gif");
new TokenDB.Token("Motorcycle", "./assets/motorcycle.gif");
new TokenDB.Token("Nuclear", "./assets/nuclear.gif");

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
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

// CREATE NEW SESSION
router.post("/sids/", function (req, res, next) {
  const session = new SessionDB.Session();
  res.setHeader("X-sid", session.id);
  res.status(200).send();
});

// GET GAMES FOR SESSION
router.get("/sids/:sid", function (req, res, next) {
  try {
    let sessionGIDs = SessionDB.getGamesBySID(req.params.sid);
    let games = GameDB.getGamesFromList(sessionGIDs);
    res.status(200).send(games);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

// CREATE NEW GAME
router.post("/sids/:sid", function (req, res, next) {
  try {
    if (!SessionDB.isAuthenticatedSession(req.params.sid)) {
      throw new Error("Unable to create game, try again later.");
    }
    let color = req.query.color ? `#${req.query.color}` : "#FF0000";
    let playerToken = TokenDB.getTokenByName(req.body.playerToken);
    let computerToken = TokenDB.getTokenByName(req.body.computerToken);
    if (!color || !playerToken || !computerToken) {
      throw new Error("Invalid input(s) provided. Please try again.");
    }
    let theme = new Theme(color, playerToken, computerToken);
    let game = new GameDB.Game(theme);
    SessionDB.addGame(req.params.sid, game.id);
    res.json(game);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

// GET GAME FROM ID
router.get("/sids/:sid/gids/:gid", function (req, res, next) {
  try {
    if (
      SessionDB.isAuthenticatedSession(req.params.sid) &&
      SessionDB.isAuthenticatedGame(req.params.sid, req.params.gid)
    ) {
      res.status(200).send(GameDB.getGameById(req.params.gid));
    } else {
      throw new Error("Unable to load game, try again later.");
    }
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
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
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

module.exports = router;
