var responderSet = require('../config/_responderSet');
var resultStatus = responderSet.checkResult;

module.exports = {
	checkExamMode: function (pool) {
		return new Promise((resolve, reject) => {
			let query = `SELECT is_mock_mode FROM aouth LIMIT 1`;
			pool.query(query, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
	updateStudentDetails: function (pool, id, mobile_no) {
		return new Promise(function (resolve, reject) {
			//let arrayData = [sd.fStudentName, sd.mStudentName, sd.lStudentName, sd.mobileNumber, sd.mobileNumber];
			var query = 'UPDATE tn_student_list SET ' + ' sl_roll_number = ? ' + ' WHERE ' + ' id = ? AND sl_contact_number  = ?';
			var array = [id, id, mobile_no];
			pool.query(query, array, function (err, result_data) {
				if (err) {
					reject('Fail To Update Try Again<br>Error:' + error.sqlMessage);
				} else {
					if (result_data.affectedRows) {
						resolve({ name: id, password: mobile_no });
					} else {
						reject('Fail To Update Try Again');
					}
					//resolve(result_data);
				}
			});
		});
	},
	checkIfPcIsAlloted: (pool, mac_id) => {
		console.log(mac_id)
		return new Promise((resolve, reject) => {
			const q = `SELECT * FROM temp_stud_mac_id_list tsl
						INNER JOIN node_details nd
						ON nd.mac_id = tsl.mac_id
						INNER JOIN tn_student_list sl
						ON sl.id = tsl.stud_roll_no
					WHERE tsl.mac_id = ?;`;
			pool.query(q, mac_id, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
	addNewStudent(pool, sd) {
		return new Promise(function (resolve, reject) {
			let arrayData = [sd.fStudentName, sd.mStudentName, sd.lStudentName, sd.mobileNumber, sd.mobileNumber];
			var query =
				'INSERT INTO ' + ' tn_student_list ' + '( sl_f_name, sl_m_name, sl_l_name, sl_mobile_number_parents, sl_contact_number ) ' + ' VALUES (?)';
			pool.query(query, [arrayData], function (err, result_data) {
				if (err) {
					reject('Fail To Update Try Again<br>Error:' + err.sqlMessage);
				} else {
					resolve(result_data);
				}
			});
		});
	},
	getStudentTestPaper: function (pool, exam_details) {
		// not in use
		return new Promise(function (resolve, reject) {
			var query =
				'SELECT' +
				' student_paper.id as update_id, ' +
				' IFNULL(0, 0) as section_id, ' +
				" IFNULL('-', '-') as section_name, " +
				' question_set.sub_topic_id as sub_topic_id, ' +
				' question_set.sub_topic_section as sub_topic_section, ' +
				' question_set.main_topic_id as main_topic_id, ' +
				' question_set.main_topic_name as main_topic_name, ' +
				' question_set.q_id as q_id, ' +
				' question_set.q as q, ' +
				' question_set.q_a as q_a, ' +
				' question_set.q_b as q_b, ' +
				' question_set.q_c as q_c, ' +
				' question_set.q_d as q_d, ' +
				' question_set.q_e as q_e, ' +
				' question_set.q_display_type as q_display_type, ' +
				" IFNULL(question_set.q_ask_in, '') as q_ask_in, " +
				' question_set.q_data_type as q_data_type, ' +
				' question_set.q_mat_data as q_mat_data,' +
				' question_set.q_col_a as q_col_a,' +
				' question_set.q_col_b as q_col_b,' +
				' question_set.q_mat_id as q_mat_id,' +
				" IFNULL(student_paper.sqp_ans, '') as student_ans," +
				' IFNULL(student_paper.sqp_is_remark, 0) as mark_review,' +
				' IFNULL(student_paper.sqp_sec, 0) as q_time,' +
				' IFNULL(question_set.q_i_a, 0) as q_i_a,' +
				' IFNULL(question_set.q_i_b, 0) as q_i_b,' +
				' IFNULL(question_set.q_i_c, 0) as q_i_c,' +
				' IFNULL(question_set.q_i_d, 0) as q_i_d,' +
				' IFNULL(question_set.q_i_e, 0) as q_i_e,' +
				' IFNULL(question_set.q_i_q, 0) as q_i_q' +
				' FROM ' +
				' tm_test_question_sets as question_set INNER JOIN ' +
				' tm_student_question_paper as student_paper ON ' +
				' question_set.q_id = student_paper.sqp_question_id ' +
				' WHERE ' +
				' question_set.tqs_test_id = ? AND ' +
				' student_paper.sqp_publish_id = ? AND ' +
				' student_paper.sqp_student_id = ? ' +
				' GROUP BY student_paper.id ORDER BY student_paper.id ASC ';
			pool.query(query, [exam_details.test_id, exam_details.publish_id, exam_details.student_id], function (err, result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(result);
				}
			});
		});
	},
	getStudentTestTimeDetails: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var query =
				' SELECT ' +
				' sud_test_info.stm_min as _min, ' +
				' sud_test_info.stm_sec as _sec, ' +
				' sud_test_info.stl_test_status as test_status ' +
				' FROM ' +
				' tm_student_test_list as sud_test_info ' +
				' WHERE ' +
				' sud_test_info.stl_test_id = ? AND ' +
				' sud_test_info.stl_publish_id = ? AND ' +
				' sud_test_info.stl_stud_id = ? ' +
				' LIMIT 1 ';
			pool.query(query, [exam_details.test_id, exam_details.publish_id, exam_details.student_id], function (err, testTimeDetals) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(testTimeDetals);
				}
			});
		});
	},
	verifyLink: function (pool, link) {
		return new Promise(function (resolve, reject) {
			pool.query(
				'SELECT * FROM tm_publish_test_list WHERE is_test_generated = 0 AND is_test_loaded = 1 AND ptl_link_1 = ?',
				[link],
				function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				}
			);
		});
	},
	getStudentVerifyForExam: function (pool, student_details, batch_no) {
		console.log(student_details, batch_no, '==student_details, batch_no==');
		return new Promise(function (resolve, reject) {
			var query =
				'SELECT ' +
				' student.id as id, ' +
				' sl_f_name as sl_f_name,' +
				' sl_m_name as sl_m_name,' +
				' sl_l_name as sl_l_name,' +
				' sl_image as sl_image,' +
				' sl_sign as sl_sign,' +
				' sl_email as sl_email,' +
				' sl_father_name	as sl_father_name,' +
				' sl_mother_name as sl_mother_name,' +
				' sl_address as sl_address,' +
				' sl_mobile_number_parents as sl_mobile_number_parents,' +
				' sl_tenth_marks as sl_tenth_marks,' +
				' sl_contact_number as sl_contact_number,' +
				' sl_class as sl_class,' +
				' sl_roll_number as sl_roll_number,' +
				' sl_subject as sl_subject,' +
				' sl_stream as sl_stream,' +
				' sl_addmit_type as sl_addmit_type,' +
				' sl_time as sl_time,' +
				' sl_date as sl_date,' +
				' sl_time_stamp as sl_time_stamp,' +
				' sl_is_live as sl_is_live,' +
				' sl_date_of_birth as sl_date_of_birth,' +
				' sl_school_name as sl_school_name,' +
				' sl_catagory as sl_catagory,' +
				' sl_application_number as sl_application_number,' +
				' sl_is_physical_handicap as sl_is_physical_handicap,' +
				' sl_is_physical_handicap_desc as sl_is_physical_handicap_desc,' +
				' sl_post as sl_post,' +
				' sl_center_code as sl_center_code,' +
				' sl_batch_no as sl_batch_no,' +
				' sl_exam_date as sl_exam_date,' +
				' student.sl_password as	sl_password,' +
				' IFNULL(stud_attendance.id,0) as stud_attendace FROM ' +
				' tn_student_list as student LEFT JOIN ' +
				' utr_student_attendance as stud_attendance ON' +
				' student.id = stud_attendance.student_id' +
				' WHERE sl_batch_no = ? AND sl_roll_number = ? AND sl_password = ? AND sl_present_status > 0';
			var query_data = [batch_no, +student_details.r_no, student_details.m_no];
			pool.query(query, query_data, function (err, result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					if (result.length > 0) {
						if (result[0].stud_attendace != 0) {
							(responderSet.sendData._call = 0),
								(responderSet.sendData._error = 'You are Locked. Contact To Admin'),
								(responderSet.sendData._sys_erorr = err),
								reject(responderSet.sendData);
						} else {
							resolve(result);
						}
					} else {
						resolve(result);
					}
					//  resolve(result)
				}
			});
		});
	},

	getStudentMacId: function (pool, studentId) {
		return new Promise((resolve, reject) => {
			let query = `SELECT mac_id FROM tm_student_test_list WHERE stl_stud_id = ?`;
			pool.query(query, studentId, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},

	addLockUser: function (pool, exam_details, callback) {
		//console.log(exam_details);
		var query = 'INSERT INTO utr_student_attendance (student_id) VALUES (?)';
		pool.query(query, [exam_details.student_id], function (err, result_data) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(result_data);
			}
		});
	},
	ckeckExamActivated: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var query = 'SELECT id FROM  tm_publish_test_list  WHERE is_start_exam = 1 AND id = ?';
			var query_data = [exam_details.publish_id];
			pool.query(query, query_data, function (err, result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(result);
				}
			});
		});
	},
	checkExamCreatedNot: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var query = 'SELECT id FROM tm_student_test_list WHERE stl_publish_id = ? AND stl_stud_id = ?  LIMIT 1';
			var query_data = [exam_details.publish_id, exam_details.student_id];
			pool.query(query, query_data, function (err, result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(result);
				}
			});
		});
	},
	markAsPresent: function (pool, exam_details, callback) {
		var query = 'UPDATE tn_student_list SET ' + ' sl_present_status = 1 ' + ' WHERE ' + ' id = ?';
		var qData = [exam_details.student_id];
		pool.query(query, qData, function (err, update_result) {
			if (err) {
				callback(err);
			} else {
				callback(err);
			}
		});
	},
	createStudentQuestionPaper: function (pool, exam_details, req) {
		var _this = this;
		return new Promise(function (resolve, reject) {
			_this
				._getTestDataSet(pool, exam_details)
				.then(function (questionSetArray) {
					return resultStatus.checkResultForNullData(questionSetArray);
				})
				.then(function (checkQuestionSetArray) {
					return _this._insertStudentTestPaper(pool, checkQuestionSetArray._data);
				})
				.then(function (isTestAdded) {
					return resultStatus.checkResultInserted(isTestAdded, 'Agreement Faild Type 1,Try Again');
				})
				.then(function (checkIsTestAdded) {
					return _this._insertStudentToPaper(pool, exam_details);
				})
				.then(function (isStudentAddedToTest) {
					if (isStudentAddedToTest.affectedRows === 1) {
						req.session.StudentInfo.mac = exam_details.mac;
					}
					return resultStatus.checkResultInserted(isStudentAddedToTest, 'Agreement Faild Type 2,Try Again');
				})
				.then(function (checkIsStudentAddedToTest) {
					resolve(checkIsStudentAddedToTest);
				})
				.catch(function (error_data) {
					reject(error_data);
				});
		});
	},
	_getTestDataSet: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var query =
				'SELECT question_set.q_id, ' +
				' IFNULL(' +
				exam_details.student_id +
				',' +
				exam_details.student_id +
				') as sqp_student_id,' +
				' IFNULL(' +
				exam_details.publish_id +
				',' +
				exam_details.publish_id +
				') as sqp_publish_id,' +
				' IFNULL(' +
				exam_details.test_id +
				',' +
				exam_details.test_id +
				') as test_id' +
				' FROM tm_test_question_sets as question_set WHERE tqs_test_id = ?  LIMIT ?';
			var query_data = [exam_details.test_id, exam_details.test_question_limit];
			pool.query(query, query_data, function (err, result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						(responderSet.sendData._sys_student = exam_details.student_id),
						reject(responderSet.sendData);
				} else {
					for (let i = result.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[result[i], result[j]] = [result[j], result[i]];
					}

					resolve(result);
				}
			});
		});
	},
	_insertStudentTestPaper: function (pool, db_data) {
		return new Promise(function (resolve, reject) {
			if (db_data.length > 0) {
				var insert_array = [];
				var query = 'INSERT INTO tm_student_question_paper (sqp_question_id, sqp_student_id, sqp_publish_id, sqp_test_id) VALUES ?';
				db_data.forEach(function (value, index, main_array) {
					insert_array.push([value.q_id, value.sqp_student_id, value.sqp_publish_id, value.test_id]);
				});
				pool.query(query, [insert_array], function (err, result) {
					if (err) {
						(responderSet.sendData._call = 0),
							(responderSet.sendData._error = 'Op Error, Contact To Admin'),
							(responderSet.sendData._sys_erorr = err),
							reject(responderSet.sendData);
					} else {
						resolve(result);
					}
				});
			} else {
				reject('No Data Found');
			}
		});
	},
	_insertStudentToPaper: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var today = new Date();
			var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
			var date1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			var date = date1 + ' ' + time;
			var query =
				'INSERT INTO tm_student_test_list ' +
				' (stl_test_id, stl_stud_id, stl_publish_id, stm_min, stm_sec,stl_time_stamp,stl_date,stl_time, mac_id) ' +
				' VALUES ? ';
			pool.query(
				query,
				[[[exam_details.test_id, exam_details.student_id, exam_details.publish_id, exam_details.exam_time, 0, date, date1, time, exam_details.mac]]],
				function (err, db_result) {
					if (err)
						(responderSet.sendData._call = 0),
							(responderSet.sendData._error = 'Op Error, Contact To Admin'),
							(responderSet.sendData._sys_erorr = err),
							reject(responderSet.sendData);
					else {
						resolve(db_result);
					}
				}
			);
		});
	},
	checkIsUserExist: function (pool, exam_details) {
		return new Promise(function (resolve, reject) {
			var query =
				' SELECT stl_test_status, mac_id FROM tm_student_test_list  ' + ' WHERE  stl_test_id = ? AND stl_stud_id = ? AND ' + ' stl_publish_id = ? ';
			pool.query(query, [exam_details.test_id, exam_details.student_id, exam_details.publish_id], function (err, result_data) {
				if (err) {
					reject(err);
				} else {
					resolve(result_data);
				}
			});
		});
	},
	deleteStudentTesList: function (pool, exam_details, callback) {
		var query = 'DELETE FROM tm_student_question_paper ' + ' WHERE sqp_test_id = ? AND sqp_student_id = ? AND ' + ' sqp_publish_id = ?';
		pool.query(query, [exam_details.test_id, exam_details.student_id, exam_details.publish_id], function (err, result_data) {
			if (err) {
				callback(err);
			} else {
				callback(result_data);
			}
		});
	},
	updateTestQuestionDetails: function (pool, qD) {
		return new Promise(function (resolve, reject) {
			if (typeof qD == 'undefined') {
				reject({ _call: 3 });
			} else {
				var query =
					'UPDATE tm_student_question_paper SET ' +
					' sqp_sec = ? , sqp_ans = ?  , sqp_is_remark = ? ' +
					'  WHERE ' +
					' id = ? AND sqp_question_id = ?';
				var qData = [0, qD.user_ans, qD.mark_review, qD.p_parent_id, qD.q_id];
				pool.query(query, qData, function (err, update_result) {
					if (err) {
						(responderSet.sendData._call = 0),
							(responderSet.sendData._error = 'Op Error, Contact To Admin'),
							(responderSet.sendData._sys_erorr = err),
							reject(responderSet.sendData);
					} else {
						resolve(update_result);
					}
				});
			}
		});
	},
	updateStudentTestTimerAndStatus: function (pool, tD) {
		return new Promise(function (resolve, reject) {
			var query =
				'UPDATE tm_student_test_list SET ' +
				' stm_min = ? , stm_sec = ? , stl_test_status = ? ' +
				'  WHERE ' +
				' stl_test_id = ? AND stl_stud_id = ? AND stl_publish_id = ?';
			var tData = [tD.min, tD.sec, tD.test_status, tD.test_id, tD.student_id, tD.publish_id];
			pool.query(query, tData, function (err, update_result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(update_result);
				}
			});
		});
	},
	updateStudentExamStatus: function (pool, tD) {
		return new Promise(function (resolve, reject) {
			var query = 'UPDATE tm_student_test_list SET ' + ' stl_test_status = ?  WHERE  stl_stud_id = ? AND stl_publish_id = ?';

			var tData = [tD.test_status, tD.student_id, tD.publish_id];
			pool.query(query, tData, function (err, update_result) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(update_result);
				}
			});
		});
	},
	getUserClimaxSelfDetailsRequest: function (pool, data) {
		return new Promise(function (resolve, reject) {
			var query =
				'SELECT sl_f_name as f_name,' +
				' sl_m_name as m_name, ' +
				' sl_l_name as l_name, ' +
				' sl_image as s_image, ' +
				' sl_sign as s_sign, ' +
				" DATE_FORMAT(sl_date_of_birth,'%d/%m/%Y') as s_dob, " +
				' sl_roll_number as s_id ' +
				' FROM tn_student_list WHERE id = ?';
			var tData = [data.student_id];
			pool.query(query, tData, function (err, result_data) {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(result_data);
				}
			});
		});
	},
	getUserClimaxExamDetailsRequest: function (pool, data) {
		return new Promise((resolve, reject) => {
			var query =
				'SELECT main_topic_name as subject_name,' +
				" SUM(IF(IFNULL(sqp_ans, '') = '', 1, 0)) as unattempted, " +
				" SUM(IF(IFNULL(sqp_ans, '') = '', 0, 1)) as attempted, " +
				" SUM(IF(IFNULL(sqp_ans, '') = '', 0, IF(sqp_is_remark = 1, 1, 0))) as ans_and_mark, " +
				" SUM(IF(IFNULL(sqp_ans, '') = '', IF(sqp_is_remark = 1, 1, 0), 0)) as mark " +
				' FROM tm_student_question_paper as student_paper INNER JOIN ' +
				' tm_test_question_sets as test_paper ' +
				' WHERE sqp_publish_id = ? AND  sqp_student_id = ? AND ' +
				' test_paper.tqs_test_id = student_paper.sqp_test_id AND ' +
				' test_paper.q_id = student_paper.sqp_question_id ' +
				' GROUP BY main_topic_id  ';
			var tData = [data.publish_id, data.student_id];
			pool.query(query, tData, (err, result_data) => {
				if (err) {
					(responderSet.sendData._call = 0),
						(responderSet.sendData._error = 'Op Error, Contact To Admin'),
						(responderSet.sendData._sys_erorr = err),
						reject(responderSet.sendData);
				} else {
					resolve(result_data);
				}
			});
		});
	},
};
