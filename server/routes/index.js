var express = require("express");
var router = express.Router();
router.use(express.urlencoded({ extended: true }));

// Fake Database
let UserDb = require("../models/Users.js");
let GameDB = require("../models/Game.js");
let TokenDB = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let ErrorReport = require("../models/Error.js");

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

let meta = new Metadata.Metadata(defaultTheme, TokenDB.getTokens());

new UserDb.User("dakota@test.com", "123", defaultTheme);
new UserDb.User("other@test.com", "123", defaultTheme);

// Routes

router.all("*", (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else if (req.session) {
    req.session.regenerate((err) => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

/**
 * GET GAMES FOR USER
 */
router.get("/", function (req, res, next) {
  try {
    let games = GameDB.getGamesByOwner(req.session.user.id);
    res.status(200).send(games);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

/**
 * CREATE NEW GAME
 */
router.post("/", function (req, res, next) {
  try {
    let color = req.query.color ? `#${req.query.color}` : "#FF0000";
    let playerToken = TokenDB.getTokenByName(req.body.playerToken);
    let computerToken = TokenDB.getTokenByName(req.body.computerToken);
    if (!color || !playerToken || !computerToken) {
      throw new Error("Invalid input(s) provided. Please try again.");
    }
    let theme = new Theme(color, playerToken, computerToken);
    let game = new GameDB.Game(theme, req.session.user.id);
    res.json(game);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

/**
 * GET DEFAULT THEME
 */
router.get("/meta/", function (req, res, next) {
  try {
    res.status(200).send(meta);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

/**
 * UPDATE USER DEFAULTS
 */
router.put("/defaults/", function (req, res, next) {
  try {
    if (Metadata.isMetadata(req.body.defaults)) {
      req.session.user.defaults = req.body.defaults;
      res.status(200).send(req.session.user.defaults);
    } else {
      throw new Error("Could not set user defaults, try again later.");
    }
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

/**
 * GET GAME FROM ID
 */
router.get("/gids/:gid", function (req, res, next) {
  try {
    let game = GameDB.getGameById(req.params.gid);
    res.status(200).send(game);
  } catch (err) {
    res.status(200).send(new ErrorReport.Error(err.message));
  }
});

/**
 * MAKE A MOVE
 */
router.post("/gids/:gid", function (req, res, next) {
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

router.get("/who", (req, res, next) => {
  let result = req.session && req.session.user;
  res.json(result);
});

module.exports = router;
