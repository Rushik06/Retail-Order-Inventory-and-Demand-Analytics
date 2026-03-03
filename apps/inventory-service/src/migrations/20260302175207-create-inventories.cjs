'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
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

    await queryInterface.addConstraint('inventories', {
      fields: ['product_id', 'warehouse_id'],
      type: 'unique',
      name: 'unique_product_warehouse_inventory',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventories');
  },
};