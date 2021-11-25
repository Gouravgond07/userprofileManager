const { jwtConfig } = require('../config/index');
const JWT_SECRETE_KEY = jwtConfig.secreteKey;
const UserAuthService = require('../services/userAuth.service');

/**
 * Auth MiddleWare to verify JWT Token
 */
exports.userAuthMiddleWare = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        const error = new Error('Unauthorized');
        // @ts-ignore
        error.status = 401;
        return next(error);
    }
    try {
        const tokenData = await UserAuthService.verifyUserAccessToken(token, JWT_SECRETE_KEY);
        req.user = tokenData;
        next();
    } catch (error) {
        res.status(403).json({ status: false, success: {}, token: 'JWT Expired' })
    }
}
