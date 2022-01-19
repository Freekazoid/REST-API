const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function(req, res, next){
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnavthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnavthorizedError());
        }


        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnavthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnavthorizedError());
    }
}