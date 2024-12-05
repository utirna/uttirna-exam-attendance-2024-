const getRandomNum = require('../../utiils/getRandomNum')

const dummyData = {
	testDetails: (_testData) => {
		let date = _testData.exam_date
		let time = _testData.exam_time
		let dateTime = _testData.exam_date_time

		return {
			ptl_active_date: date,
			ptl_time: 0,
			ptl_link: Math.floor(Math.random() * 3000) + 1000,
			ptl_link_1: Math.floor(Math.random() * 3000) + 1000,
			ptl_test_id: 2,
			ptl_master_exam_id: 0,
			ptl_master_exam_name: '-',
			ptl_added_date: date,
			ptl_added_time: time,
			ptl_time_tramp: dateTime,
			ptl_test_description: '-',
			ptl_is_live: 1,
			ptl_aouth_id: 1,
			ptl_is_test_done: 0,
			ptl_test_info: [
				{
					test_id: '2',
					test_name: 'Mock-' + (Math.floor(Math.random() * 300) + 100),
					test_created_on: dateTime,
					test_descp: 'Test',
					test_type: 'On paper',
					test_duration: `${_testData.test_duration} Min`,
					test_negative: 'No',
					test_mark_per_q: '1',
					passing_out_of: '10',
					test_total_marks: '13',
					test_pattern: 'SDE',
					test_total_question: `${_testData.total_questions}`,
					id: '2',
					mt_name: 'Mock Test 111',
					mt_added_date: '2024-04-16',
					mt_descp: 'Test',
					mt_added_time: '12:29:26',
					mt_is_live: '1',
					mt_time_stamp: '2024-04-16 12:29:26',
					mt_type: '2',
					tm_aouth_id: '1',
					mt_test_time: '90',
					mt_total_test_takan: '0',
					mt_is_negative: '0',
					mt_negativ_mark: '',
					mt_mark_per_question: '1',
					mt_passing_out_of: '20',
					mt_total_marks: `${_testData.total_marks}`,
					mt_pattern_type: '2',
					mt_total_test_question: `${_testData.total_questions}`,
				},
			],
			mt_name: 'Mock-' + (Math.floor(Math.random() * 300) + 100),
			mt_added_date: date,
			mt_descp: 'test',
			mt_is_live: 1,
			mt_time_stamp: dateTime,
			mt_type: 2,
			tm_aouth_id: 1,
			mt_test_time: `${_testData.test_duration}`,
			mt_total_test_takan: 0,
			mt_is_negative: 0,
			mt_negativ_mark: 0,
			mt_mark_per_question: 1,
			mt_passing_out_of: 20,
			mt_total_marks: `${_testData.total_marks}`,
			mt_pattern_type: 2,
			mt_total_test_question: `${_testData.total_questions}`,
			mt_added_time: date,
			mt_pattern_name: '-',
			is_test_generated: 0,
			ptl_test_mode: 1,
			tm_allow_to: _testData.batch_no,
			is_test_loaded: 1,
			is_student_added: 1,
			is_uploaded: 1,
			is_start_exam: 0,
			is_absent_mark: 0,
			is_exam_downloaded: 1,
			is_photos_downloaded: 1,
			is_sign_downloaded: 1,
			is_final_published: 1,
			is_students_downloaded: 1,
		}
	},

	studentDummyData: (_testData) => {
		let insertArray = []
		// prettier-ignore
		for (let i = 0; i < _testData.total_candidates; ++i) {
			let roll_n_id = _testData.batch_no + '' + i      // roll no and Id
			insertArray.push([
				roll_n_id, 								// id
				`DEMO ${i + 1}`,  						// sl_f_name
				'DEMO', 								// sl_m_name
				'DEMO', 								// sl_l_name
				'pics/photo_demo.jpg', 					// sl_image
				'pics/sign_demo.jpg', 					// sl_sign
				'demo@demo.demo', 						// sl_email
				'DEMO',   								// sl_father_name
				'DEMO',   								// sl_mother_name
				'DEMO Address',  						// sl_address
				'0000000000',   						// sl_mobile_number_parents
				81,   								    // sl_tenth_marks
				'9999999999',   						// sl_contact_number
				'-',   									// sl_class
				roll_n_id,   							// sl_roll_no
				'-',   									// sl_subject
				'-',   									// sl_stream
				'-',   									// sl_addmit_type
				_testData.exam_time, 					// sl_time
				_testData.exam_date, 					// sl_date,
				_testData.exam_date_time,  				// sl_time_stamp,
				1,  	 								// sl_added_by_login_id,
				1,  	 								// sl_is_live,
				'0000-00-00', 							// sl_date_of_birth,
				'DEMO SCHOOL',   						//sl_school_name,
				'DEMO CATEGORY', 						// sl_catagory,
				100000,   								// sl_application_number,
				0,   									// sl_is_physical_handicap,
				0,   									//sl_is_physical_handicap_desc,
				'DUMMY POST',							// sl_post,
				_testData.cc, 							// sl_center_code
				_testData.batch_no,   				    //sl_batch_no,
				_testData.exam_date,   				    //sl_exam_date
				1111,   								// sl_password,
				1,   								 	//sl_present_status,
			])
		}
		return insertArray
	},

	// prettier-ignore
	getDummyQuestion: (_testData) => {
		let insertArray = []
		for (let i = 0; i < _testData.total_questions; ++i) {
			insertArray.push([
				getRandomNum(50, 10),                            // q_id
				2,												 //tqs_test_id:
				0,												 //section_id:
				'-',											 //section_name:
				getRandomNum(20, 10),							 //sub_topic_id:
				'Sub Topic' + '-' + getRandomNum(10, 1),		 //sub_topic_section:
				3,												 //main_topic_id:
				'Main topic',									 //main_topic_name:
				'What is Your name?',							 //q:
				'a',										     //q_a:
				'b',										     //q_b:
				'c',										     //q_c:
				'd',										     //q_d:
				'e',										     //q_e:
				1,												 //q_display_type:
				'-',										     //q_ask_in:
				'-',										     //q_data_type:
				'-',										     //q_mat_data:
				'-',										     //q_col_a:
				'-',										     //q_col_b:
				0,												 //q_mat_id:
				0,												 //q_i_a:
				0,												 //q_i_b:
				0,												 //q_i_c:
				0,												 //q_i_d:
				0,												 //q_i_e:
				0,												 //q_i_q:
				0,												 //q_i_sol:
				0,												 //stl_topic_number:
				0,												 //sl_section_no:
				'<p>Name</p>',									 //q_sol:
				'c',											 //q_ans:
				'-',											 //q_mat_ans:
				'-',											 //q_mat_ans_row:
				1,												 //q_col_display_type:
				'-',											 //question_no:
				1,												 //mark_per_question:
			])
		}
		return insertArray
	},
}

