'use strict';

module.exports= {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_movements', {
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

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      movement_type: {
        type: Sequelize.ENUM('IN', 'OUT'),
        allowNull: false,
      },

      reference_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('inventory_movements');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_inventory_movements_movement_type";');
  },
};