"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "total_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("orders", "total_amount");
  },
};