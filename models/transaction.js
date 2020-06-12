module.exports = (Sequelize, DataTypes) => {
  const Transactions = Sequelize.define("Transactions", {
    purchasePrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    soldPrice: {
      type: DataTypes.DECIMAL,
      default: null
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Transactions.associate = models => {
    Transactions.belongsTo(models.Users, {
      foreignKey: {
        name: "userId",
        allowNull: false
      }
    });

    Transactions.belongsTo(models.Stocks, {
      foreignKey: {
        name: "symbol",
        allowNull: false
      }
    });
  };
  return Transactions;
};
