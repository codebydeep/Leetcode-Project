class ApiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = {},
        success = Boolean
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data || {}
        this.success = statusCode < 400
    }
}

export {ApiResponse}