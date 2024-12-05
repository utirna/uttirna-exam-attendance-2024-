const attendenceModel = require('../model/attendenceModel');

const path = require('./createDir');

var attendenceController = {
	attendencePage: async (req, res) => {
		res.render(`candidate/candidate-attendance.ejs`, {
			session: req.session,
		});
	},

	/*

  getStudentDetails: async (req, res) => {
    try {
      const id = req.body.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Enter valid id",
        });
      }

      const serverUrl = req.session?.serverUrl;
      const endPoint = "/api/v1/student-details";

      const callToServerApiUrl = `${serverUrl}${endPoint}`;

      console.log("Getting endpioiint , ", callToServerApiUrl)
      const _response = await fetch(callToServerApiUrl, {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

       // Checking if the response content is in JSON format
  const contentType = _response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const _responseData = await _response.json();

    console.log("****************");
    console.log("Response Data:", _responseData);
    console.log("****************");
  } else {
    // Handle non-JSON response
    const textResponse = await _response.text();
    console.error("Non-JSON response received:", textResponse);
  }
      let _student = [];
      const student = _student[0] || {};

      if (student.sl_present_status == 1) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Student is already marked present",
          data: {
            student: undefined,
            already_present: true,
          },
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        data: {
          student,
          already_present: false,
          message: "Studente Details fetched successfully",
        },
      });
    } catch (err) {
      console.log(`Error while fetching the student details : ${err}`);
      return res.status(500).json({
        success: 500,
        status: 500,
        data: {
          error: err,
          message: "Internal server error while fetching the student details",
        },
      });
    }
  },
*/

	getStudentDetails: async (req, res) => {
		try {
			const id = req.body.id;

			if (!id) {
				return res.status(400).json({
					success: false,
					status: 400,
					message: 'Enter valid id',
				});
			}

			const serverUrl = req.session?.serverUrl;
			const endPoint = '/api/attendence/v1/student-details';
			const callToServerApiUrl = `${serverUrl}${endPoint}`;

			// console.log("Getting endpoint:", callToServerApiUrl);

			const _response = await fetch(callToServerApiUrl, {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Check if tstaffMembershe response is in JSON format
			const contentType = _response.headers.get('content-type');

			let _responseData;
			if (contentType && contentType.includes('application/json')) {
				_responseData = await _response.json();
			} else {
				const textResponse = await _response.text();
				console.error('Non-JSON response received:', textResponse);
				return res.status(500).json({
					success: false,
					status: 500,
					message: 'Invalid response format from server.',
				});
			}

			const { student, pcDetails, already_present, studentAttendenceCount } = _responseData.data;

			if (already_present || student?.sl_present_status == 1) {
				return res.status(200).json({
					success: true,
					status: 200,
					message: 'Student is already marked present',
					data: {
						student: student,
						already_present: true,
						studentAttendenceCount,
						pcDetails,
					},
				});
			}

			return res.status(200).json({
				status: 200,
				success: true,
				message: 'Student Details fetched successfully',
				data: {
					student: student,
					already_present: true,
					studentAttendenceCount,
					pcDetails: pcDetails || [],
				},
			});
		} catch (err) {
			console.log(`Error while fetching the student details: ${err}`);
			return res.status(500).json({
				success: false,
				status: 500,
				data: {
					error: err,
					message: 'Internal server error while fetching the student details',
				},
			});
		}
	},

	markAttendencePresent: async (req, res) => {
		try {
			const data = req.body;

			const studentPhoto = req.files.student_photo;

			console.log(studentPhoto);

			const formData = new FormData();

			formData.set('student_photo', studentPhoto);

			const serverUrl = req.session?.serverUrl;
			const endPoint = '/api/attendence/v1/mark-present';

			const callToServerApiUrl = `${serverUrl}${endPoint}`;

			const _response = await fetch(callToServerApiUrl, {
				method: 'POST',
				body: formData,
			});

			console.log('resData', await _response.json());

			// console.log(studentPhoto);
			// const imageExtension = req.files.student_photo.mimetype.split("/").pop();

			// const webcamImagesDir = path.webcamImagesDir;
			// const image_name = `student-webcam-img-${data.id}.${imageExtension}`;

			// data.image_name = image_name;

			// const destDir = `${webcamImagesDir}/${image_name}`;

			// studentPhoto.mv(destDir, async (err, result) => {
			//   if (err) {
			//     console.log(`Error while saving the webcam image : ${err}`);
			//     return res.status(500).json({
			//       success: false,
			//       status: 500,
			//       error: err,
			//     });
			//   } else {
			//     const _result = await attendenceModel.markAttendencePresent(
			//       res.pool,
			//       data
			//     );

			//     console.log(_result, "-result");

			//     if (_result.affectedRows > 0) {
			//       return res.status(200).json({
			//         success: true,
			//         status: 200,
			//         data: {
			//           message: "Attenedence Marked Successfully",
			//         },
			//       });
			//     }
			//   }
			// });
		} catch (err) {
			console.log(`Error while marking the attendence : ${err}`);
			return res.status(500).json({
				success: false,
				status: 500,
				error: err,
			});
		}
	},
};

module.exports = attendenceController;
