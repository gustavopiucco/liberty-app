const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        ''
    ]);

rolePermissions.set(roles[1],
    [
        ''
    ]);

module.exports = {
    roles,
    rolePermissions
}