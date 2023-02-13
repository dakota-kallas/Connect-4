var express = require("express");
var router = express.Router();

// Fake Database
let Game = require("../models/Game.js");
let Token = require("../models/Token.js");
let Theme = require("../models/Theme.js");
let Metadata = require("../models/Metadata.js");
let Error = require("../models/Error.js");

let gameTable = {};

function getGames() {
  return Object.values(gameTable);
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Connect 4" });
});

module.exports = router;
