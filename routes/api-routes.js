const db = require("../models");

async function addEndBalance(balance, data, userId) {
  return db.EndDayBalances.create({ balance, date, userId });
}
module.exports = function(app) {
  setInterval(async () => {
    const hour = new Date().getHours();
    if (hour === 0) {
      //get all users
      //per each user get all transactions
      //add balance to
    }
  }, 1000 * 60 * 60);

  app.post("/api/addEndBalance", (req, res) => {
    const { balance, date, userId } = req.body;
    addEndBalance(balance, date, userId)
      .then(response => {
        console.log(response);
        res.json({ success: "true" });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
