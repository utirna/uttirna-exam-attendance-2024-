// var connection_info = require('../../ip_data')
// var host = connection_info.ip_address.host
let host = `http://192.168.1.21:3025/api`;
var CURL_link = {
	new_exam_list: `${host}/remote/getNewExamList`,
	download_exam: `${host}/remote/DownloadExam`,
	download_student_batch: `${host}/DownloadStudentBatch`,
	upload_exam_link: `${host}/exams/saveUploadedExam`,
	get_center_data: host + 'getCenterData',
};
exports.CURL_link = CURL_link;
