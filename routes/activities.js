var express = require("express");
var router = express.Router();
let Activity = require("../models/activity");
const { body, validationResult } = require("express-validator");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

router.get("/home", function (req, res) {
  Activity.find({user:req.user._id})
    .then((activities) => {
      console.log(activities);
      res.render("activities", { title: "Activities", activities: activities });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

router.use(isAuthenticated); // Apply the isAuthenticated middleware to all routes below

router
  .route("/add")
  .get(function (req, res) {
    res.render("add_activity", {
      title: "Add Activity",
      types: ["Swimming", "Running", "Cycling", "Hiking", "Strength Training"],
    });
  })
  .post(
    body("activityType", "Type is required").notEmpty(),
    body("duration", "Duration is required").notEmpty(),
    body("date", "Date is required").notEmpty(),
    function (req, res) {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        let activity = new Activity();
        activity.user = req.user._id;
        activity.type = req.body.activityType;
        activity.duration = req.body.duration;
        activity.date = req.body.date;
        activity.calorieLoss = req.body.calorieLoss;
        activity
          .save()
          .then(() => {
            console.log(activity);
            res.redirect("/activities/home");
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      } else {
        res.render("add_activity", {
          errors: errors.array(),
          title: "Add Activity",
          types: [
            "Swimming",
            "Running",
            "Cycling",
            "Hiking",
            "Strength Training",
          ],
        });
      }
    }
  );
router
  .route("/edit/:id")
  .get(function (req, res) {
    var id = req.params.id;
    Activity.findById(id).then((foundActivity) => {
      if (foundActivity.user.equals(req.user._id)){
      res.render("edit_activity", {
        activity: foundActivity,
        types: [
          "Swimming",
          "Running",
          "Cycling",
          "Hiking",
          "Strength Training",
        ],
      });
    }else{
      res.redirect("/activities/home");
    }
    });
  })
  .post((req, res) => {
    let updatedActivity = {
      type: req.body.activityType,
      duration: req.body.duration,
      date: req.body.date,
      calorieLoss: req.body.calorieLoss,
    };
    Activity.updateOne({ _id: req.params.id }, updatedActivity)
      .then(() => {
        res.redirect("/activities/home");
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  });

router.route("/delete/:id").get(function (req, res) {
  var id = req.params.id;
  Activity.deleteOne({ _id: id }).then(() => {
    res.redirect("/activities/home");
  });
});
module.exports = router;
