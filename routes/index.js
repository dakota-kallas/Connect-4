var express = require("express");
var router = express.Router();

// Fake Database
let GameDB = require("../models/Game.js");
let TokenDB = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let Error = require("../models/Error.js");

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

router.get("/gids/:gid", function (req, res, next) {
  res.status(200).send(GameDB.getGameById(gid));
});

router.post("/gids/:gid", function (req, res, next) {
  res.status(200).send(GameDB.addToken(req.params.gid, req.params.move));
});

router.post("/", function (req, res, next) {
  let theme = new theme(
    req.body.color,
    TokenDB.getTokenByName(req.body.playerToken),
    TokenDB.getTokenByName(req.body.computerToken)
  );
  res.status(200).send(new GameDB.Game(theme, Date.now));
});

module.exports = router;
