const staffModel = require('../model/staffModel.js');

const path = require('./createDir');

const staffController = {
	saveStaffDetails: async (req, res) => {
		try {
			let staff_photo = req.files.staff_photo;
			if (!staff_photo) {
				return res.status(200).json({
					call: 0,
					message: 'Please provide staff photo',
				});
			}
			const data = req.body;
			console.log(staff_photo, '-staff photo');
			console.log(data, '-req data');

			const imageExtension = staff_photo.mimetype.split('/').pop();

			const staffImageDir = path.staffImageDir;
			const image_name = `_staff_image-${data.staff_contact_number}.${imageExtension}`;

			data.image_name = image_name;

			const destDir = `${staffImageDir}/${image_name}`;

			staff_photo.mv(destDir, async (err, result) => {
				if (err) {
					console.log(`Error while saving the staff image : ${err}`);
					return res.status(500).json({
						success: false,
						status: 500,
						error: err?.message || 'Server error while saving staff image',
					});
				} else {
					const _result = await staffModel.saveStaffDetails(res.pool, data);

					console.log(_result, '-result');

					if (_result.affectedRows > 0) {
						return res.status(200).json({
							success: true,
							status: 200,
							message: 'Staff details saved successfully',
						});
					}
				}
			});
		} catch (err) {
			console.log(`error : ${err}`);
			return res.status(500).json({
				success: false,
				status: 500,
				error: err?.message || 'Server error',
			});
		}
	},

	getStaffDetailsList: async (req, res) => {
		try {
			let _staffList = await staffModel.getStaffDetailsList(res.pool);
			return res.status(200).json({
				call: 1,
				data: _staffList,
			});
		} catch (error) {
			console.log(error, '==error==');
			return res.status(500).json({
				success: false,
				status: 500,
				error: error?.message || 'Server error',
			});
		}
	},
};

module.exports = staffController;
