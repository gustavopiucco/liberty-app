const roles = ['admin', 'user',];

const rolePermissions = new Map();

rolePermissions.set(roles[0],
    [
        'download_uploaded_files',
        'admin_get_user',
        'get_user',
        'admin_update_user',
        'update_user',
        'get_directs',
        'update_password',
        'get_multilevel',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts_me',
        'get_all_contracts',
        'get_all_contracts_by_user_id',
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
        'get_all_kyc',
        'approve_kyc',
        'deny_kyc',
        'upload_contract',
        'create_withdraw',
        'get_all_withdraws',
        'get_withdraws',
        'approve_withdraw',
        'get_wallet_me',
        'create_wallet',
        'delete_wallet',
        'get_reports_me',
        'update_voucher',
        'delete_voucher'
    ]);

rolePermissions.set(roles[1],
    [
        'get_user',
        'get_directs',
        'get_multilevel',
        'update_user',
        'update_password',
        'upload',
        'create_contract',
        'get_all_plans',
        'get_contracts_me',
        'get_all_contracts_by_user_id',
        'delete_contract',
        'get_all_uploads',
        'get_all_daily_bonus_days_ago',
        'create_kyc',
        'get_kyc',
        'upload_contract',
        'create_withdraw',
        'get_withdraws',
        'get_wallet_me',
        'create_wallet',
        'delete_wallet',
        'get_reports_me'
    ]);

module.exports = {
    roles,
    rolePermissions
}