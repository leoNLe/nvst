// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const { getQuotes } = require("../lib/utilities");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/portfolio", async (req, res) => {
    // if (!req.user) {
    //   res.redirect("/login");
    // }
    const userId = req.body;

    try {
      const data = await db.Transactions.findAll({
        attributes: [
          "symbol",
          [db.Sequelize.fn("sum", db.Sequelize.col("quantity")), "quantity"]
        ],
        where: userId,
        group: ["symbol"],
        include: {
          model: db.Stocks
        }
      });

      const stocksData = [];
      const total = 0;

      for (const item of data) {
        console.log(item);
        const {
          data: { c: price }
        } = await getQuotes(item.dataValues.symbol);
        const currentValue = price * dataValues.quantity;
        total += price * dataValues.quantity;
        stocksData.push({
          name:,
          price,
          symbol: dataValues.symbol.toUpperCase(),
          quantity: dataValues.quantity,
          currentValue
        });
      }
      const chartInfo = JSON.stringify({ hey: "hey" });
      console.log(stocksData);
      res.render("portfolio", {
        layout: "portfolio",
        stocksData,
        total,
        chartInfo
      });
    } catch (err) {
      console.log(err);
    }
  });
};