// prettier-ignore
// var question = [
// 	getRandomNum(50, 10),                            // q_id
// 	2,												 //tqs_test_id:
// 	0,												 //section_id:
// 	'-',											 //section_name:
// 	getRandomNum(20, 10),							 //sub_topic_id:
// 	'Sub Topic' + '-' + getRandomNum(10, 1),		 //sub_topic_section:
// 	3,												 //main_topic_id:
// 	'Main topic',									 //main_topic_name:
// 	'What is Your name?',							 //q:
// 	'a',										     //q_a:
// 	'b',										     //q_b:
// 	'c',										     //q_c:
// 	'd',										     //q_d:
// 	'e',										     //q_e:
// 	1,												 //q_display_type:
// 	'-',										     //q_ask_in:
// 	'-',										     //q_data_type:
// 	'-',										     //q_mat_data:
// 	'-',										     //q_col_a:
// 	'-',										     //q_col_b:
// 	0,												 //q_mat_id:
// 	0,												 //q_i_a:
// 	0,												 //q_i_b:
// 	0,												 //q_i_c:
// 	0,												 //q_i_d:
// 	0,												 //q_i_e:
// 	0,												 //q_i_q:
// 	0,												 //q_i_sol:
// 	0,												 //stl_topic_number:
// 	0,												 //sl_section_no:
// 	'<p>Name</p>',									 //q_sol:
// 	'c',											 //q_ans:
// 	'-',											 //q_mat_ans:
// 	'-',											 //q_mat_ans_row:
// 	1,												 //q_col_display_type:
// 	'-',											 //question_no:
// 	1,												 //mark_per_question:
// ]

module.exports = dummyData
