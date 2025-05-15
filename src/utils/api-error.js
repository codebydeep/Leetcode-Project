class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        success = Boolean,
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}