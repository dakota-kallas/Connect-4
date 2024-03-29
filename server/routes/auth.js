let express = require("express");
let users = require("../models/Users.js");
let ErrorReport = require("../models/Error.js");
const bcrypt = require("bcryptjs");

const multer = require("multer");
const upload = multer();
let router = express.Router();

router.post("/login", upload.none(), (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = users.getUserByEmail(email);
  const ERROR = `Invalid credentials`;

  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        res.status(401).send(new ErrorReport.Error(ERROR));
      } else if (result) {
        req.session.regenerate(() => {
          delete user.password;
          req.session.user = user;
          res.json(user);
        });
      } else {
        res.status(401).send(new ErrorReport.Error(ERROR));
      }
    });
  } else {
    res.status(401).send(new ErrorReport.Error(ERROR));
  }
});

router.post("/logout", upload.none(), (req, res) => {
  req.session.destroy(() => {
    res.status(200).send(new ErrorReport.Error("Success"));
  });
});

module.exports = router;
