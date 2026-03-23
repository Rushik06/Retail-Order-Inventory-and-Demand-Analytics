'use strict';

module.exports = {
  async up(queryInterface) {
    const roles = await queryInterface.sequelize.query(
      `SELECT role_id, name FROM roles;`
    );

    const permissions = await queryInterface.sequelize.query(
      `SELECT permission_id, name FROM permissions;`
    );

    const roleRows = roles[0];
    const permissionRows = permissions[0];

    const roleMap = {};
    roleRows.forEach(r => roleMap[r.name] = r.role_id);

    const permissionMap = {};
    permissionRows.forEach(p => permissionMap[p.name] = p.permission_id);

    await queryInterface.bulkInsert('role_permissions', [
      // super_admin → all permissions
      ...permissionRows.map(p => ({
        roleId: roleMap['super_admin'],
        permissionId: p.permission_id,
  
      })),

      // admin
      {
        roleId: roleMap['admin'],
        permissionId: permissionMap['create_user'],
       
      },
      {
        roleId: roleMap['admin'],
        permissionId: permissionMap['view_inventory'],
       
      },

      // manager
      {
        roleId: roleMap['manager'],
        permissionId: permissionMap['view_inventory'],
       
      },

      // staff
      {
        roleId: roleMap['staff'],
        permissionId: permissionMap['view_inventory'],
      
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};