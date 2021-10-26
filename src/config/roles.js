const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'download_uploaded_files',
        'admin_get_user',
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
        'deny_contract',
        'create_daily_bonus',
        'create_daily_bonus',
        'get_daily_bonus',
        'get_all_daily_bonus_days_ago',
        'create_kyc',
        'get_kyc',
        'approve_kyc',
        'deny_kyc'
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
        'get_all_uploads',
        'get_all_daily_bonus_days_ago',
        'create_kyc',
        'get_kyc'
    ]);

module.exports = {
    roles,
    rolePermissions
}