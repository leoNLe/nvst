// Requiring path to so we can use relative routes to our HTML files
// const path = require("path");
const db = require("../models");
const {
  getQuotes,
  getHistoricalData,
  formatHistorical
} = require("../lib/utilities");

const { Op } = require("sequelize");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const moment = require("moment");

async function getQuantity(userId, symbol) {
  return await db.Transactions.findAll({
    attributes: [
      "symbol",
      [db.Sequelize.fn("sum", db.Sequelize.col("quantity")), "quantity"]
    ],
    where: {
      userId,
      symbol
    }
  });
}

async function getEndDayBalances(userId) {
  const sevenDaysBack = moment()
    .subtract(7, "days")
    .format("MM/DD/YY");

  try {
    const data = await db.EndDayBalances.findAll({
      where: {
        userId: userId,
        date: { [Op.gte]: sevenDaysBack }
      }
    });
    const dayBalances = { balance: [], dates: [] };
    data.forEach(({ dataValues }) => {
      dayBalances.balance.push(dataValues.balance);
      dayBalances.dates.push(
        moment(dataValues.date, "YYYY-MM-DD").format("MM-DD-YY")
      );
    });
    return dayBalances;
  } catch (err) {
    console.log(err);
  }
}

module.exports = function(app) {
  app.get("/portfolio", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    try {
      const data = await db.Transactions.findAll({
        attributes: [
          "symbol",
          [db.Sequelize.fn("sum", db.Sequelize.col("quantity")), "quantity"]
        ],
        where: {
          userId: userId
        },
        group: ["symbol"],
        include: {
          model: db.Stocks
        }
      });

      const stocksData = [];
      let total = 0;

      for (const item of data) {
        const {
          data: { c: price }
        } = await getQuotes(item.dataValues.symbol);

        const currentValue = price * item.dataValues.quantity;
        total += price * item.dataValues.quantity;

        stocksData.push({
          name: item.dataValues.Stock.dataValues.name,
          price,
          symbol: item.dataValues.symbol.toUpperCase(),
          quantity: item.dataValues.quantity,
          currentValue
        });
      }
      const chartInfo = JSON.stringify(await getEndDayBalances(userId));

      res.render("portfolio", {
        layout: "portfolio",
        stocksData,
        total,
        chartInfo
      });
    } catch (err) {
      console.log(err);
      res.status(501).send();
    }
  });

  app.get("/stock/:name", isAuthenticated, async (req, res) => {
    const query = req.params.name;
    const userId = req.user.id;
    try {
      const data = await db.Stocks.findOne({
        where: {
          symbol: query.toUpperCase()
        }
      });
      if (!data) {
        console.log("found nothing send to no company page found");
        res.redirect("/portfolio");
      }

      //Call 2 api for historical data and current price;
      const [curPrice, historicalPrice, quantityQuery] = await Promise.all([
        getQuotes(data.dataValues.symbol),
        getHistoricalData(data.dataValues.symbol),
        getQuantity(userId, data.dataValues.symbol)
      ]);

      const priceArr = formatHistorical(historicalPrice, curPrice.data.c);
      const currentShares =
        quantityQuery.length === 0 || !quantityQuery[0].dataValues.quantity
          ? 0
          : quantityQuery[0].dataValues.quantity;

      res.render("stock", {
        layout: "stock",
        chartInfo: JSON.stringify(priceArr),
        name: data.dataValues.name,
        currentPrice: curPrice.data.c,
        currentShares,
        symbol: data.dataValues.symbol
      });
    } catch (err) {
      console.log(err);
      res.status(501).send();
    }
  });
};
