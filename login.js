const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("./models/user");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();

app.set("port", 8080);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    key: "user_id",
    secret: "password",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use((req, res, next) => {
  if (req.cookies.user_id && !req.session.user) {
    res.clearCookie("user_id");
  }
  next();
});

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
    hbsContent.title = "You are logged in";
    res.render("index", hbsContent);
  } else {
    res.redirect("/login");
  }
});

// logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_id) {
    hbsContent.loggedin = false;
    hbsContent.title = "You are logged out!";
    res.clearCookie("user_id");
    console.log(JSON.stringify(hbsContent));
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.listen(app.get("port"), () => console.log(`App started on port ${app.get("port")}`)
);
