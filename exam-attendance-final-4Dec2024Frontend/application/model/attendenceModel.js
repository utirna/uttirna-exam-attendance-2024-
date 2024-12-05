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
                        sl_present_status

                    FROM
                        tn_student_list
                    WHERE
                        id = ${id}`;

			pool.query(q, function (err, result) {
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
};

module.exports = attendenceModel;
