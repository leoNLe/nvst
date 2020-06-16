// Requiring our models and passport as we've configured it
const db = require("../models");
// const passport = require("../config/passport");

/*const defaultClient = finnhub.ApiClient.instance;
const api_key = defaultClient.authentications["api_key"];
api_key.apiKey = "brcsl7nrh5rfdvppg6q0"; // get from https://finnhub.io/
const api = new finnhub.DefaultApi();
*/

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  /*app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });*/

  // Company News
  /* api.companyNews("AAPL", "2020-01-01", "2020-05-01", (error, data, response) => {
    if (error) {
        console.error(error);
    } else {
        console.log(util.inspect(data, false, null, true))
    }
});*/

  /*const quotes = {
  
}

  api.quote("AAPL", "D", quotes, (err, data, response) => {
    if (error) {
      console.log(error);
  } else {
      console.log(util.inspect(data, false, true, null));
    }
  }); */

  /* api.stockSymbols("APPLE", "DISNEY", (error, data, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(util.inspect(data, false, null, true));
    }
});

  // Stock Candles
  const stockCandlesOpts = {
    from: 1572651390,
    to: 1575243390
  };
  api.stockCandles("AAPL", "D", stockCandlesOpts, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log(util.inspect(data, false, null, true));
    }
  });*/
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error

  const WebSocket = require("ws"); //npm i ws
  const socket = new WebSocket(
    "wss://ws.finnhub.io?token=brcsl7nrh5rfdvppg6q0"
  ); //change token to personal token

  // Connection opened -> Subscribe
  socket.addEventListener("open", () => {
    //for testing purposes
    socket.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
    socket.send(JSON.stringify({ type: "subscribe", symbol: "MSFT" }));
    socket.send(JSON.stringify({ type: "subscribe", symbol: "AMZN" }));
    socket.send(JSON.stringify({ type: "subscribe", symbol: "CRON" }));
    socket.send(JSON.stringify({ type: "subscribe", symbol: "CGC" }));
  });

  // Listen for messages
  socket.addEventListener("message", event => {
    // prints to console
    console.log("Message from server ", event.data);
  });

  // Unsubscribe
  /*const unsubscribe = function(symbol) {
    // functionality to "sell" needs to be expanded upon currently would just remove from feed
    socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
  };
  */

  app.post("/api/signup", (req, res) => {
    db.Users.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    })
      .then(() => {
        console.log("here");
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        console.log(err);
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/api/logout", (req, res) => {
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
