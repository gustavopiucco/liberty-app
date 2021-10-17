const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'download_uploaded_files',
        'get_user', ,
        'update_password',
        'get_multilevel',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts'
    ]);

rolePermissions.set(roles[1],
    [
        'get_user',
        'get_multilevel',
        'update_password',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts'
    ]);

module.exports = {
    roles,
    rolePermissions
}