var express = require('express')
var router = express.Router()
var commonMiddleware = require('./middleware')
var indexController = require('../application/controllers/indexConroller')

/* GET home page. */
router.get(
	'/',
	commonMiddleware.checkForPoolConnection,
	commonMiddleware.checkExamMode,
	indexController.getExamHomePage
)

router.get(
	'/student-add',
	commonMiddleware.checkForPoolConnection,
	indexController.addNewStudent
)
router.post(
	'/add-new-student',
	commonMiddleware.checkForPoolConnection,
	indexController.postNewStudent
)

router.post(
	'/check-if-pc-is-alloted',
	commonMiddleware.checkForPoolConnection,
	indexController.checkIfPcIsAlloted
)

router.post(
	'/chk/link',
	commonMiddleware.checkForPoolConnection,
	indexController.checkExamLink
)
router.get(
	'/add-student',
	commonMiddleware.checkForPoolConnectionWithSession,
	indexController.addStudentView
)
router.post(
	'/verify-candidate',
	commonMiddleware.checkForPoolConnection,
	indexController.verifyCandidateForExam
)
router.get(
	'/exam-aggrement',
	commonMiddleware.checkForPoolConnection,
	indexController.viewExamAggrement
)
router.get(
	'/confirmtion',
	commonMiddleware.checkForPoolConnection,
	indexController.Confirmtion
)
router.get(
	'/warm-up',
	commonMiddleware.checkForPoolConnection,
	indexController.viewWarmUp
)
router.get(
	'/test',
	commonMiddleware.checkForPoolConnection,
	indexController.startExamination
)
router.post('/go', indexController.updateTestDetails)
router.get(
	'/climax/:publish_id/:student_id',
	commonMiddleware.checkForPoolConnection,
	indexController.viewExamClimax
)
router.get(
	'/testisdone',
	commonMiddleware.checkForPoolConnection,
	indexController.getExamIsDonePage
)

module.exports = router
