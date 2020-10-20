'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderLine = sequelize.define('OrderLine', {
    OrderLineID: {primaryKey: true,type: DataTypes.INTEGER,allowNull: false},
    OrderID: {type: DataTypes.INTEGER,allowNull: false},
    StockItemID: {type: DataTypes.INTEGER,allowNull: false},
    Quantity: {type: DataTypes.INTEGER,allowNull: false},
  }, {  schema: 'Sales',
  tableName: 'OrderLines',
  timestamps: false});
  OrderLine.associate = function(models) {
    OrderLine.belongsTo(models.Order,{foreignKey: 'OrderID'})
  };
  return OrderLine;
};