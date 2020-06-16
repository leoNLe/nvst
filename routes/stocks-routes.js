const db = require("../models");
const { getStock } = require("../lib/utilities");
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

  app.post("/api/sell", async (req, res) => {
    const { userId, symbol, price, quantity } = req.body;
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
          symbol
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
          symbol: symbol.toLowerCase(),
          price,
          quantity: `-${quantity}`,
          buy: 0
        });
        res.redirect(`/stock/${symbol}`);
      } else {
        res.json({ sufficient: false, message: "Not enough stocks" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });

  app.post("/api/buy", async (req, res) => {
    console.log(req.body);
    const { userId, symbol, price, quantity } = req.body;

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
        symbol: symbol.toLowerCase(),
        price,
        quantity,
        userId,
        buy: 1
      });

      res.redirect(`/stock/${symbol}`);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  });
};
