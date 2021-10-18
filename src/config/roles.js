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
        'get_contracts_me',
        'get_all_contracts',
        'delete_contract',
        'get_all_uploads'
    ]);

rolePermissions.set(roles[1],
    [
        'get_user',
        'get_multilevel',
        'update_password',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts_me',
        'delete_contract',
        'get_all_uploads'
    ]);

module.exports = {
    roles,
    rolePermissions
}