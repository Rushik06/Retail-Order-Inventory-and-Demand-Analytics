'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      roleId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'roles',
          key: 'role_id',
        },
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'permissions',
          key: 'permission_id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('role_permissions');
  },
};