const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("./models/user");
const hbs = require("express-handlebars");
const path = require("path");

module.exports = function(app) {
  //handle bars
  const hbsContent = {
    userName: "",
    loggedin: false,
    title: "Not Logged In",
    body: "placeholder"
  };

  // check for if user is already logged in
  const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
      res.redirect("/account");
    } else {
      next();
    }
  };

  //home
  app.get("/", sessionChecker, (req, res) => {
    res.redirect("/login");
  });

  // signup
  app
    .route("/signup")
    .get((req, res) => {
      res.render("signup", hbsContent);
    })
    .post((req, res) => {
      User.create({
        username: req.body.username,
        password: req.body.password
      })
        .then(user => {
          req.session.user = user.dataValues;
          res.redirect("/account");
        })
        .catch(error => {
          res.redirect("/signup");
          console.log(error);
        });
    });

  //login
  app
    .route("/login")
    .get(sessionChecker, (req, res) => {
      res.render("login", hbsContent);
    })
    .post((req, res) => {
      const username = req.body.username,
        password = req.body.password;

      User.findOne({ where: { username: username } }).then(user => {
        if (!user) {
          res.redirect("/login");
        } else if (!user.validPassword(password)) {
          res.redirect("/login");
        } else {
          req.session.user = user.dataValues;
          res.redirect("/account");
        }
      });
    });

  // account
  app.get("/account", (req, res) => {
    if (req.session.user && req.cookies.user_id) {
      hbsContent.loggedin = true;
      hbsContent.userName = req.session.user.username;
      console.log(req.session.user.username);
      hbsContent.title = "Already Logged in, not you?";
      res.render("index", hbsContent);
    } else {
      res.redirect("/login");
    }
  });
  // update
  app.route("/update").get(
    sessionChecker,
    (req, res) => {
      res.render("update", hbsContent);
    },
      .update({ title: "" }, { _id: 1 })
      .success(() => {
        console.log("Password Updated");
      })
      .error(err => {
        console.log(err, "Update failed");
      }));
  // logout
  app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_id) {
      hbsContent.loggedin = false;
      hbsContent.title = "Logged out, see you tomorrow!";
      res.clearCookie("user_id");
      console.log(JSON.stringify(hbsContent));
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
};
