const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const ApiErrors = require('../exceptions/api-error');


const validLogin =(login) => {
    const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const regPhone = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    const email = (regEmail.test(login) ? login : null);
    const phone = (regPhone.test(login) ? login : null);
    
    return { email, phone };
}
class UserController {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(ApiErrors.BedRequest('Ошибка валидации пароля', errors.array()));
            }
            
            const {login, password} = req.body;
            const valLogin = validLogin(login);
            

            if (valLogin.email === null && valLogin.phone === null)
                return next(ApiErrors.BedRequest('Ошибка валидации', errors.array()));
            
            const userData = await userService.signup(valLogin, password);
            res.cookie('refreshToken', userData.refreshToken, {maxage: 30 * 24 * 60* 60 * 1000, httpOnly: true});
            
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async signin(req, res, next) {
        try {
            const {login, password} = req.body;
            const valLogin = validLogin(login);

            const userData = await userService.signin(valLogin, password);

            res.cookie('refreshToken', userData.refreshToken, { maxage: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.status(200);
            
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, { maxage: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const users = await userService.getUser(refreshToken);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController;