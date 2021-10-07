const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'get_multilevel'
    ]);

rolePermissions.set(roles[1],
    [
        'get_multilevel'
    ]);

module.exports = {
    roles,
    rolePermissions
}