const db = require("../models");
const { getStock } = require("../lib/utilities");
const isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = function(app) {
  app.post("/api/updateStockTable", async (req, res) => {
    try {
      const { data: companies } = await getStock();
      console.log(companies);
      for (const company of companies) {
        await db.Stocks.create({
          symbol: company.symbol,
          name: company.description
        });
      }
      console.log("All stocks added");
      res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/api/addStock", (req, res) => {
    const { symbol, name } = req.body;

    if (!symbol || !name) {
      return res.status(400).send();
    }

    db.Stocks.create({
      symbol: symbol.toLowerCase(),
      name: name.toLowerCase()
    })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      });
  });

  app.post("/api/sell", isAuthenticated, async (req, res) => {
    console.log("*".repeat(50) + "/api/sell" + "*".repeat(50));
    console.log(req.body);
    const userId = req.user.id;
    const { symbol, price, quantity } = req.body;
    console.log(req.body);
    if (!userId || !symbol || !price || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing: userId, symbol, sell price, or quantity" });
    }

    try {
      //Check for current quantity of stock user has
      const allTransactions = await db.Transactions.findAll({
        attributes: ["quantity"],
        where: {
          userId,
          symbol: symbol.toUpperCase()
        }
      });

      let stocksOnHand = 0;
      allTransactions.forEach(element => {
        stocksOnHand += element.dataValues.quantity;
      });
      //Check if user have enough stock to sell
      if (stocksOnHand >= quantity) {
        const result = await db.Transactions.create({
          userId,
          symbol: symbol.toUpperCase(),
          price,
          quantity: `-${quantity}`,
          buy: 0
        });
        console.log(result);
        res.redirect(`/stock/${symbol.toUpperCase()}`);
      } else {
        res.json({ sufficient: false, message: "Not enough stocks" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });

  app.post("/api/buy", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const { symbol, price, quantity } = req.body;

    if (!userId || !symbol || !price || !quantity) {
      return res.status(400).send();
    }
    try {
      //Check if stock is in DB.
      const hasStock = await db.Stocks.findOne({ where: { symbol } });
      if (!hasStock) {
        //call Api to get username
      }

      await db.Transactions.create({
        symbol: symbol.toUpperCase(),
        price,
        quantity,
        userId,
        buy: 1
      });

      res.redirect(`/stock/${symbol.toUpperCase()}`);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });
};
