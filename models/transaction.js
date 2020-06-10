module.exports = (Sequelize, DataTypes)=> {
  const Transactions = Sequelize.define("Transactions", {
    purchase_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    stock_symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,4]
      }
    },
    sold_price: {
      type: DataTypes.DECIMAL,
      default: null
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  
  Transactions.associate = (models) => {
    Transactions.belongsTo(models.Users,{
      foreignKey: {
       name: "user_id",
       allowNull: false
      }
    });

    Transactions.belongsTo(models.Stocks,{
      foreignKey: {
       name: "stock_id",
       allowNull: false
      }
    });
  };
  return Transactions;
}
