var express = require('express');
var attendenceRouter = express.Router();

const attendenceController = require('../application/controllers/attendenceController');
const middleware = require('./middleware.js');

attendenceRouter.get('/', middleware.checkForPoolConnection, attendenceController.attendencePage);

attendenceRouter.post('/v1/mark-present', middleware.checkForPoolConnection, attendenceController.markAttendencePresent);

attendenceRouter.post('/v1/student-details', middleware.checkForPoolConnection, attendenceController.getStudentDetails);

// get students count (present/attendance not marked)
attendenceRouter.get('/v1/student-attendance-count', middleware.checkForPoolConnection, attendenceController.studentAttendanceCount)

module.exports = attendenceRouter;
