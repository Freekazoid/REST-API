const bcrypt = require('bcrypt');
const userModel = require('../models/user-models');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');


class UserService { 
    async signup(login, password){
        const candidate = await userModel.findOne({ $or: [{ email: login.email }, { phone: login.phone }] });
        
        if (candidate){
            throw ApiError.BedRequest(`Пользователь уже существует`);
        }
        const hashPasswoed = await bcrypt.hash(password, 3);
        const email = login.email ? login.email : '';
        const phone = login.phone ? login.phone: '';
        const user = await userModel.create({
            email: email,
            phone: phone,
            password: hashPasswoed,
        });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return {
            ...tokens,
            user: userDto 
        }
    }
    async signin(login, password) {
        // console.log(login);
        const user = await userModel.findOne({ $or: [{ email: login.email }, { phone: login.phone }] });
        if(!user){
            throw ApiError.BedRequest('Пользователь не найден');
        }
        
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BedRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token;
    }
    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnavthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDB){
            throw ApiError.UnavthorizedError();
        }

        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
        
    }
    async getUser(refreshToken){
        const userData = tokenService.validateRefreshToken(refreshToken);
        const user = await userModel.findById(userData.id);
        return user;
    }
}

module.exports = new UserService(); 