'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    OrderID: {primaryKey: true,allowNull: false,type: DataTypes.INTEGER},
    CustomerID: {allowNull: false,type: DataTypes.INTEGER},
    OrderDate: {allowNull: false,type: DataTypes.DATE}
  }, { schema: 'Sales',
  tableName: 'Orders',
  timestamps: false,});
  Order.associate = function(models) {
    Order.hasMany(models.OrderLine, {foreignKey: 'OrderID',as: 'Lines'})
  };
  return Order;
};