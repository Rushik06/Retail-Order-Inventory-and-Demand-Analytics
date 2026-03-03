'use strict';

 module.exports={
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_alerts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      alert_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      threshold_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      current_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_alerts');
  },
};