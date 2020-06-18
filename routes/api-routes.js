const db = require("../models");

module.exports = function(app) {
  // Route for logging user out

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
