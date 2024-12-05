const attendenceController = require('../application/controllers/attendenceController.js');

const candidateRouter = require('express').Router();

candidateRouter.get('/home', attendenceController.attendencePage);

module.exports = candidateRouter;
