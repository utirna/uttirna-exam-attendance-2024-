var express = require('express')
var attendenceRouter = express.Router()

const attendenceController = require('../application/controllers/attendenceController')
const middleware = require('./middleware.js')

attendenceRouter.get(
	'/',
	middleware.checkForPoolConnection,
	attendenceController.attendencePage
)

attendenceRouter.post(
	'/mark-present',
	middleware.checkForPoolConnection,
	attendenceController.markAttendencePresent
)

attendenceRouter.post(
	'/student-details',
	middleware.checkServerIpAddressInSession,
	attendenceController.getStudentDetails
)

module.exports = attendenceRouter
