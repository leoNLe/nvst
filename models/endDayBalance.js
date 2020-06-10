module.exports = (sequelize, DataTypes) => {
  const EndDayBalances = sequelize.define("EndDayBalances", {
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  });

  EndDayBalances.associate = (models) => {
    EndDayBalances.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id"
      }
    })
  };
  return EndDayBalances;
}
