//signup

exports.signup = function(req, res) {
  message = "";
  if (req.method == "POST") {
    let post = req.body;
    let name = post.user_name;
    let pass = post.password;
    let fname = post.first_name;
    let lname = post.last_name;
    let mob = post.mob_no;

    let sql =
      "INSERT INTO `users`(`first_name, `last_name`, `mob_no`, `user_name`, `password`) VALUES ('" +
      fname +
      "','" +
      lname +
      "','" +
      mob +
      "','" +
      name +
      "','" +
      pass +
      "')";
    let query = db.query(sql, function(err, result) {
      message = "Success, Welcome To nvst!";
      res.render("signup.ejs", { message: message });
    });
  } else {
    res.render("signup");
  }
};

//login

exports.login = function(req, res) {
  let message = "";
  let sess = req.session;

  if (req.method == "POST") {
    let post = req.body;
    let name = post.user_name;
    let pass = post.password;

    let sql =
      "SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name` = '" +
      name +
      "' and password = '" +
      pass +
      "'";
    db.query(sql, function(err, results) {
      if (results.length) {
        req.session.userID = results[0].id;
        req.session.user = results[0];
        console.log(results[0].id);
        res.redirect("/home/dashboard");
      } else {
        message = "INVALID ID";
        res.render("index.ejs", { message: message });
      }
    });
  } else {
    res.render("index.ejs", { message: message });
  }
};

// Page functionality

exports.dashboard = function(req, res, next) {
  let user = req.session.user,
    userID = req.session.userID;
  console.log("ddd=" + userID);
  if (userID == null) {
    res.redirect("/login");
    return;
  }
  let sql = " SELECT * FROM `users` WHERE = `id` = '" + userID + "'";
  db.query(sql, function(err, results) {
    res.render("dashboard.ejs", { user: user });
  });
};

// LOGOUT

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/login");
  });
};

// pull user details
exports.profile = function(req, res) {
  let userID = req.session.userID;
  if (userID == null) {
    res.redirect("/login");
    return;
  }
  let sql = " SELECT * FROM `users` WHERE `id` = '" + userID + "'";
  db.query(sql, function(err, result) {
    res.render("profile.ejs", { data: result });
  });
};

// edit user details
exports.editProfile = function(req, res) {
  var userID = req.session.userID;
  if (userID == null) {
    res.redirect("/login");
    return;
  }
  var sql = "SELECT * FROM `users` WHERE `id` = '" + userID + "'";
  db.query(sql, function(err, results) {
    res.render("edit_profile.ejs", { data: results });
  });
};
