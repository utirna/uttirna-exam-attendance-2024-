const express = require('express');
const attendenceRouter = require('./attendanceRouter');
const { checkForPoolConnection, checkServerIpAddressInSession } = require('./middleware');
const connectionController = require('../application/controllers/connectionController');
const connectionRouter = require('./connectionRouter');
const middleware = require('./middleware');

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
	res.redirect('/candidate/home');
	// const session = req.session;

	// res.render('candidate/landing-page', {
	// 	session,
});

indexRouter.get('/staff-list', middleware.checkServerIpAddressInSession, async (req, res) => {
	try {
		const serverUrl = req.session?.serverUrl;
		const endPoint = '/api/staff/v1/get-list';
		const callToServerApiUrl = `${serverUrl}${endPoint}`;

		const _res = await fetch(callToServerApiUrl);

		const _resData = await _res.json();

		let { data: staffMemebers, call } = _resData;

		const staffImageBaseUrl = `${serverUrl}/pics/_staff_images/`;

		res.render('candidate/staff-list', {
			staffMembers: staffMemebers || [],
			staffImageBaseUrl,
			session: req.session,
		});
	} catch (err) {
		console.log('Error while rendering the staff list page : ', err);
	}
});

indexRouter.use('/connection', connectionRouter);

indexRouter.use('/attendence', attendenceRouter);

module.exports = indexRouter;
