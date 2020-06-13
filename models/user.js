module.exports = (Sequelize, DataTypes) => {
  const Users = Sequelize.define("Users", {
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Users.associate = models => {
    Users.hasMany(models.Transactions, {
      foreignKey: {
        name: "userId"
      },
      allowNull: false
    });
    Users.hasMany(models.EndDayBalances, {
      foreignKey: {
        name: "userId"
      },
      allowNull: false
    });
  };
  return Users;
};
