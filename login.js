const express = require("express"),
  routes = require("./routes"),
  user = require("./routes/user"),
  http = require("http"),
  path = require("path");

const session = require("express-session");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mixVok-quxsy0-sinmup",
  database: "stocks"
});

connection.connect();
global.db = connection;
// env vars
app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mixVok-quxsy0-sinmup",
    resave: false,
    saveUninitliazed: true,
    cookie: { maxAge: 60000 }
  })
);
// login route
app.get("/", routes.index);
app.get("/signup", user.signup);
app.post("/signup", user.signup);
app.get("/login", routes.index);
app.post("/login", user.login);
app.get("/home/dashboard", user.dashboard);
app.get("/home/logout", user.logout);
app.get("home/profile", user.profile);

app.listen(8080);
