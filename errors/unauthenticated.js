import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api.js"

class UnAuthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        // UNAUTHORIZED is 401
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export default UnAuthenticatedError
