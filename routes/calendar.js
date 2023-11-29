var express = require("express");
var router = express.Router();
let Activity = require("../models/activity");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

router.get("/", function (req, res) {
    Activity.find({ user: req.user._id }).sort({ date: 1 })
      .then((activities) => {
        res.render("calendar", { title: "Calendar", activities: activities });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  });

router.use(isAuthenticated); // Apply the isAuthenticated middleware to all routes below

module.exports = router;
