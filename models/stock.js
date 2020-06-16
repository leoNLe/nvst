module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stocks", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });

  Stock.associate = models => {
    Stock.hasMany(models.Transactions, {
      foreignKey: {
        name: "symbol",
        allowNull: false
      }
    });
  };
  return Stock;
};
