module.exports = (Sequelize, DataTypes) => {
  const Transactions = Sequelize.define("Transactions", {
    purchasePrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    stockSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 4 ]
      }
    },
    soldPrice: {
      type: DataTypes.DECIMAL,
      default: null
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Transactions.associate = models => {
    Transactions.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });

    Transactions.belongsTo(models.Stocks, {
      foreignKey: {
        name: "stock_id",
        allowNull: false
      }
    });
  };
  return Transactions;
};
