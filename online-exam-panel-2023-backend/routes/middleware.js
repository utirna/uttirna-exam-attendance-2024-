const indexModel = require('../application/model/indexModel');
const dotenv = require('dotenv');
dotenv.config();
var _PROJECT_ENV = process.env.PROJECT_ENV;

var sendData = {
	_call: 0,
	_error: [],
};
var middleware = {
	checkForPoolConnection: function (req, res, next) {
		checkProjectEnv(req);
		req.getConnection(function (err, connection) {
			if (err) {
				sendData._call = 999;
				sendData._error = '_ DB connection error';
				res.send(sendData);
			} else {
				res.pool = connection;
				next();
			}
		});
	},
	checkForPoolConnectionWithSession: function (req, res, next) {
		checkProjectEnv(req);
		if (typeof req.session.Exam == 'undefined') {
			res.redirect('/');
		}

		req.getConnection(function (err, connection) {
			if (err) {
				sendData._call = 999;
				sendData._error = '_ connection error';
				res.send(sendData);
			} else {
				res.pool = connection;
				next();
			}
		});
	},
	checkForPoolConnectionWithAdminSession: function (req, res, next) {
		checkProjectEnv(req);
		if (typeof req.session.Admin == 'undefined') {
			res.redirect('/admin');
			return false;
		}

		req.getConnection(function (err, connection) {
			if (err) {
				sendData._call = 999;
				sendData._error = '_ connection error';
				res.send(sendData);
			} else {
				res.pool = connection;
				next();
			}
		});
	},

	checkExamMode: async function (req, res, next) {
		if (!req.session.examMode) {
			let _isMockMode = await indexModel.checkExamMode(res.pool);

			if (_isMockMode[0].is_mock_mode == 1) {
				req.session.examMode = 'MOCK';
			} else {
				req.session.examMode = 'FINAL';
			}
		}
		next();
	},
};

function checkProjectEnv(req) {
	/**
	 * This function sets the detils in session for developement purpose so you dont have to login again and again
	 * */
	if (_PROJECT_ENV.toLowerCase() == 'development' || _PROJECT_ENV.toLowerCase() == 'dev') {
		// req.session.Admin = {
		// 	admin_id: 1,
		// 	cc: 101,
		// 	c_name: 'Sandip Foundation',
		// 	is_mock_mode: false,
		// 	IP_MASTER_SERVER: 'http://192.168.1.21',
		// 	IP_FORM_FILLING: 'http://192.168.1.21:5042/master/',
		// };
	}
}

module.exports = middleware;
