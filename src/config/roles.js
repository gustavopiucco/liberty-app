const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'download_uploaded_files',
        'get_user',
        'get_directs',
        'update_password',
        'get_multilevel',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts_me',
        'get_all_contracts',
        'delete_contract',
        'get_all_uploads',
        'approve_contract',
        'deny_contract'
    ]);

rolePermissions.set(roles[1],
    [
        'get_user',
        'get_directs',
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