const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { rolePermissions } = require('../config/roles');

const auth = (requiredPermission) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null)
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Sem autenticação'));

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'Token inválido'));
        }

        req.user = user;

        console.log(user)

        if (requiredPermission) {
            if (!user.role || !rolePermissions.get(user.role).includes(requiredPermission)) {
                return next(new ApiError(httpStatus.FORBIDDEN, 'Permissão negada'));
            }
        }

        next();
    });
}

module.exports = auth;