let express = require("express");
let users = require("../models/Users.js");
let ErrorReport = require("../models/Error.js");

const multer = require("multer");
const upload = multer();
let router = express.Router();

router.post("/login", upload.none(), (req, res) => {
  let user = users.getUserByEmail(req.body.email);
  const ERROR = `Invalid credentials`;
  if (user) {
    req.session.regenerate(() => {
      if (user.password == req.body.password) {
        delete user.password;
        console.log(`[] session: ${JSON.stringify(req.session)}`);
        console.log(`[] setting user: ${JSON.stringify(user)}`);
        req.session.user = user;
        console.log(`[] set user: ${JSON.stringify(req.session.user)}`);
        res.json(user);
      } else {
        res.status(200).send(new ErrorReport.Error(ERROR));
      }
    });
  } else {
    res.status(200).send(new ErrorReport.Error(ERROR));
  }
});

router.post("/logout", upload.none(), (req, res) => {
  req.session.destroy(() => {
    res.status(200).send(new ErrorReport.Error("Success"));
  });
});

module.exports = router;
