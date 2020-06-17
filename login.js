const db = require("./models");
const isAuthenticate = require("./config/middleware/isAuthenticated");
const passport = require("./config/passport");
module.exports = function(app) {
  //handle bars
  // const hbsContent = {
  //   email: "",
  //   loggedin: false,
  //   title: "Not Logged In",
  //   body: "placeholder"
  // };

  // check for if user is already logged in
  // const sessionChecker = (req, res, next) => {
  //   console.log("session checker:");
  //   console.log(`req: ${req}`);
  //   console.log(`res: ${res}`);
  //   console.log(`next: ${next}`);
  //   if (req.session.user && req.cookies.userId) {
  //     res.redirect("/account");
  //   } else {
  //     next();
  //   }
  // };

  //home
  app.get("/", (req, res) => {
    res.redirect("/login.html");
  });

  // signup
  app.route("/signup").post((req, res) => {
    console.log("/signup");
    db.Users.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    })
      .then(user => {
        console.log(user.dataValues);
        res.redirect("/portfolio");
      })
      .catch(error => {
        console.log(error);
        res.redirect("/signup.html");
      });
  });

  //login
  app.post("/login", passport.authenticate("local"), (req, res) => {
    // console.log("/login");
    // console.log(req.user);
    res.json({ userId: req.user.dataValues.id });
    // const email = req.body.email,
    //   password = req.body.password;

    // db.Users.findOne({ where: { email: email } }).then(user => {
    //   console.log(user);
    //   if (!user) {
    //     res.redirect("/login");
    //   } else if (!user.validPassword(password)) {
    //     res.redirect("/login");
    //   } else {
    //     req.session.user = user.dataValues;
    //     res.redirect("/portfolio");
    //   }
    // });
  });
  // account
  // app.get("/account", (req, res) => {
  //   console.log("/account");
  //   if (req.session.users && req.cookies.user_id) {
  //     hbsContent.loggedin = true;
  //     hbsContent.email = req.session.user.email;
  //     console.log(req.session.user.email);
  //     hbsContent.title = "Already Logged in, not you?";
  //     res.render("index", hbsContent);
  //   } else {
  //     res.redirect("/login");
  //   }
  // });

  // logout
  app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_id) {
      hbsContent.loggedin = false;
      hbsContent.title = "Logged out, see you tomorrow!";
      res.clearCookie("user_id");
      console.log(JSON.stringify(hbsContent));
      res.redirect("/");
    } else {
      res.redirect("/login.html");
    }
  });
};
