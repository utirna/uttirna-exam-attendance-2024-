class CustomError extends Error {
	constructor(message, statusCode, call) {
		super(message)
		this.statusCode = statusCode
		this.call = call
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = CustomError
