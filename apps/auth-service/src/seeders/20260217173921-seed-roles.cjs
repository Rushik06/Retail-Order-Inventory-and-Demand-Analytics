'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { name: 'super_admin' },
      { name: 'admin' },
      { name: 'manager' },
      { name: 'staff' },
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};