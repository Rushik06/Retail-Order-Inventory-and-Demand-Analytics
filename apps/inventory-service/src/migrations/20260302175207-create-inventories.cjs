'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      inventory_id: {
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

      available_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      reserved_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addConstraint('inventory', {
      fields: ['product_id', 'warehouse_id'],
      type: 'unique',
      name: 'unique_product_warehouse_inventory',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory');
  },
};