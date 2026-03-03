'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_logs', {
      inventory_log_id: {
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

      action_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      previous_available_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      new_available_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      reference_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      performed_by: {
        type: Sequelize.UUID,
        allowNull: true,
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
    await queryInterface.dropTable('inventory_logs');
  },
};