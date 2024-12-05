const attendenceModel = {
	getStudentDetails: (pool, id) => {
		return new Promise((resolve, reject) => {
			const q = `SELECT
                        id,
                        CONCAT(sl_f_name, ' ', sl_m_name, ' ', sl_l_name) as full_name,
                        sl_application_number,
                        sl_date_of_birth,
                        sl_post,
                        sl_batch_no,
                        DATE_FORMAT(sl_date_of_birth, '%d %M %Y') AS dob,
                        DATE_FORMAT(sl_exam_date, '%d %M %Y') AS exam_date,
                        sl_present_status,
                        sl_image,
                        sl_sign,
						sl_cam_image
                    FROM
                        tn_student_list
                    WHERE
                        id = ${id}`;

			pool.query(q, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
	getStudentPcDetails: (pool, roll_no) => {
		return new Promise((resolve, reject) => {
			let q = `SELECT * FROM temp_stud_mac_id_list as tsl
						INNER JOIN node_details as nd	
						ON nd.mac_id =tsl.mac_id
						WHERE stud_roll_no = ?;`;
			pool.query(q, roll_no, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},

	markAttendencePresent: (pool, data) => {
		return new Promise((resolve, reject) => {
			const q = `UPDATE tn_student_list
                        SET
                            sl_cam_image = ?,
                            sl_present_status = 1
                        WHERE
                            id = ?`;

			pool.query(q, [data.image_name, +data.id], function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},

	getStudentRowNumber: (pool, data) => {
		return new Promise((resolve, reject) => {
			const q = `
					SELECT 
						*
					FROM 
						utr_node_exam.tn_student_list;`;

			pool.query(q, [+data.id], (err, result) => {
				if (err) {
					return reject(err);
				}
				let _index = 0;
				result.forEach((el, idx) => {
					if (el.id == data.id) {
						_index = idx + 1;
					}
				});
				resolve(_index);
			});
		});
	},

	getPcDetails: (pool, id) => {
		return new Promise((resolve, reject) => {
			const q = `SELECT * FROM node_details WHERE id = ? LIMIT 1;`;

			pool.query(q, id, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
	allotPcToStudent: (pool, { _pcDetails, data }) => {
		return new Promise((resolve, reject) => {
			const checkIfMacAllotedQuery = `SELECT * FROM temp_stud_mac_id_list WHERE mac_id = ?`;
			const allotPcQuery = `INSERT INTO temp_stud_mac_id_list (stud_roll_no, mac_id) VALUES (?, ?);`;

			pool.query(checkIfMacAllotedQuery, _pcDetails.mac_id, function (err, result) {
				if (err) {
					reject(err);
				}
				console.log(result, '--');
				if (result.length >= 1) {
					resolve([
						{
							call: -1,
							message: 'Pc already alloted',
						},
					]);
					return;
				}

				pool.query(allotPcQuery, [data.id, _pcDetails.mac_id], function (err, result) {
					err ? reject(err) : resolve(result);
				});
			});
		});
	},

	studentAttendanceCount: (pool) => {
		return new Promise((resolve, reject) => {
			const q = `SELECT 	 
                            COUNT(IF(sl_present_status = 1, 0, NULL)) AS present_count,
                            COUNT(IF(sl_present_status = 2, 0, NULL)) AS attendance_not_marked,
							COUNT(id) AS total_students
                        FROM utr_node_exam.tn_student_list`;
			pool.query(q, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
};

module.exports = attendenceModel;
