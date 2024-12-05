const express = require('express');
const router = express.Router();

const statusController = require('../application/controllers/apiControllers/checkStatus.js');
const attendenceRouter = require('./attendanceRouter.js');
const staffRouter = require('./staffRouter.js')

router.get('/v1/check-status', statusController);

router.use('/attendence', attendenceRouter);
router.use('/staff', staffRouter);
module.exports = router;
