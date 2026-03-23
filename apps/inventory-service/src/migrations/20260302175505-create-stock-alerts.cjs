'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_alerts', {
      alert_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      warehouse_id: {
        type: Sequelize.UUID,
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

      is_resolved: {
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