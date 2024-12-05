module.exports = function () {
	const index = require('./main')
	const users = require('./users')
	
	const apiRouter = require('./apiRouter.js')
	return { index, users, apiRouter }
}
