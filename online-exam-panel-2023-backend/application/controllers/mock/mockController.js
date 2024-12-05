const CustomError = require('../../config/CustomError');
const { myDate } = require('../../config/_responderSet');
const AdminModel = require('../../model/adminModel');
const mockModel = require('../../model/mock/mockModel');
const asyncErrHandler = require('../../utiils/asyncErrHandler');

const mockController = {
	mockHome: (req, res, next) => {
		if (typeof req.session.Admin == 'undefined') {
			res.render('admin/admin-login-page.pug', {
				cc: 0,
				c_name: '',
			});
		} else {
			res.redirect('/admin/mock-exam-setting');
		}
	},

	mockExamSetting: async (req, res, next) => {
		let SERVER_IP = await AdminModel.getIpAdd(res.pool);
		req.session.Admin.IP_MASTER_SERVER = SERVER_IP[0].server_ip;
		req.session.Admin.IP_FORM_FILLING = SERVER_IP[0].ip_form_filling;

		res.render('admin/mock-setting-view.pug', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
			is_mock_mode: req.session.Admin.is_mock_mode,
		});
	},

	mockExamSettingSave: asyncErrHandler(async (req, res, next) => {
		if (!req.session.Admin.cc) {
			throw new CustomError('Session Expired', 440, 0);
		}
		let data = req.body;
		let testData = {
			total_candidates: data['total-candidates'],
			test_duration: data['test-duration'],
			total_questions: data['total-questions'],
			total_marks: data['total-marks'],

			batch_no: Math.floor(Math.random() * 300) + 100,
			exam_date: myDate.getDate(),
			exam_time: myDate.getTime(),

			cc: req.session.Admin.cc,
		};

		testData['exam_date_time'] = testData.exam_date + ' ' + testData.exam_time;

		// publish mock test
		let _publishRes = await mockModel.publishMockTest(res.pool, testData);
		console.log(_publishRes);

		// generate students
		let _generateStudentsRes = await mockModel.generateMockStudents(res.pool, testData);

		console.log(_generateStudentsRes, '_generateStudentsRes==========');

		// generate questions
		let _mockQueGenerateRes = await mockModel.generateMockQuestions(res.pool, testData);
		console.log(_mockQueGenerateRes, '_mockQueGenerateRes');
		if (_mockQueGenerateRes.affectedRows >= 1) {
			return res.status(201).json({
				success: true,
				status: 201,
				message: 'Mock test has been generated successfully.',
			});
		}
	}),

	// mock exams list
	mockExamsList: asyncErrHandler(async (req, res, next) => {
		console.log('here');
		let _mockExamListRes = await mockModel.mockExamsList(res.pool);
		console.log(_mockExamListRes, '-here');
		return res.status(200).json({
			success: true,
			status: 200,
			message: 'Mock exams list',
			data: _mockExamListRes,
		});
	}),
};

module.exports = mockController;
