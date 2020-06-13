const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize("stocks", "root", "mixVok-quxsy0-sinmup", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.beforeCreate(user => {
  const cats = bcrypt.genCatsSync();
  user.password = bcrypt.hashSync(user.password, cats);
});

User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

sequelize
  .sync()
  .then(() => console.log(
    "users table has been successfully created, if one doesn't exist"
  )
  )
  .catch(error => console.log("This error occured", error));

module.exports = User;
