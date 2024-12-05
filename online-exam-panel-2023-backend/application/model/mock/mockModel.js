const dummyData = require('./dummyData')

const mockModel = {
	publishMockTest: (pool, testData) => {
		let d = dummyData.testDetails(testData)
		return new Promise((resolve, reject) => {
			let query = `INSERT INTO 
					tm_publish_test_list
						(
							ptl_active_date,
							ptl_time,
							ptl_link,
							ptl_link_1,
							ptl_test_id,
							ptl_master_exam_id,
							ptl_master_exam_name,
							ptl_added_date,
							ptl_added_time,
							ptl_time_tramp,
							ptl_test_description,
							ptl_is_live,
							ptl_aouth_id,
							ptl_is_test_done,
							ptl_test_info,
							mt_name,
							mt_added_date,
							mt_descp,
							mt_is_live,
							mt_time_stamp,
							mt_type,
							tm_aouth_id,
							mt_test_time,
							mt_total_test_takan,
							mt_is_negative,
							mt_negativ_mark,
							mt_mark_per_question,
							mt_passing_out_of,
							mt_total_marks,
							mt_pattern_type,
							mt_total_test_question,
							mt_added_time,
							mt_pattern_name,
							is_test_generated,
							ptl_test_mode,
							tm_allow_to,
							is_test_loaded,
							is_student_added,
							is_uploaded,
							is_start_exam,
							is_absent_mark,
							is_exam_downloaded,
							is_photos_downloaded,
							is_sign_downloaded,
							is_final_published,
							is_students_downloaded,
							exam_mode,
							is_attendance_started
						)
					VALUES (?)`
			pool.query(
				query,
				[
					[
						d.ptl_active_date,
						d.ptl_time,
						d.ptl_link,
						d.ptl_link_1,
						d.ptl_test_id,
						d.ptl_master_exam_id,
						d.ptl_master_exam_name,
						d.ptl_added_date,
						d.ptl_added_time,
						d.ptl_time_tramp,
						d.ptl_test_description,
						d.ptl_is_live,
						d.ptl_aouth_id,
						d.ptl_is_test_done,
						JSON.stringify(d.ptl_test_info),
						d.mt_name,
						d.mt_added_date,
						d.mt_descp,
						d.mt_is_live,
						d.mt_time_stamp,
						d.mt_type,
						d.tm_aouth_id,
						d.mt_test_time,
						d.mt_total_test_takan,
						d.mt_is_negative,
						d.mt_negativ_mark,
						d.mt_mark_per_question,
						d.mt_passing_out_of,
						d.mt_total_marks,
						d.mt_pattern_type,
						d.mt_total_test_question,
						d.mt_added_time,
						d.mt_pattern_name,
						d.is_test_generated,
						d.ptl_test_mode,
						d.tm_allow_to,
						d.is_test_loaded,
						d.is_student_added,
						d.is_uploaded,
						d.is_start_exam,
						d.is_absent_mark,
						d.is_exam_downloaded,
						d.is_photos_downloaded,
						d.is_sign_downloaded,
						d.is_final_published,
						d.is_students_downloaded,
						1, // exam mode set to 1
						0, // is_attendance_started set to zero initially
					],
				],
				function (err, result) {
					err ? reject(err) : resolve(result)
				}
			)
		})
	},

	generateMockStudents: async (pool, testData) => {
		return new Promise((resolve, reject) => {
			let query = `INSERT INTO 
							tn_student_list	
								(
								id,
								sl_f_name,
								sl_m_name,
								sl_l_name,
								sl_image,
								sl_sign,
								sl_email,
								sl_father_name,
								sl_mother_name,
								sl_address,
								sl_mobile_number_parents,
								sl_tenth_marks,
								sl_contact_number,
								sl_class,
								sl_roll_number,
								sl_subject,
								sl_stream,
								sl_addmit_type,
								sl_time,
								sl_date,
								sl_time_stamp,
								sl_added_by_login_id,
								sl_is_live,
								sl_date_of_birth,
								sl_school_name,
								sl_catagory,
								sl_application_number,
								sl_is_physical_handicap,
								sl_is_physical_handicap_desc,
								sl_post,
								sl_center_code,
								sl_batch_no,
								sl_exam_date,
								sl_password,
								sl_present_status
								)
						VALUES ?`
			let _data = dummyData.studentDummyData(testData)
			console.log(_data)

			pool.query(query, [_data], function (err, result) {
				err ? reject(err) : resolve(result)
			})
		})
	},

	generateMockQuestions: async (pool, testData) => {
		return new Promise((resolve, reject) => {
			let query = `INSERT INTO tm_test_question_sets 
								(
									q_id,
									tqs_test_id,
									section_id,
									section_name,
									sub_topic_id,
									sub_topic_section,
									main_topic_id,
									main_topic_name,
									q,
									q_a,
									q_b,
									q_c,
									q_d,
									q_e,
									q_display_type,
									q_ask_in,
									q_data_type,
									q_mat_data,
									q_col_a,
									q_col_b,
									q_mat_id,
									q_i_a,
									q_i_b,
									q_i_c,
									q_i_d,
									q_i_e,
									q_i_q,
									q_i_sol,
									stl_topic_number,
									sl_section_no,
									q_sol,
									q_ans,
									q_mat_ans,
									q_mat_ans_row,
									q_col_display_type,
									question_no,
									mark_per_question
								)
							VALUES ?`
			let _data = dummyData.getDummyQuestion(testData)
			console.log(_data, 'dummy data ======')
			pool.query(query, [_data], function (err, result) {
				err ? reject(err) : resolve(result)
			})
		})
	},

	mockExamsList: (pool) => {
		return new Promise((resolve, reject) => {
			let query = `SELECT * FROM tm_publish_test_list WHERE exam_mode = 1`
			pool.query(query, function (err, result) {
				err ? reject(err) : resolve(result)
			})
		})
	},
}

module.exports = mockModel
