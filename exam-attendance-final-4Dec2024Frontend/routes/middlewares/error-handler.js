const errorHandler = (error, req, res, next) => {
	if (process.env.PROJECT_ENV == 'development') {
		res.status(error.statusCode || 500).json({
			call: error.call,
			success: false,
			error_status: error.statusCode || 500,
			message: error.message || 'Something went wrong',
			error_stack: process.env.PROJECT_ENV === 'development' ? error.stack : {},
		})
	} else {
		res.status(error.statusCode || 500).json({
			call: error.call,
			success: false,
			error_status: error.statusCode || 500,
			message: error.message || 'Something went wrong',
		})
	}
}

module.exports = errorHandler
