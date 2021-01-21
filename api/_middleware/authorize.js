const jwt = require('express-jwt');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    let secret = "";
    if("SECRET_STR" in process.env){
        secret = process.env.SECRET_STR;
    }else{
        secret  = require('config.json').secret;
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await db.User.findById(req.user.id);
            if (!user || (roles.length && !hasValidRole(roles, user.role))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = user.role;
            const refreshTokens = await db.RefreshToken.find({ user: user.id });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}

function hasValidRole (allowedRoles, userRoles) {
    for(allowed of allowedRoles){
        if(userRoles.includes(allowed)){
                return true;
            }
    }
    return false;
}
