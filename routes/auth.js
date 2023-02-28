let express = require("express");
let users = require("../models/Users.js");
const multer = require("multer");
const upload = multer();
let router = express.Router();

router.post("/login", upload.none(), (req, res) => {
  let user = users.getUserByEmail(req.body.email);
  const ERROR = `Invalid credentials: ${req.body.email} ${req.body.password}`;
  if (user) {
    req.session.regenerate(() => {
      if (user.password == req.body.password) {
        delete user.password;
        req.session.user = user;
        res.json(user);
      } else {
        res.status(401).json(ERROR);
      }
    });
  } else {
    res.status(401).json(ERROR);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
    res.status(200).send({});
  });
});

module.exports = router;
