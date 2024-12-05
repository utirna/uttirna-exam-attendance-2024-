var express = require('express');
var attendenceRouter = express.Router();

const middleware = require('./middleware.js');
const staffController = require('../application/controllers/staffController.js');

attendenceRouter.post('/v1/save-details', middleware.checkForPoolConnection, staffController.saveStaffDetails);
attendenceRouter.get('/v1/get-list', middleware.checkForPoolConnection, staffController.getStaffDetailsList);

module.exports = attendenceRouter;
