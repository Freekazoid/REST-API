module.exports = class ApiError extends Error {
    status;
    error;

    constructor(status, messange, errors = []){
        super(messange);
        this.status = status;
        this.errors = errors;
    }

    static UnavthorizedError(){
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static BedRequest(message, errors = []){
        return new ApiError(400, message, errors);
    }
}