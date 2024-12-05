const attendenceModel = require('../model/attendenceModel');
const fs = require('fs');

const path = require('./createDir');

var attendenceController = {
	attendencePage: async (req, res) => {
		try {
			res.render(`admin/attendance/attendance-page.pug`);
		} catch (err) {
			console.log(`Error while rendering the attendence page : ${err}`);
		}
	},

	getStudentDetails: async (req, res) => {
		try {
			const id = req.body.id;
			console.log(`In backedn o omakr side backend `)

			if (!id) {
				return res.status(200).json({
					call: 1,
					message: 'Invalid student id',
				});
			}

			const _student = await attendenceModel.getStudentDetails(res.pool, id);

			const student = _student[0];
			let _studAttendenceCount = await attendenceModel.studentAttendanceCount(
				res.pool
			);

			if (student && student.sl_present_status == 1) {
				let _pcDetails = await attendenceModel.getStudentPcDetails(
					res.pool,
					id
				);
				return res.status(200).json({
					success: true,
					status: 200,
					data: {
						student,
						pcDetails: _pcDetails,
						studentAttendenceCount: _studAttendenceCount,
						already_present: true,
						message: 'Student is already marked present',
					},
				});
			}

			return res.status(200).json({
				status: 200,
				success: true,
				data: {
					student,
					studentAttendenceCount: _studAttendenceCount,
					already_present: false,
					message: 'Studente Details fetched successfully',
				},
			});
		} catch (err) {
			console.log(`Error while fetching the student details : ${err}`);
			return res.status(500).json({
				success: 500,
				status: 500,
				data: {
					error: err,
					message: 'Something went wrong, try again later.',
				},
			});
		}
	},

	// markAttendencePresent: async (req, res) => {
	// 	try {
	// 		const data = req.body;

	// 		const studentPhoto = req.files.student_photo;

	// 		const imageExtension = req.files.student_photo.mimetype.split('/').pop();

	// 		const webcamImagesDir = path.webcamImagesDir;
	// 		const image_name = `student-webcam-img-${data.id}.${imageExtension}`;

	// 		data.image_name = image_name;

	// 		const destDir = `${webcamImagesDir}/${image_name}`;

	// 		studentPhoto.mv(destDir, async (err, result) => {
	// 			if (err) {
	// 				console.log(`Error while saving the webcam image : ${err}`);
	// 				return res.status(500).json({
	// 					success: false,
	// 					status: 500,
	// 					error: err,
	// 				});
	// 			} else {
	// 				/**
	// 				 * 1. get student row number from tn_students_list table
	// 				 * 2. get pc details from node_details table for the student row number
	// 				 * 3. check if pc is alloted to other candidate
	// 				 * 4. save the mac_id and student roll no to temp_stud_mac_id_list table
	// 				 * 5. Mark the attendence as present
	// 				 * */
	// 				let _studentRowNumber = await attendenceModel.getStudentRowNumber(
	// 					res.pool,
	// 					data
	// 				);
	// 				let _pcDetails = await attendenceModel.getPcDetails(
	// 					res.pool,
	// 					_studentRowNumber
	// 				);
	// 				let _pcAllotResult = await attendenceModel.allotPcToStudent(
	// 					res.pool,
	// 					{ _pcDetails: _pcDetails[0], data }
	// 				);

	// 				let _attendanceCount = await attendenceModel.studentAttendanceCount(
	// 					res.pool
	// 				);

	// 				if (_pcAllotResult[0]?.call == -1) {
	// 					fs.unlinkSync(destDir);
	// 					return res.status(200).json({
	// 						call: 0,
	// 						message: _pcAllotResult[0].message,
	// 						data: {
	// 							attendenceCount: _attendanceCount,
	// 							pcDetails: _pcDetails[0],
	// 						},
	// 					});
	// 				}

	// 				if (_pcAllotResult.affectedRows != 1) {
	// 					return res.status(200).json({
	// 						call: 0,
	// 						message: 'Not able to allocate pc, try again later',
	// 						data: {
	// 							attendenceCount: _attendanceCount,
	// 							pcDetails: {},
	// 						},
	// 					});
	// 				}

	// 				const _markAttendenceResult =
	// 					await attendenceModel.markAttendencePresent(res.pool, data);
	// 				_attendanceCount = await attendenceModel.studentAttendanceCount(
	// 					res.pool
	// 				);

	// 				if (_markAttendenceResult.affectedRows != 1) {
	// 					return res.status(200).json({
	// 						call: 0,
	// 						message: 'Not able to mark attendance, try again later',
	// 						data: {
	// 							attendenceCount: _attendanceCount,
	// 							pcDetails: {},
	// 						},
	// 					});
	// 				}

	// 				return res.status(200).json({
	// 					call: 1,
	// 					status: 200,
	// 					message: 'Attendance Marked Successfully',
	// 					data: {
	// 						attendenceCount: _attendanceCount,
	// 						pcDetails: _pcDetails[0],
	// 					},
	// 				});
	// 			}
	// 		});
	// 	} catch (err) {
	// 		console.log(`Error while marking the attendence : ${err}`);
	// 		return res.status(500).json({
	// 			success: false,
	// 			status: 500,
	// 			error: err?.message || 'Server error',
	// 		});
	// 	}
	// },

	markAttendencePresent: async (req, res) => {
		try {
			const data = req.body;

			const studentPhoto = req.files.student_photo;

			const imageExtension = req.files.student_photo.mimetype.split('/').pop();

			const webcamImagesDir = path.webcamImagesDir;
			const image_name = `student-webcam-img-${data.id}.${imageExtension}`;

			data.image_name = image_name;

			const destDir = `${webcamImagesDir}/${image_name}`;

			studentPhoto.mv(destDir, async (err, result) => {
				if (err) {
					console.log(`Error while saving the webcam image : ${err}`);
					return res.status(500).json({
						success: false,
						status: 500,
						error: err,
					});
				} else {
					/**
					 * 1. get student row number from tn_students_list table
					 * 2. get pc details from node_details table for the student row number
					 * 3. check if pc is alloted to other candidate
					 * 4. save the mac_id and student roll no to temp_stud_mac_id_list table
					 * 5. Mark the attendence as present
					 * */
					// let _studentRowNumber = await attendenceModel.getStudentRowNumber(
					// 	res.pool,
					// 	data
					// );
					// let _pcDetails = await attendenceModel.getPcDetails(
					// 	res.pool,
					// 	_studentRowNumber
					// );
					// let _pcAllotResult = await attendenceModel.allotPcToStudent(
					// 	res.pool,
					// 	{ _pcDetails: _pcDetails[0], data }
					// );

					// let _attendanceCount = await attendenceModel.studentAttendanceCount(
					// 	res.pool
					// );

					// if (_pcAllotResult[0]?.call == -1) {
					// 	fs.unlinkSync(destDir);
					// 	return res.status(200).json({
					// 		call: 0,
					// 		message: _pcAllotResult[0].message,
					// 		data: {
					// 			attendenceCount: _attendanceCount,
					// 			pcDetails: _pcDetails[0],
					// 		},
					// 	});
					// }

					// if (_pcAllotResult.affectedRows != 1) {
					// 	return res.status(200).json({
					// 		call: 0,
					// 		message: 'Not able to allocate pc, try again later',
					// 		data: {
					// 			attendenceCount: _attendanceCount,
					// 			pcDetails: {},
					// 		},
					// 	});
					// }

					const _markAttendenceResult =
						await attendenceModel.markAttendencePresent(res.pool, data);

					let _attendanceCount = await attendenceModel.studentAttendanceCount(
						res.pool
					);

					if (_markAttendenceResult.affectedRows != 1) {
						return res.status(200).json({
							call: 0,
							status: 500,
							message: 'Not able to mark attendance, try again later',
							data: {
								attendenceCount: _attendanceCount,
								pcDetails: {},
							},
						});
					}

					return res.status(200).json({
						call: 1,
						status: 200,
						message: 'Attendance Marked Successfully',
						data: {
							attendenceCount: _attendanceCount,
							pcDetails: {},
						},
					});
				}
			});
		} catch (err) {
			console.log(`Error while marking the attendence : ${err}`);
			return res.status(500).json({
				success: false,
				status: 500,
				error: err?.message || 'Server error',
			});
		}
	},

	// get students count (present/attendance not marked)
	studentAttendanceCount: async (req, res) => {
		try {
			let _attendanceCount = await attendenceModel.studentAttendanceCount(
				res.pool
			);
			console.log(_attendanceCount, '--');
			return res.status(200).json({
				call: 1,
				data: _attendanceCount,
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

module.exports = attendenceController;
