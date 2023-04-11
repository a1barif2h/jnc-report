class AppError extends Error{
    constructor(message, statusCode){
        const stactTraceLineLimit = 10;
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.stackTraceLimit = stactTraceLineLimit;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;