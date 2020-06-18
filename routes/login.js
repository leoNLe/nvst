const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const path = require("path");
module.exports = function(app) {
  //home
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
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
        console.log("/signup resolved");
        console.log(user.dataValues);
        res.redirect(307, "/api/login");
      })
      .catch(error => {
        console.log("/signup err");
        console.log(error);
        res.redirect("/signup.html");
      });
  });

  //login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // console.log("inlog in");
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
      res.redirect("/logout.html");
    } catch (err) {
      console.log(err);
      res.status(501).send();
    }
  });
  app.delete("/api/delete", isAuthenticated, async (req, res) => {
    const id = req.user.id;
    try {
      const deletedUser = await db.Users.destroy({ where: { id } });
      console.log(deletedUser);
      console.log(path.join(__dirname, "../public/login.html"));
      res.json({ sucess: true });
    } catch (err) {
      console.log(err);
      res.status(501).send();
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
