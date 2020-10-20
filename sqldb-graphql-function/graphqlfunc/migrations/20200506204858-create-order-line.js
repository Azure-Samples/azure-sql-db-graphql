'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrderLines', {
      OrderLineID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      StockItemID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OrderLines');
  }
};