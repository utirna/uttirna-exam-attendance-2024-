const staffModel = {
	getStaffDetailsList: (pool, id) => {
		return new Promise((resolve, reject) => {
			const q = `SELECT
							*
						FROM
							staff_details;`;
			pool.query(q, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},

	saveStaffDetails: (pool, data) => {
		return new Promise((resolve, reject) => {
			const q = `INSERT INTO staff_details
						(staff_name,
						staff_contact_number,
						staff_alloted_lab,
						staff_email,
						staff_aadhar_number,
						staff_designation,
						staff_photo)
					VALUES (?,?,?,?,?,?,?);`;

			const insertData = [
				data.staff_name,
				data.staff_contact_number,
				data.staff_alloted_lab,
				data.staff_email,
				data.staff_aadhar_number,
				data.staff_designation,
				data.image_name,
			];

			pool.query(q, insertData, function (err, result) {
				err ? reject(err) : resolve(result);
			});
		});
	},
};

module.exports = staffModel;
