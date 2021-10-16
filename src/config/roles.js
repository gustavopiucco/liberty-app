const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'get_user', ,
        'update_password',
        'get_multilevel',
        'upload'
    ]);

rolePermissions.set(roles[1],
    [
        'get_user',
        'get_multilevel',
        'update_password',
        'upload'
    ]);

module.exports = {
    roles,
    rolePermissions
}