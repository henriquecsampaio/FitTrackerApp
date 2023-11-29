var express = require("express");
var router = express.Router();
let Profile = require("../models/profile");
const { body, validationResult } = require("express-validator");

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}

router.get("/home", function (req, res) {
    Profile.find({ user: req.user._id })
        .then((profiles) => {
            console.log(profiles);
            res.render("profile", { title: "Profile", profiles: profiles });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
});

router.use(isAuthenticated);

router.route("/update").get(function (req, res) {
    res.render("profile", {
        title: "Update Profile",
    });
}).post(
    body("age", "Age is required").notEmpty(),
    body("birth", "Date of birth is required").notEmpty(),
    body("weight", "Weight is required").notEmpty(),
    body("height", "Height is required").notEmpty(),
    body("goals"),
    function (req, res) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let profile = new Profile();
            profile.user = req.user._id;
            profile.age = req.body.age;
            profile.birth = req.body.birth;
            profile.weight = req.body.weight;
            profile.height = req.body.height;
            profile.goals = req.body.goals;
            profile.save().then(() => {
                console.log(profile);
                res.render("profile", {
                    profiles: [profile],
                    errors: errors,
                    title: "Update Profile",
                });
            }).catch((error) => {
                console.log(error);
                return;
            });
        } else {
            res.render("profile", {
                errors: errors,
                title: "Update Profile",
            });
        }
    });

router
    .route("/edit/:id")
    .get(function (req, res) {
        var id = req.params.id;
        Profile.findById(id).then((foundProfile) => {
            if (foundProfile.user.equals(req.user._id)) {
                res.render("profile_edit", {
                    profile: foundProfile,
                });
            } else {
                res.redirect("/profile/home");
            }
        });
    })
    .post((req, res) => {
        let updatedProfile = {
            age: req.body.age,
            birth: req.body.birth,
            weight: req.body.weight,
            height: req.body.height,
            goals: req.body.goals,
        };
        Profile.updateOne({ _id: req.params.id }, updatedProfile)
            .then(() => {
                res.redirect("/profile/home");
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    });

module.exports = router;
