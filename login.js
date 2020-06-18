const db = require("./models");
const passport = require("./config/passport");
const isAuthenticated = require("./config/middleware/isAuthenticated");
module.exports = function(app) {
  //home
  app.get("/", (req, res) => {
    res.redirect("/login.html");
  });
  // signup
  app.route("/signup").post((req, res) => {
    console.log("/signup");
    db.Users.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    })
      .then(user => {
        console.log(user.dataValues);
        res.redirect("/portfolio");
      })
      .catch(error => {
        console.log(error);
        res.redirect("/signup.html");
      });
  });

  //login
  app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ userId: req.user.dataValues.id });
  });

  app.put("/update", isAuthenticated, async (req, res) => {
    const id = req.user.id;
    const { firstName, lastName, email, password } = req.body;
    // console.log(req.user.id);
    console.log(req.user.id);
    try {
      const user = await db.Users.update(
        {
          firstName,
          lastName,
          email,
          password
        },
        {
          where: { id }
        }
      );
      console.log(user);
      res.redirect("/logout").
    } catch (err) {
      console.log(err);
      res.status(501).send();
    }
  });
};
