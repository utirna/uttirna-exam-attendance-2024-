var AdminModel = require('../model/adminModel');
var responderSet = require('../config/_responderSet');
var cURLConf = require('../config/curl.config');
var request = require('request'); //requiring request module
const fs = require('fs');
const { default: axios } = require('axios');
const path = require('path');
const extractZip = require('extract-zip');
const { DIR } = require('../config/directories');
const CustomError = require('../config/CustomError');

var resultStatus = responderSet.checkResult;

var adminController = {
	updateMasterIpAress: function (req, res, next) {
		AdminModel.updateMasterIP(res.pool, req.body)
			.then((result) => {
				console.log(result, '-result');
				if (result.affectedRows === 1) {
					res.status(200).send({
						success: true,
						status: 201,
						message: 'IP Address URL SET Set Successfully',
					});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	adminHome: (req, res, next) => {
		if (typeof req.session.Admin == 'undefined') {
			res.render('admin/admin-login-page', {
				cc: 0,
				c_name: '',
			});
		} else {
			res.redirect('/admin/exams');
		}
	},
	swHome: (req, res, next) => {
		if (typeof req.session.Admin == 'undefined') {
			res.render('sw/index', {
				cc: 0,
				c_name: '',
			});
		} else {
			res.redirect('/sw/exam_lock_status');
		}
	},
	adminExams: async (req, res, next) => {
		let SERVER_IP = await AdminModel.getIpAdd(res.pool);
		req.session.Admin.IP_MASTER_SERVER = SERVER_IP[0].server_ip;
		req.session.Admin.IP_FORM_FILLING = SERVER_IP[0].ip_form_filling;
		console.log(req.session.Admin, '==req.session.Admin==');
		// console.log(SERVER_IP, '-server ip =======================');
		res.render('admin/exams', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
			is_mock_mode: req.session.Admin.is_mock_mode,
		});
	},

	adminLoginAuth: async (req, res, next) => {
		try {
			let _authStatus = await AdminModel.checkAdminLoginAuth(res.pool, req.body);

			console.log(_authStatus);
			if (_authStatus.length == 0) {
				let error = new CustomError('Invalid Login Details', 401, 0);
				throw error;
			}

			if (req.body.isMockMode) {
				console.log('is Mock mode');
				let _res = await AdminModel.updateMockModeOn(res.pool, req.body);
			}

			req.session.Admin = {
				admin_id: _authStatus[0].admin_id,
				cc: _authStatus[0].cc,
				c_name: _authStatus[0].c_name,
				is_mock_mode: req.body.isMockMode,
			};

			console.log(req.session.Admin, '---after setting session');

			return res.status(200).json({
				success: true,
				status: 200,
				message: 'Login Successful',
			});

			// if (result.length == 0) {
			// 	res.redirect('/admin')
			// } else {
			// 	req.session.Admin = {
			// 		admin_id: result[0].admin_id,
			// 		cc: result[0].cc,
			// 		c_name: result[0].c_name,
			// 	}
			// 	res.redirect('/admin/exams')
			// }
		} catch (error) {
			next(error);
		}
	},
	getAdminnerView: (req, res, next) => {
		res.render('admin/adminner', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
		});
	},
	adminLogOut: (req, res, next) => {
		req.session.destroy(function (err) {
			res.redirect('/admin');
		});
	},
	ajaxGetExamList: function (req, res, next) {
		AdminModel.getPublishTestList(res.pool)
			.then((result) => {
				if (result.length > 0) {
					res.status(200).send({ call: 1, data: result });
				} else {
					res.status(200).send({ call: 2, message: 'No exam found' });
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ call: 0, data: error?.message || 'Error on server' });
			});
	},
	ajaxGetDoneExamList: function (req, res, next) {
		AdminModel.getDonePublishTestList(res.pool)
			.then((result) => {
				if (result.length > 0) {
					res.status(200).send({ call: 1, data: result });
				} else {
					res.status(200).send({ call: 0 });
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ data: error });
			});
	},
	getStudentAttendanceView: function (req, res, next) {
		res.render('admin/student-attendance', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
		});
	},
	getAllStudentsView: function (req, res, next) {
		res.render('admin/all-students', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
		});
	},
	getBatchStudentList: function (req, res, next) {
		var data = req.body;
		AdminModel.getBatchStudentList(res.pool, data)
			.then((result) => {
				res.status(200).send({ call: 1, data: result });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	markStudentAttendace: function (req, res, next) {
		var data = req.body;
		AdminModel.markStudentAttendace(res.pool, data.applicant_id)
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	getSingleStudentDetails: function (req, res, next) {
		var data = req.body;
		AdminModel.getSingleStudentDetails(res.pool, data.applicant_id)
			.then((result) => {
				result.length == 0 ? res.status(200).send({ call: 0 }) : res.status(200).send({ call: 1, data: result });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	getStudentsListBatchwise: async function (req, res, next) {
		try {
			let _res = await AdminModel.getStudentsListBatchwise(res.pool, req.body);
			console.log(_res, '-data-');

			if (_res.length >= 1) {
				return res.status(200).json({
					success: true,
					status: 200,
					data: _res,
				});
			} else {
				return res.status(200).json({
					success: false,
					status: 200,
					data: [],
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getExamStudentList: function (req, res, next) {
		var data = req.params;
		var details = {
			exam: [],
			student: [],
		};
		AdminModel.getExamStudentList(res.pool, data.pub_id)
			.then((result) => {
				if (result.length == 0) {
					details.student = [];
				} else {
					details.student = result;
				}
				return AdminModel.getSinglePublishInfo(res.pool, data.pub_id);
			})
			.then((result) => {
				res.render('admin/exam-student-list', {
					exam_info: result,
					student_list: details.student,
					cc: req.session.Admin.cc,
					c_name: req.session.Admin.c_name,
				});
			})
			.catch((error) => {
				console.log(error);

				return res.status(500).json({
					call: 0,
					message: error.message,
				});
			});
	},

	startAttendance: async function (req, res, next) {
		try {
			let data = req.body;
			console.log(data, '------------');

			let _res = await AdminModel.startAttendance(res.pool, data);
			console.log(_res);
			if (_res.affectedRows == 1) {
				return res.status(200).json({
					call: 1,
					message: 'Successfully updated attendance status',
				});
			} else {
				return res.status(200).json({
					call: 0,
					message: 'Error while updating attendance status',
				});
			}
		} catch (error) {
			return res.status(500).json({
				call: 0,
				message: error.message,
			});
		}
	},

	loadExam: function (req, res, next) {
		var data = req.body;
		console.log(data, '-start examd data =====');
		AdminModel.loadExam(res.pool, data.pub_id)
			.then((result) => {
				if (result.affectedRows > 0) {
					res.status(200).send({ call: 1 });
				} else {
					res.status(200).send({ call: 0 });
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	startExamSession: function (req, res, next) {
		var data = req.body;
		AdminModel.startExamSession(res.pool, data.pub_id)
			.then((result) => {
				if (result.affectedRows > 0) {
					res.status(200).send({ call: 1 });
				} else {
					res.status(200).send({ call: 0 });
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},

	getCURLExamList: function (req, res, next) {
		/**
		 * This will get new exam list from question paper generation panel
		 * And will get exam list for today and later
		 * Will not get list of exams older than today (today exclusive)
		 */
		var data = req.body;
		exam_list = {
			exam_list: JSON.parse(data.exam_list),
		};
		console.log(exam_list, '-exam list');
		console.log(cURLConf.CURL_link.new_exam_list, '-url===');
		request.post(
			{
				url: cURLConf.CURL_link.new_exam_list,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ exam_list }),
			},
			function (error, response, body) {
				console.log(response, '=,---');
				if (typeof response === 'undefined') {
					res.status(200).send({ call: 999 });
				} else {
					let __examsList = JSON.parse(body).data;

					res.status(200).json({
						call: 1,
						data: __examsList,
					});
					res.end();
				}
			}
		);
	},
	getCURLCenterDetails: function (req, res, next) {
		var data = req.body;
		request(cURLConf.CURL_link.get_center_data + '/' + data.center_code, function (error, response, body) {
			// res.status(response.statusCode).send(body);
			if (typeof response === 'undefined') {
				res.status(200).send({ call: 999 });
			} else {
				if (!error && response.statusCode == 200) {
					var json_data = JSON.parse(body);
					switch (json_data.call) {
						case 1:
							AdminModel.cleanAuthDetails(res.pool)
								.then((result) => {
									return AdminModel.addAuthDetails(res.pool, json_data.data);
								})
								.then((result) => {
									res.status(200).send({ call: 1 });
								})
								.catch((error) => {
									res.status(200).send({ call: 0, err: error });
								});
							break;
						default:
							res.status(200).send({ call: 5 });
							break;
					}
				} else {
					res.status(response.statusCode).send(body);
				}
			}
		});
	},

	getCURLDownloadPhotoSign: async function (req, res, next) {
		try {
			let formFillingIP = req.session?.Admin?.IP_FORM_FILLING;

			// TODO (Omkar): if ip undefined redirect to login page
			if (!formFillingIP) {
				return res.status(400).json({
					call: 999,
					message: 'Invalid session',
				});
			}

			global.io.emit('status-photo-sign-download', 'Validating info...');

			let url = `${formFillingIP}students-data/download/photo-sign`;
			let _response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(req.body),
			});

			if (!_response.ok) {
				let error = new Error('Something went wrong while downloading photos/sign');
				error.info = await _response;
				throw error;
			}

			global.io.emit('status-photo-sign-download', 'Starting download');

			const chunks = [];

			const headers = await _response.headers;
			let contentLength = headers.get('Content-Length');
			let fileName = headers.get('x-file-name');
			console.log(fileName, 'filename');

			let downloadedContent = 0;
			let downloadPercentage = 0;

			let reader = _response.body.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					global.io.emit('status-photo-sign-download', `File zip completed`);
					break;
				}
				chunks.push(value);
				downloadedContent += value.byteLength;
				// prettier-ignore
				downloadPercentage = ((downloadedContent / contentLength) * 100).toFixed(1)
				global.io.emit('status-photo-sign-download', `Downloading : ${downloadPercentage} %`);
			}

			let blob = new Blob(chunks, { type: 'application/pdf' });
			let buff = Buffer.from(await blob.arrayBuffer());

			global.io.emit('status-photo-sign-download', `Saving file`);
			if (!fs.existsSync(DIR.TEMP_DIR)) {
				fs.mkdirSync(DIR.TEMP_DIR, { recursive: true });
			}

			fs.writeFileSync(path.resolve(DIR.TEMP_DIR, `${fileName}`), buff, 'binary');

			if (!fs.existsSync(DIR.PICS_DIR)) {
				fs.mkdirSync(DIR.PICS_DIR, { recursive: true });
			}
			global.io.emit('status-photo-sign-download', `Extracting images`);
			await extractZip(path.resolve(DIR.TEMP_DIR, fileName), {
				dir: DIR.PICS_DIR,
			});

			global.io.emit('status-photo-sign-download', `Download complete`);

			global.io.emit('status-photo-sign-download', `Cleaning Up`);
			fs.unlinkSync(DIR.TEMP_DIR + '/' + fileName);

			global.io.emit('completed', `Completed`);

			// updating status in db (photo/sign downloaded)
			let _updateRes = await AdminModel.updateSignDownloadStatus(res.pool, req.body.exam_id);
			console.log(_updateRes);
			global.io.emit('sign-photo-download-status-updated', 'Completed');
		} catch (error) {
			console.log(error, '==error==');
			if (error.message == 'fetch failed') {
				return res.status(500).json({
					call: 999,
					message: 'Failed to connect to form filling server',
				});
			}
		}
	},

	getCURLDownloadNodeDetails: async function (req, res, next) {
		/**
		 * This will download node details from form filling sever according to batch no
		 * eg req.body
			{
				center_code = 101	
			}
		 */
		var _reqData = req.body;
		console.log(_reqData, '==_reqData==');

		let formFillingIP = req?.session?.Admin?.IP_FORM_FILLING;

		if (!formFillingIP) {
			return res.redirect('/admin');
		}

		try {
			let url = formFillingIP + 'node-manager/download-node-details';
			console.log(url, '==url==');
			let _nodeDetails = await axios.post(url, _reqData);

			if (_nodeDetails.data.data.length >= 1) {
				console.log(_nodeDetails.data.data, '==_nodeDetails==');

				let _insertNodeListRes = await AdminModel.insertNodeList(res.pool, _nodeDetails.data.data);
			}
		} catch (error) {
			console.log(error, '==error==');
			res.status(500).json({
				call: 999,
				message: 'Not able to connect to form filling server',
			});
		}
	},
	finalPublish: async function (req, res, next) {
		let examId = req.body.exam_id;
		console.log(examId, '==examId==');
		if (!examId) {
			return res.status(401).json({
				call: 2,
				message: 'Invalid exam ID',
			});
		}

		// check if exam, students, photo/sign are downloaded first then only allow final publish
		let _examDetailsRes = await AdminModel.getExamDetails(res.pool, examId);
		console.log(_examDetailsRes[0]);
		let { is_students_downloaded, is_sign_downloaded, is_photos_downloaded } = _examDetailsRes[0];

		if (is_students_downloaded != 1) {
			return res.status(200).json({
				call: 3,
				message: 'Please download students details',
			});
		}

		if (is_sign_downloaded != 1 && is_photos_downloaded != 1) {
			return res.status(200).json({
				call: 3,
				message: 'Please download students photo and signature',
			});
		}

		let _response = await AdminModel.finalPublish(res.pool, examId);
		console.log(_response);
		if (_response.affectedRows == 1) {
			return res.status(201).json({
				call: 1,
				message: 'Final publish successful',
			});
		}
	},

	getCURLDownloadStudent: async function (req, res, next) {
		/**
		 * This will download students from form filling sever according to batch no
		 * eg req.body
			{
				batch_list: '1',
				center_code: '101',
				exam_id: '21',
				exam_date: '02-08-2024'
			}
		 */
		var _reqData = req.body;
		console.log(_reqData, '==_reqData==');
		let formFillingIP = req?.session?.Admin?.IP_FORM_FILLING;

		if (!formFillingIP) {
			return res.redirect('/admin');
		}
		console.log(1, '==1==');

		try {
			let url = formFillingIP + '/students-data/data';
			// console.log(url, '==url==');
			let _studentsData = await axios.post(url, { _reqData });
			// console.log(_studentsData, '==_studentsData==');

			if (_studentsData.data.call === 1) {
				let __studentsData = _studentsData.data.data;

				if (__studentsData.length === 0) {
					return res.status(200).json({
						call: 5,
						message: 'Students not found',
					});
				}

				AdminModel.cleanStudent(res.pool, _reqData)
					.then((result) => {
						/**
						 * This will insert/add downloaded students to tn_student_list table
						 * students are downloaded from form filling panel
						 * */
						return AdminModel.addBatchToList(res.pool, __studentsData);
					})
					.then((result) => {
						// console.log(result, '-after inserting data');
						/**
						 * Updating the students downloaded status to  tm_published_test_list
						 */
						return AdminModel.updateStudentDownloadStatus(res.pool, req.body.exam_id);
					})
					.then((result) => {
						return res.status(200).send({ call: 1, message: 'Student downloaded successfully' });
					})
					.catch((error) => {
						console.log(error, '----');
						res.status(200).send({ call: 0, err: error });
					});
			}
		} catch (error) {
			console.log(error, '==error==');
			res.status(500).json({
				call: 999,
				message: 'Not able to connect to form filling server',
			});
		}
	},
	getCURLDownloadExam: function (req, res, next) {
		var data = req.body;
		console.log(cURLConf.CURL_link.download_exam + '/' + data.id);
		console.log(2, '==2==');
		request(cURLConf.CURL_link.download_exam + '/' + data.id, function (error, response, body) {
			console.log(response, '==response==');
			if (typeof response === 'undefined') {
				res.status(200).send({ call: 999 });
			} else {
				if (!error && response.statusCode == 200) {
					var json_data = JSON.parse(body);
					switch (json_data.call) {
						case 1:
							AdminModel.cleanPublish(res.pool, json_data.exam_info[0].id)
								.then((data) => {
									return AdminModel.addPublishList(res.pool, json_data.exam_info);
								})
								.then((data) => {
									return AdminModel.cleanQuestionPaper(res.pool, json_data.exam_info[0].ptl_test_id);
								})
								.then((data) => {
									return AdminModel.addQuestionPaper(res.pool, json_data.exam_question);
								})
								.then((data) => {
									res.status(200).send({ call: 1 });
								})
								.catch((error) => {
									console.log(error);
									res.status(200).send({ call: -1, error: error });
								});
							break;
						case 2:
							res.status(200).send({ call: 2 });
							break;
						case 3:
							res.status(200).send({ call: 3 });
							break;
						default:
							res.status(200).send({ call: 0 });
							break;
					}
				} else {
					res.status(response.statusCode).send(body);
				}
			}
		});
	},
	getCURLSendData: function (req, res, next) {
		var data = req.body;
		console.log(data, '==data backend==');
		var send_data = {
			student_list: [],
			exam_paper: [],
			pub_id: data.pub_id,
		};

		AdminModel.getDoneExamsStudentListData(res.pool, data.pub_id)
			.then((res_data) => {
				if (res_data.length == 0) {
					return [];
				} else {
					send_data.student_list = res_data;
					return AdminModel.getDoneExamsStudentExamData(res.pool, data.pub_id);
				}
			})
			.then((result) => {
				if (result.length == 0) {
					return { call: 4 };
				} else {
					send_data.exam_paper = result;
					return AdminModel.uploadResultPerBatch(cURLConf, request, send_data);
				}
			})
			.then((result) => {
				if (result.call == 1) {
					return AdminModel.updatePublishExamUploaded(res.pool, data.pub_id);
				} else {
					return result;
				}
			})
			.then((result) => {
				res.status(200).send(result);
			})
			.catch((error) => {
				res.status(200).send({ call: 0, data: error });
			});
	},
	addRemoteTest: function (req, res, next) {
		var data = req.body;
		AdminModel.addPublishList(res.pool, data.publish_data)
			.then(function (res_data) {
				return AdminModel.addBatchToList(res.pool, data.batch_to_publish);
			})
			.then(function (res_data) {
				return AdminModel.addTestInfo(res.pool, data.test_info);
			})
			.then(function (res_data) {
				return AdminModel.addQuestionPaper(res.pool, data.question_set);
			})
			.then(function (res_data) {
				res.status(200).send({ call: 1 });
			})
			.catch(function (error) {
				console.log(error);
				res.status(200).send(error);
			});
	},
	addRemoteStudent: function (req, res, next) {
		var data = req.body;
		res.status(200).sent(data);
	},
	createDbBackup: function (req, res, next) {
		var data = req.body;
		AdminModel.createDbBackup(res.pool, data)
			.then(function (res_data) {
				try {
					if (fs.existsSync(res_data)) {
						return AdminModel.updateExamIsGen(res.pool, data);
					} else {
						return { call: -1 };
					}
				} catch (error) {
					console.log(error);
					return { call: 0, data: error };
				}
			})
			.then((is_done) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ call: error });
			});
	},
	unsetExam: function (req, res, next) {
		var data = req.body;
		AdminModel.RemoveThisExamData(res.pool, data)
			.then((result) => {
				return AdminModel.updateExamIsDone(res.pool, data);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, 'utr_student_attendance');
			})
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	clearDB: function (req, res, next) {
		var table = responderSet.table_list;
		console.log(table[0]);
		AdminModel.clearTableRecored(res.pool, table[0])
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[1]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[2]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[3]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[4]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[5]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[6]);
			})
			.then((result) => {
				return AdminModel.clearTableRecored(res.pool, table[7]);
			})
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	loadStudentListBackToFinal: function (req, res, next) {
		var data = req.body;
		AdminModel.RemoveOldExamData(res.pool, data)
			.then((result) => {
				return AdminModel.loadStudentListBackToFinal(res.pool, data);
			})
			.then((result) => {
				res.status(200).send(result);
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	getExamLockStatus: function (req, res, next) {
		AdminModel.getExamLockStatus(res.pool)
			.then((result) => {
				res.render('admin/exam-lock-list', {
					cc: req.session.Admin.cc,
					student_list: result,
					c_name: req.session.Admin.c_name,
				});
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	swExamLockStatus: function (req, res, next) {
		AdminModel.getExamLockStatus(res.pool)
			.then((result) => {
				res.render('admin/sw-exam-lock-list', {
					student_list: result,
				});
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},
	markedAsAbsent: function (req, res, next) {
		var data = req.body;
		AdminModel.markAsAbsent(res.pool, data)
			.then((result) => {
				return AdminModel.updateTestAsAbsent(res.pool, data);
			})
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ call: 0, data: error });
			});
	},
	unlockOneUser: function (req, res, next) {
		var data = req.body;
		AdminModel.clearUnlockOneUser(res.pool, data.stud_id)
			.then((result) => {
				// Unlocking student with their MAC ID
				return AdminModel.getUnlockUserMacId(res.pool, data);
			})
			.then((macId) => {
				if (!macId || !macId[0].mac_id) {
					return res.status(404).json({
						call: 0,
						message: 'User with mac id not found',
					});
				}
				data['mac_id'] = macId[0].mac_id;

				// Adding log why students have been unlocked (table = utr_unlock_list)
				return AdminModel.addclearUnlockUserLog(res.pool, data);
			})
			.then((data) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({ call: 0, data: error });
			});
	},
	unlockAllUser: function (req, res, next) {
		AdminModel.clearTableRecored(res.pool, 'utr_student_attendance')
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ call: 0, data: error });
			});
	},
	getLiveExamStatus: function (req, res, next) {
		AdminModel.getLiveExamStatus(res.pool)
			.then((result) => {
				res.render('admin/live-exam-status', {
					cc: req.session.Admin.cc,
					student_list: result,
					c_name: req.session.Admin.c_name,
				});
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send(error);
			});
	},

	getUnlockedCandidatesList: async (req, res, next) => {
		try {
			let _unlockedCandidatesList = await AdminModel.getUnlockedCandidatesList(res.pool);
			console.log(_unlockedCandidatesList, '-list');
			res.render('admin/unlocked-candidates-list', {
				studentsList: _unlockedCandidatesList,
			});
		} catch (error) {
			console.log(error);
		}
	},

	getUploadBannerView: function (req, res, next) {
		res.render('admin/upload-banner-view.pug', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,
		});
	},

	postUploadBanner: function (req, res, next) {
		let bannerImage = req.files.banner;
		console.log(bannerImage);
		let fileName = `bannerImage.${bannerImage.name.split('.')[1]}`;

		bannerImage.mv(`./public/img/banner-image/${fileName}`, function (err) {
			if (err) {
				return res.status(200).json({
					call: 0,
				});
			} else {
				return res.status(200).json({
					call: 1,
				});
			}
		});
	},

	centerHandlerView: function (req, res, next) {
		res.render('center-handler/home.pug', {
			cc: req.session.Admin.cc,
			c_name: req.session.Admin.c_name,

			is_mock_mode: req.session.Admin.is_mock_mode,
		});
	},

	newCenterHandlerView: async function (req, res, next) {
		try {
			let _storedLayouts = await AdminModel.storedLayouts(res.pool);
			console.log(_storedLayouts, '============================');
			console.log(req.session);
			res.render('center-handler/create-new.pug', {
				// cc: req.session.Admin.cc,
				// c_name: req.session.Admin.c_name,
				_storedLayouts,
				// is_mock_mode: req.session.Admin.is_mock_mode,
				session: req.session.Admin,
			});
		} catch (error) {
			console.log(error);
		}
	},

	addNewCenter: async function (req, res, next) {
		console.log(req.body, '-===================');
		try {
			let { affectedRows } = await AdminModel.addNewCenter(res.pool, req.body);
			if (affectedRows === 1) {
				return res.status(201).json({
					status: 201,
					success: true,
					message: 'Successfully added new center',
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	deleteCenter: async function (req, res, next) {
		console.log(req.body, '-===================');
		try {
			let { affectedRows } = await AdminModel.deleteCenter(res.pool, req.body);
			if (affectedRows === 1) {
				return res.status(201).json({
					status: 201,
					success: true,
					message: 'Successfully deleted center',
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	clearThisExamSession: function (req, res, next) {
		var data = req.body;
		AdminModel.clearExamFormPublish(res.pool, data.pub_id)
			.then((result) => {
				return AdminModel.clearExamFormStudentList(res.pool, data.batch_no);
			})
			.then((result) => {
				return AdminModel.clearExamFormStudentTestList(res.pool, data.pub_id);
			})
			.then((result) => {
				return AdminModel.clearExamFormStudentQuestionPaper(res.pool, data.pub_id);
			})
			.then((result) => {
				res.status(200).send({ call: 1 });
			})
			.catch((error) => {
				console.log(error);
				res.status(200).send({ call: 0, data: error });
			});
	},
	getValueListPost: (request, response) => {
		AdminModel.getValueListFromDbPost(response.pool)
			.then((result) => {
				response.render('admin/get-value-list-post', {
					list: result,
					batch: 'All',
				});
			})
			.catch((error) => {
				console.log(error);
				response.status(200).send({ call: 0, data: error });
			});
	},
	getValueList: (request, response) => {
		let { id } = request.params;
		AdminModel.getValueListFromDb(response.pool, id)
			.then((result) => {
				response.render('admin/get-value-list', {
					list: result,
					batch: 'All',
				});
			})
			.catch((error) => {
				console.log(error);
				response.status(200).send({ call: 0, data: error });
			});
	},
	setValueList: (request, response) => {
		let data = request.body;
		AdminModel.setUpdateNull(response.pool, Number(data.id))
			.then((result) => {
				// console.log(result);
				return AdminModel.setUpdateAccept(response.pool, data.id, Number(data.c));
			})
			.then((result) => {
				console.log(result);
				return AdminModel.setUpdateMoreAccept(response.pool, data.id, Number(data.i));
			})
			.then((result) => {
				console.log(result);
				response.redirect('/admin/get-value');
			})
			.catch((error) => {
				console.log(error);
				response.status(200).send({ call: 0, data: error });
			});
	},
};

module.exports = adminController;

// {"id":"100191","c":"30","i":"60"}
