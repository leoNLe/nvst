//const express = require("express");
//const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
//const session = require("express-session");
//const User = require("./models/user");
//const hbs = require("express-handlebars");
//const path = require("path");
const db = require("./models");
//const { compare } = require("bcryptjs");

module.exports = function(app) {
  //handle bars
  const hbsContent = {
    email: "",
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
      db.Users.create({
        email: req.body.email,
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
      const email = req.body.email,
        password = req.body.password;
      console.log("here");
      db.Users.findOne({ where: { email: email } }); //function(err, user) {
      if (err) {
        res.redirect("/login");
      }
      if (!user) {
        return document(null, false, console.log("wrong user"));
      }
      if (!user.validPassword(password)) {
        return document(null, false, console.log("wrong password"));
      }
    });
};
// validPassword()

// account
app.get("/account", (req, res) => {
  if (req.session.user && req.cookies.user_id) {
    hbsContent.loggedin = true;
    hbsContent.email = req.session.user.email;
    console.log(req.session.user.email);
    hbsContent.title = "Already Logged in, not you?";
    res.render("index", hbsContent);
  } else {
    res.redirect("/login");
  }
});
// update
app.route("/update", (req, res) => {
  if (req.session.user && req.cookies.user_id) {
    hbsContent.loggedin = true;
    hbsContent.email = req.session.user.email;
    console.log(req.session.email);
    hbsContent.title = "Update Password?";
    res.render("update", hbsContent);
  } else {
    res.redirect("/login");
  }
  update({ title: "" }, { _id: 1 })
    .success(() => {
      console.log("Password Updated");
    })
    .error(err => {
      console.log(err, "Update failed");
    });

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
});
