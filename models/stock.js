module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stocks", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Stock.associate = models => {
    Stock.hasMany(models.EndDayBalances, {
      foreignKey: {
        name: "stockId",
        allowNull: false
      }
    });
  };
  return Stock;
};
