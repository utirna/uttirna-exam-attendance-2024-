var IndexModel = require('../model/indexModel');
var responderSet = require('../config/_responderSet');
const asyncErrHandler = require('../utiils/asyncErrHandler');
const adminModel = require('../model/adminModel');
var resultStatus = responderSet.checkResult;

var indexController = {
	postNewStudent: function (req, res, next) {
		var data = req.body;
		IndexModel.addNewStudent(res.pool, data)
			.then(function (res_data) {
				return IndexModel.updateStudentDetails(res.pool, res_data.insertId, data.mobileNumber);
			})
			.then(function (res_data1) {
				res.render('error_page', {
					head: 'Your Login Information',
					data: res_data1,
					isError: 0,
				});
			})
			.catch(function (error) {
				res.render('error_page', {
					message: error,
					head: 'Error',
					isError: 1,
				});
			});
	},
	checkIfPcIsAlloted: async function (req, res) {
		let { mac_id } = req.body;
		let _isAlloted = await IndexModel.checkIfPcIsAlloted(res.pool, mac_id);
		console.log(_isAlloted, '-isAlloted');
	},
	addNewStudent: function (req, res, next) {
		res.render('add-student', {
			title: 'Add New Student',
		});
		req.session.destroy(function (err) {
			// cannot access session here
		});
	},
	getExamIsDonePage: function (req, res, next) {
		res.render('exam_is_done');

		req.session.destroy(function (err) {
			// cannot access session here
		});
	},
	getExamHomePage: asyncErrHandler(async function (req, res, next) {
		console.log(req.session.examMode, 'exam mode here==');

		let { mac } = req.query;
		if (req.session.examMode == 'MOCK') {
			// for MOCK EXAM
			let _ip = await adminModel.getIpAdd(res.pool);
			req.session.SERVER_IP = _ip[0].server_ip;
			req.session.IP_FORM_FILLING = _ip[0].ip_form_filling;
			req.session.c_name = _ip[0].c_name;

			res.render('computer-registration-page.pug', {
				title: 'Computer Registration',
				session: req.session,
			});
		} else {
			// for ACTUAL EXAM
			res.render('index', {
				title: 'Exam Login',
				mac: mac,
				isSessionMessage: typeof req.session.SessionMessage === 'undefined' ? false : req.session.SessionMessage,
				exam_link: typeof req.session.ExamLink === 'undefined' ? false : req.session.ExamLink,
			});

			req.session.destroy();
		}
	}),

	checkExamLink: function (req, res, next) {
		let { mac } = req.query;
		console.log(mac);
		const _req_data = req.body;
		if (typeof _req_data._lnk == 'undefined') {
			req.session.SessionMessage = {
				msg: 'No Exam Link Passed.',
				class: 'alert-warning',
			};
			req.session.ExamLink = '';
			res.redirect('/');
		} else {
			req.session.ExamLink = _req_data._lnk;
			IndexModel.verifyLink(res.pool, _req_data._lnk)
				.then(function (db_result) {
					return resultStatus.checkResultForNullData(db_result);
				})
				.then(function (db_result) {
					db_result = db_result._data[0];
					req.session.Exam = {
						published_id: db_result.id,
						publish_link_encode: db_result.ptl_link,
						exam_orignal_id: db_result.ptl_test_id,
						exam_time: db_result.mt_test_time,
						exam_total_question: db_result.mt_total_test_question,
						exam_info: JSON.parse(db_result.ptl_test_info)[0],
						batch_no: db_result.tm_allow_to,
					};
					res.redirect('/add-student?mac=' + mac);
				})
				.catch(function (error_data) {
					req.session.SessionMessage = {
						msg: 'Invalid Exam Link, please try again.',
						class: 'alert-danger',
					};
					res.redirect('/?mac=' + mac);
				});
		}
	},
	addStudentView: function (req, res, next) {
		// if (typeof (req.session.SessionMessage) == 'undifined')
		var session_value = typeof req.session.SessionMessage == 'undifined' ? false : req.session.SessionMessage;
		delete req.session.SessionMessage;

		res.render('auth-student-view', {
			title: 'Add Student Form Exam',
			isSessionMessage: session_value,
		});
	},
	verifyCandidateForExam: async function (req, res, next) {
		if (typeof req.session.Exam == 'undefined') {
			return res.redirect('/');
		}
		let student_details = req.body;

		try {
			console.log(req.body, '-req body');
			console.log(req.session.Exam.batch_no, 'req.session.Exam');

			let db_result = await IndexModel.getStudentVerifyForExam(res.pool, student_details, req.session.Exam.batch_no);
			let result_data = await resultStatus.checkResultForNullData(db_result);
			let db_student_info = result_data._data[0];
			req.session.StudentInfo = db_student_info;

			// let _studentMacId = await IndexModel.getStudentMacId(
			// 	res.pool,
			// 	req.session.StudentInfo.id
			// )
			// _studentMacId[0].mac_id = '00:00:00:00:00'
			// _studentMacId = _studentMacId[0].mac_id
			// req.session.StudentInfo.mac = `${_studentMacId}`
			req.session.StudentInfo.mac = '00:00:00:00';
			var test_credensials = {
				test_id: req.session.Exam.exam_orignal_id,
				student_id: req.session.StudentInfo.id,
				publish_id: req.session.Exam.published_id,
				test_question_limit: req.session.Exam.exam_total_question,
				publish_link_encode: req.session.Exam.publish_link_encode,
			};
			let isUserExists = await IndexModel.checkIsUserExist(res.pool, test_credensials);

			if (isUserExists.length == 0) {
				var test_credensials = {
					test_id: req.session.Exam.exam_orignal_id,
					student_id: req.session.StudentInfo.id,
					publish_id: req.session.Exam.published_id,
					test_question_limit: req.session.Exam.exam_total_question,
					publish_link_encode: req.session.Exam.publish_link_encode,
				};
				IndexModel.deleteStudentTesList(res.pool, test_credensials, function (data) {
					IndexModel.addLockUser(res.pool, test_credensials, function (data) {
						IndexModel.markAsPresent(res.pool, test_credensials, function (data) {
							res.redirect('/exam-aggrement');
						});
					});
				});
			} else {
				var test_credensials = {
					test_id: req.session.Exam.exam_orignal_id,
					student_id: req.session.StudentInfo.id,
					publish_id: req.session.Exam.published_id,
					test_question_limit: req.session.Exam.exam_total_question,
					publish_link_encode: req.session.Exam.publish_link_encode,
				};

				switch (isUserExists[0].stl_test_status) {
					case 'undifined':
						IndexModel.deleteStudentTesList(res.pool, test_credensials, function (data) {
							IndexModel.addLockUser(res.pool, test_credensials, function (data) {
								res.redirect('/exam-aggrement');
							});
						});
						break;
					case 1:
						req.session.isNew = false;
						IndexModel.addLockUser(res.pool, test_credensials, function (data) {
							res.redirect('/warm-up');
						});
						break;
					case 2:
						req.session.isNew = true;
						IndexModel.addLockUser(res.pool, test_credensials, function (data) {
							res.redirect('/warm-up');
						});
						break;
					case 0:
						req.session.isNew = true;
						IndexModel.addLockUser(res.pool, test_credensials, function (data) {
							res.redirect('/testisdone');
						});
						break;
					default:
						IndexModel.deleteStudentTesList(res.pool, test_credensials, function (data) {
							IndexModel.addLockUser(res.pool, test_credensials, function (data) {
								res.redirect('/exam-aggrement');
							});
						});
				}
			}
		} catch (err) {
			console.log(err, '-error========');
			if (err._call == 0) {
				req.session.SessionMessage = {
					msg: err._error,
					class: 'alert-warning',
					student_info: student_details,
				};
				res.redirect('/add-student');
			} else {
				req.session.SessionMessage = {
					msg: 'Invalid Information Passed',
					class: 'alert-warning',
					student_info: student_details,
				};
				res.redirect('/add-student');
			}
		}
	},
	// verifyCandidateForExam: function (req, res, next) {
	// 	var student_details = req.body
	// 	if (typeof req.session.Exam == 'undefined') {
	// 		res.redirect('/')
	// 	} else {
	// 		IndexModel.getStudentVerifyForExam(
	// 			res.pool,
	// 			student_details,
	// 			req.session.Exam.batch_no
	// 		)
	// 			.then(function (db_result) {
	// 				return resultStatus.checkResultForNullData(db_result)
	// 			})
	// 			.then(function (result_data) {
	// 				var db_student_info = result_data._data[0]
	// 				req.session.StudentInfo = db_student_info
	// 				var test_credensials = {
	// 					test_id: req.session.Exam.exam_orignal_id,
	// 					student_id: req.session.StudentInfo.id,
	// 					publish_id: req.session.Exam.published_id,
	// 					test_question_limit: req.session.Exam.exam_total_question,
	// 					publish_link_encode: req.session.Exam.publish_link_encode,
	// 				}
	// 				return IndexModel.checkIsUserExist(res.pool, test_credensials)
	// 			})
	// 			.then(function (isUserExists) {
	// 				if (isUserExists.length == 0) {
	// 					var test_credensials = {
	// 						test_id: req.session.Exam.exam_orignal_id,
	// 						student_id: req.session.StudentInfo.id,
	// 						publish_id: req.session.Exam.published_id,
	// 						test_question_limit: req.session.Exam.exam_total_question,
	// 						publish_link_encode: req.session.Exam.publish_link_encode,
	// 					}
	// 					IndexModel.deleteStudentTesList(
	// 						res.pool,
	// 						test_credensials,
	// 						function (data) {
	// 							IndexModel.addLockUser(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									IndexModel.markAsPresent(
	// 										res.pool,
	// 										test_credensials,
	// 										function (data) {
	// 											res.redirect('/exam-aggrement')
	// 										}
	// 									)
	// 								}
	// 							)
	// 						}
	// 					)
	// 				} else {
	// 					var test_credensials = {
	// 						test_id: req.session.Exam.exam_orignal_id,
	// 						student_id: req.session.StudentInfo.id,
	// 						publish_id: req.session.Exam.published_id,
	// 						test_question_limit: req.session.Exam.exam_total_question,
	// 						publish_link_encode: req.session.Exam.publish_link_encode,
	// 					}

	// 					switch (isUserExists[0].stl_test_status) {
	// 						case 'undifined':
	// 							IndexModel.deleteStudentTesList(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									IndexModel.addLockUser(
	// 										res.pool,
	// 										test_credensials,
	// 										function (data) {
	// 											res.redirect('/exam-aggrement')
	// 										}
	// 									)
	// 								}
	// 							)
	// 							break
	// 						case 1:
	// 							req.session.isNew = false
	// 							IndexModel.addLockUser(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									res.redirect('/warm-up')
	// 								}
	// 							)
	// 							break
	// 						case 2:
	// 							req.session.isNew = true
	// 							IndexModel.addLockUser(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									res.redirect('/warm-up')
	// 								}
	// 							)
	// 							break
	// 						case 0:
	// 							req.session.isNew = true
	// 							IndexModel.addLockUser(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									res.redirect('/testisdone')
	// 								}
	// 							)
	// 							break
	// 						default:
	// 							IndexModel.deleteStudentTesList(
	// 								res.pool,
	// 								test_credensials,
	// 								function (data) {
	// 									IndexModel.addLockUser(
	// 										res.pool,
	// 										test_credensials,
	// 										function (data) {
	// 											res.redirect('/exam-aggrement')
	// 										}
	// 									)
	// 								}
	// 							)
	// 					}
	// 				}
	// 			})
	// 			.catch(function (err) {
	// 				if (err._call == 0) {
	// 					req.session.SessionMessage = {
	// 						msg: err._error,
	// 						class: 'alert-warning',
	// 						student_info: student_details,
	// 					}
	// 					res.redirect('/add-student')
	// 				} else {
	// 					req.session.SessionMessage = {
	// 						msg: 'Invalid Information Passed',
	// 						class: 'alert-warning',
	// 						student_info: student_details,
	// 					}
	// 					res.redirect('/add-student')
	// 				}
	// 			})
	// 	}
	// },
	viewExamAggrement: function (req, res, next) {
		if (typeof req.session.StudentInfo == 'undefined' || typeof req.session.Exam == 'undefined') res.redirect('/');
		//res.send(req.session);
		var session_value = typeof req.session.SessionMessage == 'undefined' ? false : req.session.SessionMessage;
		delete req.session.SessionMessage;
		res.render('aggreement-view', {
			title: 'Exam Aggrement View',
			test_info: req.session.Exam,
			stud_info: req.session.StudentInfo,
			isSessionMessage: session_value,
		});
	},
	Confirmtion: function (req, res, next) {
		console.log(req.query, 'params');
		if (typeof req.session.StudentInfo == 'undefined' || typeof req.session.Exam == 'undefined') {
			res.redirect('/');
		}

		var test_credensials = {
			test_id: req.session.Exam.exam_orignal_id,
			student_id: req.session.StudentInfo.id,
			publish_id: req.session.Exam.published_id,
			test_question_limit: req.session.Exam.exam_total_question,
			publish_link_encode: req.session.Exam.publish_link_encode,
			exam_time: req.session.Exam.exam_time,
			mac: req.query.mac,
		};

		IndexModel.ckeckExamActivated(res.pool, test_credensials)
			.then(function (data) {
				if (data.length == 1) {
					IndexModel.checkExamCreatedNot(res.pool, test_credensials)
						.then(function (data) {
							if (data.length == 1) {
								return { data: 1 };
							} else {
								return IndexModel.createStudentQuestionPaper(res.pool, test_credensials, req);
							}
						})
						.then(function (data) {
							req.session.isNew = true;
							res.redirect('/warm-up');
						})
						.catch(function (error_data) {
							req.session.SessionMessage = {
								msg: error_data._error,
								class: 'alert-warning',
							};
							console.log(error_data);
							res.redirect('/exam-aggrement');
						});
				} else {
					req.session.SessionMessage = {
						msg: 'Please Wait... Exam Session Not Yet Started.',
						class: 'alert-danger',
					};
					res.redirect('/exam-aggrement');
				}
			})
			.catch(function (error_data) {
				req.session.SessionMessage = {
					msg: 'Data-1 Not Found',
					class: 'alert-warning',
				};
				console.log(error_data);
				res.redirect('/exam-aggrement');
			});
	},
	viewWarmUp: function (req, res, next) {
		if (typeof req.session.StudentInfo == 'undefined' || typeof req.session.Exam == 'undefined') res.redirect('/');

		var is_new_session_value = typeof req.session.isNew == 'undifined' ? false : req.session.isNew;

		res.render('warm-up-view', {
			title: 'Exam Warm Up',
			is_test_new: is_new_session_value,
		});
	},
	startExamination: function (req, res, next) {
		if (typeof req.session.StudentInfo == 'undefined' || typeof req.session.Exam == 'undefined') res.redirect('/');

		var test_credensials = {
			test_id: req.session.Exam.exam_orignal_id,
			student_id: req.session.StudentInfo.id,
			publish_id: req.session.Exam.published_id,
			test_question_limit: req.session.Exam.exam_total_question,
			publish_link_encode: req.session.Exam.publish_link_encode,
			exam_time: req.session.Exam.exam_time,
		};

		var student_question_paper = [];
		var student_test_time = {
			_min: 0,
			_sec: 0,
		};

		IndexModel.getStudentTestPaper(res.pool, test_credensials)
			.then(function (studentQuestionPaper) {
				return resultStatus.checkResultForNullData(studentQuestionPaper);
			})
			.then(function (isDataFound) {
				student_question_paper = isDataFound._data;
				return IndexModel.getStudentTestTimeDetails(res.pool, test_credensials);
			})
			.then(function (studentTestTimeDetails) {
				return resultStatus.checkResultForNullData(studentTestTimeDetails);
			})
			.then(function (getTimeCheck) {
				student_test_time._min = getTimeCheck._data[0]._min;
				student_test_time._sec = getTimeCheck._data[0]._sec;
				var paper_obj = {
					test_basic_info: [req.session.Exam.exam_info],
					test_session_info: [req.session],
					question_paper: student_question_paper,
					orignal_test_id: req.session.Exam.exam_orignal_id,
					orignal_publish_id: req.session.Exam.published_id,
					orignal_student_id: req.session.StudentInfo.id,
					stud_info: req.session.StudentInfo,
					_min: getTimeCheck._data[0]._min,
					_sec: getTimeCheck._data[0]._sec,
				};
				if (getTimeCheck._data[0].test_status > 0) {
					res.render('examination', paper_obj);
				} else {
					res.redirect('/climax/' + req.session.Exam.published_id + '/' + req.session.StudentInfo.id);
				}
			})
			.catch(function (err) {
				res.send(err);
			});
	},
	viewExamClimax: function (req, res, next) {
		const data = req.params;
		var studentClimaxDetails = {
			student_info: [],
			exam_info: [],
		};

		if (typeof req.session.StudentInfo == 'undefined' || typeof req.session.Exam == 'undefined') res.redirect('/');

		var updateDetails = {
			test_status: 0,
			publish_id: Number(data.publish_id),
			student_id: Number(data.student_id),
		};

		IndexModel.updateStudentExamStatus(res.pool, updateDetails)
			.then(function (isStudentStatus) {
				res.render('climax-view', {
					title: 'Exam Aggrement View',
					test_info: req.session.Exam,
					studentDetails: req.session.StudentInfo,
				});

				req.session.destroy(function (err) {});
			})
			.catch(function (error) {
				res.render('climax-view', {
					title: 'Exam Aggrement View',
					test_info: req.session.Exam,
					studentDetails: req.session.StudentInfo,
				});

				req.session.destroy(function (err) {});
			});
	},
	updateTestDetails: function (req, res, next) {
		let sessionMac = req.session.StudentInfo.mac;
		console.log(sessionMac, 'session mac');
		let reqMac = req.query.mac;
		console.log(reqMac, 'req mac');

		if (sessionMac !== reqMac) {
			res.status(200).send({ call: 3 });
		}

		var details = req.body;
		var updateDetails = {
			test_id: Number(details['test_id']),
			min: Number(details['min']),
			sec: Number(details['sec']),
			test_status: Number(details['test_status']),
			test_id: Number(details['test_id']),
			publish_id: Number(details['publish_id']),
			student_id: Number(details['student_id']),
		};
		details.list = JSON.parse(details.list);
		req.getConnection(function (err, connection) {
			if (err) {
				res.status(400).send({ call: 2 });
			} else {
				IndexModel.updateStudentTestTimerAndStatus(connection, updateDetails)
					.then(function (isStudentStatus) {
						return resultStatus.checkResultUpdated(isStudentStatus, 'Unable to update details.');
					})
					.then(function (isQuestionPaperUpdated) {
						if (details.list.length > 0) {
							return IndexModel.updateTestQuestionDetails(connection, details.list[0]);
						} else {
							return isQuestionPaperUpdated;
						}
					})
					.then(function (updatedData) {
						if (details.list.length > 0) {
							return resultStatus.checkResultUpdated(updatedData, 'Unable to update details.');
						} else {
							return updatedData;
						}
					})
					.then(function (final_result) {
						res.status(200).send({ call: 1 });
					})
					.catch(function (err) {
						if (err._call == 0) {
							res.status(200).send({ call: 2 });
						}
						if (err._call == 3) {
							res.status(404).send({ call: 2 });
						}
					});
			}
		});
	},
	viewErrorPage: function (req, res, next) {
		// res.render('error_page',{
		//     message: "This Is Error Message",
		//     head: "Error",
		//     isError: 1
		// })
		res.render('error_page', {
			head: 'Your Login Information',
			data: { name: 'Deepak', password: 8007070845 },
			isError: 0,
		});
	},
};

module.exports = indexController;
