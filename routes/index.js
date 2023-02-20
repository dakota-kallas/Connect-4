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
  "Kenny",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar37.gif"
);
new TokenDB.Token(
  "Green Girl",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar34.gif"
);
new TokenDB.Token(
  "Alien",
  "https://charity.cs.uwlax.edu/assets/avatars/avatar33.gif"
);

let defaultTheme = new Theme(
  "#FF0000",
  TokenDB.getTokenByName("Kenny"),
  TokenDB.getTokenByName("Green Girl")
);

let meta = new Metadata(defaultTheme, TokenDB.getTokens());

// Routes

router.get("/meta/", function (req, res, next) {
  res.status(200).send(meta);
});

router.post("/sids/", function (req, res, next) {
  res.status(200).send(new SessionDB.Session());
});

router.get("/sids/:sid", function (req, res, next) {
  let sessionGIDs = SessionDB.getGamesBySID(req.params.sid);
  res.status(200).send(GameDB.getGamesFromList(sessionGIDs));
  //res.status(200).send(sessionGIDs);
});

router.get("/sids/:sid/gids/:gid", function (req, res, next) {
  res.status(200).send(GameDB.getGameById(gid));
});

router.post("/sids/:sid/gids/:gid", function (req, res, next) {
  res.status(200).send(GameDB.addToken(req.params.gid, req.params.move));
});

router.post("/sids/:sid", function (req, res, next) {
  let theme = new Theme(
    req.body.color,
    TokenDB.getTokenByName(req.body.playerToken),
    TokenDB.getTokenByName(req.body.computerToken)
  );
  let game = new GameDB.Game(theme);
  SessionDB.addGame(req.params.sid, game.id);
  res.json(game);
});

module.exports = router;
