const asyncErrHandler = (_function) => {
	return (req, res, next) => {
		_function(req, res, next).catch((err) => {
			console.log(err, '--error==')
			next(err)
		})
	}
}
module.exports = asyncErrHandler
