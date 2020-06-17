// Requiring our models and passport as we've configured it
const db = require("../models");
// const passport = require("../config/passport");

/*const defaultClient = finnhub.ApiClient.instance;
const api_key = defaultClient.authentications["api_key"];
api_key.apiKey = "brcsl7nrh5rfdvppg6q0"; // get from https://finnhub.io/
const api = new finnhub.DefaultApi();
*/

module.exports = function(app) {
  // app.post("/api/signup", (req, res) => {
  //   db.Users.create({
  //     email: req.body.email,
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     password: req.body.password
  //   })
  //     .then(() => {
  //       res.redirect(307, "/api/login");
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(401).json(err);
  //     });
  // });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/addEndBalance", (req, res) => {
    const { balance, date, userId } = req.body;
    db.EndDayBalances.create({ balance, date, userId })
      .then(response => {
        console.log(response);
        res.json({ success: "true" });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
