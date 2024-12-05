var express = require('express');
var commenMiddleware = require('./middleware');
var adminController = require('../application/controllers/adminController');
const mockController = require('../application/controllers/mock/mockController');
var router = express.Router();

// MOCK ROUTES
router.get('/mock-setting', commenMiddleware.checkForPoolConnection, mockController.mockHome);

router.get('/mock-exam-setting', commenMiddleware.checkForPoolConnectionWithAdminSession, mockController.mockExamSetting);

router.post('/mock-exam-setting', commenMiddleware.checkForPoolConnectionWithAdminSession, mockController.mockExamSettingSave);

router.get('/mock-exams-list', commenMiddleware.checkForPoolConnection, mockController.mockExamsList);

// =============== ADMIN ROUTES :start===============
router.get('/', commenMiddleware.checkForPoolConnection, adminController.adminHome);
router.get('/exams', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.adminExams);
router.post('/student-list', commenMiddleware.checkForPoolConnection, adminController.addRemoteStudent);

router.get('/get-student-infoemation', function (req, res, next) {
	res.send('Sandip Mapari');
});

router.get('/get-all-exam-list', commenMiddleware.checkForPoolConnection, adminController.ajaxGetExamList);
router.get('/get-done-exam-list', commenMiddleware.checkForPoolConnection, adminController.ajaxGetDoneExamList);
router.get('/student-list/:pub_id', commenMiddleware.checkForPoolConnection, adminController.getExamStudentList);

router.post('/get-students-batch-wise', commenMiddleware.checkForPoolConnection, adminController.getStudentsListBatchwise);

router.get('/student-atendance', commenMiddleware.checkForPoolConnection, adminController.getStudentAttendanceView);
router.get('/students', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getAllStudentsView);
router.get('/logout', commenMiddleware.checkForPoolConnection, adminController.adminLogOut);
router.get('/live-exam-status', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getLiveExamStatus);

router.get('/unlocked-candidate-list', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getUnlockedCandidatesList);

router.get('/upload-banner', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getUploadBannerView);

router.post('/upload-banner', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.postUploadBanner);

router.get('/center-handler', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.centerHandlerView);
router
	.route('/center-handler/new')
	.get(commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.newCenterHandlerView)
	.post(commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.addNewCenter)
	.delete(commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.deleteCenter);

router.get('/exam-lock-status', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getExamLockStatus);
router.get('/sw', commenMiddleware.checkForPoolConnection, adminController.swExamLockStatus);
router.get('/adminner', commenMiddleware.checkForPoolConnectionWithAdminSession, adminController.getAdminnerView);
router.get('/get-value', commenMiddleware.checkForPoolConnection, adminController.getValueListPost);
router.get('/get-value/:id', commenMiddleware.checkForPoolConnection, adminController.getValueList);

router.post('/set-value/', commenMiddleware.checkForPoolConnection, adminController.setValueList);

// post
router.post('/marked-as-absent', commenMiddleware.checkForPoolConnection, adminController.markedAsAbsent);
router.post('/unlock-one-student', commenMiddleware.checkForPoolConnection, adminController.unlockOneUser);
router.post('/unlock-all-student', commenMiddleware.checkForPoolConnection, adminController.unlockAllUser);
router.post('/requestUpdateIP', commenMiddleware.checkForPoolConnection, adminController.updateMasterIpAress);
router.post('/get-exam-list', commenMiddleware.checkForPoolConnection, adminController.getCURLExamList);
router.post('/requestCenterCode', commenMiddleware.checkForPoolConnection, adminController.getCURLCenterDetails);
router.post('/clear-all-redcores', commenMiddleware.checkForPoolConnection, adminController.clearDB);
router.post('/unset-exam', commenMiddleware.checkForPoolConnection, adminController.unsetExam);
router.post('/exam-backup', commenMiddleware.checkForPoolConnection, adminController.loadStudentListBackToFinal);
router.post('/exam-backup-sql', commenMiddleware.checkForPoolConnection, adminController.createDbBackup);
router.post('/check-examo-auth', commenMiddleware.checkForPoolConnection, adminController.adminLoginAuth);
router.post('/get-batch-student-list', commenMiddleware.checkForPoolConnection, adminController.getBatchStudentList);
router.post('/mark-student-attendace', commenMiddleware.checkForPoolConnection, adminController.markStudentAttendace);
router.post('/single-student-details', commenMiddleware.checkForPoolConnection, adminController.getSingleStudentDetails);
router.post('/download-exam', commenMiddleware.checkForPoolConnection, adminController.getCURLDownloadExam);
router.post('/download-student', commenMiddleware.checkForPoolConnection, adminController.getCURLDownloadStudent);

router.post('/download-photo-sign', commenMiddleware.checkForPoolConnection, adminController.getCURLDownloadPhotoSign);

router.post('/download-node-details', commenMiddleware.checkForPoolConnection, adminController.getCURLDownloadNodeDetails);

router.post('/final-publish', commenMiddleware.checkForPoolConnection, adminController.finalPublish);
router.post('/activate-attendance', commenMiddleware.checkForPoolConnection, adminController.startAttendance);
router.post('/loadExam', commenMiddleware.checkForPoolConnection, adminController.loadExam);
router.post('/startExamSession', commenMiddleware.checkForPoolConnection, adminController.startExamSession);
router.post('/save-exams-to-master', commenMiddleware.checkForPoolConnection, adminController.getCURLSendData);
router.post('/clear-this-exam', commenMiddleware.checkForPoolConnection, adminController.clearThisExamSession);
// =============== ADMIN ROUTES :end===============

module.exports = router;
