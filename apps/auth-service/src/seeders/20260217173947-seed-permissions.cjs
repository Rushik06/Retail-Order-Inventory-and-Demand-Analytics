'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', [
      { name: 'create_user' },
      { name: 'delete_user'},
      { name: 'view_inventory' },
      { name: 'manage_orders' },
      { name: 'manage_roles' },
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};