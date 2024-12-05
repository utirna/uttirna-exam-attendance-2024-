var exam_list = []
var new_exam_list = []
$(function () {
	getAllExamList()
	$('#get-exam-list').on('click', function () {
		test_id_list = []
		test_id_list = exam_list.map(function (data) {
			return data.id
		})
		$.post(
			getUrl() + 'get-exam-list',
			{ exam_list: JSON.stringify(test_id_list) },
			function (data, status) {
				if (status == 'success') {
					if (typeof data === 'object') {
						var _json = data
					} else {
						var _json = JSON.parse(data)
					}

					if (_json.call == 1) {
						LoadExamList(_json.data, '#new_exams_list_tbody', 2)
					} else {
						if (_json.call == 999) {
							alert('Master Server Not Found')
						} else {
							alert('Exam Not Found On Master Server_1')
						}
					}
				} else {
					alert('Master Server Not Found')
				}
			}
		).error(function (error) {
			alert('Server Error')
			console.log(error)
		})
	})
})

function getAllExamList() {
	$.ajax({
		url: getUrl() + 'get-all-exam-list',
		method: 'GET',
		success: ({ call, data }) => {
			if (call == 1) {
				let finalPublishedList = []
				let notPublishedList = []

				data.forEach((test) => {
					if (test.is_final_published == 1) {
						finalPublishedList.push(test)
					} else {
						notPublishedList.push(test)
					}
				})
				LoadExamList(finalPublishedList, '#done_exams_list_tbody', 1)
				LoadExamList(notPublishedList, '#new_exams_list_tbody', 2)
			}

			if (call == 2) {
				alert('No exams found2')
			}
		},
		error: (err) => {
			console.log(err)
		},
	})
}

function LoadExamList(list, table_name, type) {
	console.log(list, 'exam list')
	exam_list = list
	if (list.length == 0) {
		// $('#new_exams_list_table').hide()
		// $('#get-exam-list').show()
		$(table_name).html(
			'<tr><td colspan="10" style="text-align:center">No Exams Found1</td></tr>'
		)
	}

	// prettier-ignore
	if (list.length > 0) {
		$('#get-exam-list').hide()
		$(table_name).html('')
		list.forEach(function (value, index) {
			var _tr = '<tr>'

			// type 1 saved exam / scheduled exams
			if (type == 1) {
				_tr += `<td> 
									${index + 1}
								</td>
								<td> 
									${value.mt_name} 
								</td>`
				if (value.ptl_is_test_done == '1') {
					_tr +=`<td>
										<label class="btn-warning btn-sm" style="margin-right:10px;">
											Done!
										</label>
									</td>
									<td>
										${value.mt_test_time} Min</td>
									</td>
										Batch-${value.tm_allow_to}
									</td>`
				} else {
					if (value.is_test_loaded == '1') {
						_tr +=`<td>
											<label class="btn-success btn-sm" style="margin-right:10px;">
												${value.ptl_link_1}
											</label>
										</td>
										<td>
											${value.mt_test_time} Min
										</td>
										<td>
											Batch-${value.tm_allow_to}
										</td>`
					} else {
						_tr +=`<td>
										<center>
											<label class=""  title="${value.ptl_link_1}">
												<i class="text-success fa fa-history fa-2x"></i>
											</label>
										<center>
									<td>
										${value.mt_test_time} Min
									</td>
									<td>
										Batch-${value.tm_allow_to} 
									</td>`
					}
				}

				if (value.is_test_loaded == '1') {
					if (value.is_start_exam == '1') {
						if (value.is_test_generated == '1') {
							_tr += `<td>
										<center>
											<i class="text-success fa-solid fa-check-square fa-2x"></i>
										</center>
									</td> 
									<td>
										<center>
											<i class="text-warning fa-solid fa-check-square fa-2x"></i>
										</center>
									</td> 
									<td>
										<center>
											<i class="text-primary fa-solid fa-check-square fa-2x"></i>
										</center>
									</td>`
						} else {
							_tr += `<td>
												<center>
													<i class="text-success fa fa-check-square fa-2x"></i>
												</center>
											</td>
											<td>
												<button 
													type="button" 
													data-tm_allow_to="${value.tm_allow_to}" 
													data-cc="${cc}" 
													data-id="${value.id}" 
													class="btn btn-primary btn-sm end-slot-backup-btn">
													End Slot & Backup
												</button>
											</td>
											<td>
												<center>
													<i class="text-danger fa fa-hourglass fa-2x"></i>
												</center>
											</td>`
						}
					} else {
						_tr +=
							`<td>
								<button type="button" data-id="${value.id}" class="btn btn-success btn-sm activeExamBtn">
									Start Exam
								</button>
							</td> 
							<td>
								<center>
									<i class="text-danger fa-regular fa-hourglass fa-2x"></i>
								</center>
							</td> 
							<td>
								<center>
									<i class="text-danger fa-regular fa-hourglass fa-2x"></i>
								</center>
							</td>`
					}
				} else {
					_tr += `<td>
								<button type="button" class="btn btn-primary btn-sm" onclick="activeSession(${value.id})">
									Start Session
								</button>
							</td>
							<td>
								<center>
									<i class="text-danger fa fa-hourglass fa-2x"></i>
								</center>
							</td>
							<td>
								<center>
									<i class="text-danger fa fa-hourglass fa-2x"></i>
								</center>
							</td>`
				}
				if (value.is_start_exam == '1') {
					if (value.is_absent_mark == '1') {
						_tr += `<td>
									<center>
										<i class="text-danger fa-solid fa-check-square fa-2x"></i>
									</center>
								</td>`
					} else {
						_tr +=
							`<td>
								<center>
									<button 
										type="button" 
										data-tm_allow_to="${value.tm_allow_to}" 
										data-id="${value.id}" 
										class="btn btn-danger btn-sm mark-absent-btn" 
										style="margin-right:10px;"
									>

										Mark Batch-${value.tm_allow_to} Absent 
									</button>
								</center>
							</td>`
					}
				} else {
					_tr += `<td>	
								<center>
									<i class="text-danger fa fa-hourglass fa-2x"></i>
								</center>
							</td>`
				}

				_tr += `<td>
							<center>
								<button class='btn btn-success btn-sm view-students-btn' data-exam-id='${value.tm_allow_to}'>
									<i class='fa-solid fa-eye'></i>
								</button>	
							</center>
						</td>
					</tr>`

			// for type 2 unsaved exam list
			} else {
				_tr += `<td>
									${index + 1}
								</td>
								<td>
									${value.mt_name}
								</td>
								<td>
									${value.mt_test_time} Min
								</td>
								<td>
									Batch-${value.tm_allow_to} 
								</td>`

				new_exam_list = list
				$('#new_exams_list_table').removeClass('d-none')
				let isExamDownloaded = value.is_exam_downloaded == 1 ? true : false
				let isStudentsDownloaded =
					value.is_students_downloaded == 1 ? true : false
				let isPhotoSignDownloaded =
					value.is_sign_downloaded == 1 && value.is_photos_downloaded == 1
						? true
						: false
				let isFinalPublished = value.is_final_published == 1 ? true : false
				// prettier-ignore
				_tr += `<td>
							<button type="button" 
									class="btn ${isExamDownloaded ? 'btn-success' : 'btn-primary'}  btn-sm" 
									onclick="downloadExam(${value.id}, ${index})" 
									${isExamDownloaded ? 'disabled' : '' }>
								${isExamDownloaded ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-solid fa-download"></i>'}
							</button>
						</td>

						<td>
							<button type="button" 
									class="btn ${isStudentsDownloaded ? 'btn-success' : 'btn-primary'} downloadStudent btn-sm" 
									data-examDate="${value.exam_date}"
									data-exam-id="${value.id}"
									data-batch-id="${value.tm_allow_to}"
									${isStudentsDownloaded ? 'disabled' : '' }>
								${isStudentsDownloaded ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-solid fa-download"></i>'}
							</button>
						</td>

						<td>
							<button type="button" 
									class="btn ${isPhotoSignDownloaded ? 'btn-success' : 'btn-primary'} downloadPhotoSign btn-sm" 
									data-examDate="${value.exam_date}"
									data-exam-id="${value.id}"
									data-batch-id="${value.tm_allow_to}"
									${isPhotoSignDownloaded ? 'disabled' : '' }>
								${isPhotoSignDownloaded ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-solid fa-download"></i>'}
							</button>
						</td>

						<td>
							<button type="button" 
									class="btn ${isFinalPublished ? 'btn-success' : 'btn-primary'}  btn-sm" 
									onclick="finalPublish(${value.id}, ${index})" 
									${isFinalPublished ? 'disabled' : '' }>
								${isFinalPublished ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-solid fa-download"></i>'}
							</button>
						</td>
					</tr>`
			}
			$(table_name).append(_tr)
		})
	}
}

// for checking authentication =====================

function checkAuth(cb) {
	showModal('#pass-auth-modal')
	let isAuth = false

	function _isAuth() {
		let pass = $('#auth-password')
		if (+pass.val() !== cc) {
			console.log('unauthorized')
			isAuth = false
			pass.val('')
			$(document).off('click', '#auth-submit-btn', _isAuth)
			cb(isAuth)
			checkAuth(cb)
			return
		} else {
			isAuth = true
			pass.val('')
			hideModal('#pass-auth-modal')
			cb(isAuth)
			$(document).off('click', '#auth-submit-btn', _isAuth)
			return
		}
	}

	$(document).on('click', '#auth-submit-btn', _isAuth)
}

// for checking authentication =====================

function showExamStudentList(pub_id) {
	window.location = '/admin/student-list/' + pub_id
}
function downloadExam(id, index) {
	prompt(
		'Enter Authentication Password',
		'*******',
		'password',
		function (value) {
			if (parseInt(value, 10) !== cc) {
				alert('Invalid Password !!!!')
				return false
			}
			addLoading()

			$.post(getUrl() + 'download-exam', { id: id }, function (data, status) {
				removeLoading()
				if (status == 'success') {
					var _json = data
					switch (_json.call) {
						case -1:
							alert('Internal Query Error')
							break
						case 3:
							alert('Question Paper Not Found')
							break
						case 2:
							alert('Exam Not Found')
							break
						case 1:
							alert('Exam Added Successfully')
							getAllExamList()
							new_exam_list = new_exam_list.filter(function (ele) {
								return ele.id != id
							})
							LoadExamList(new_exam_list, '#new_exams_list_tbody', 2)
							break
						case 999:
							alert('Master Server Not Found.')
							break

						default:
							break
					}
				} else {
					alert('Server Error')
				}
			})
		}
	)
}

$(document).on('click', '.downloadPhotoSign', function (e) {
	e.preventDefault()
	let examId = $(this).attr('data-exam-id')
	let batchId = $(this).attr('data-batch-id')
	let examDate = $(this).attr('data-examDate')

	checkAuth((isAuth) => {
		if (isAuth) {
			downloadPhotoSign(examId, batchId, examDate)
		}
	})
})

function downloadPhotoSign(examId, batch_id, examDate) {
	console.log(examId, batch_id, examDate)

	showModal('#phot-sign-download-modal')

	const socket = io()
	let statusText = $('.status-text')

	socket.on('console.log', (data) => {
		console.log(data)
	})

	socket.on('status-photo-sign-download', (data) => {
		console.log(data)
		statusText.text(data)
	})

	socket.on('completed', () => {
		setTimeout(() => {
			hideModal('#phot-sign-download-modal')
		}, 1500)
	})

	socket.on('sign-photo-download-status-updated', () => {
		window.location.reload()
	})

	addLoading()
	$.ajax({
		url: getUrl() + 'download-photo-sign',
		type: 'POST',
		data: {
			batch_list: batch_id,
			center_code: cc,
			exam_id: examId,
			exam_date: examDate,
		},
		success: function (data) {
			removeLoading()
			console.log(data, '-res data')
			hideModal('#phot-sign-download-modal')
		},
		error: function ({ responseJSON: err }) {
			removeLoading()
			alert(err.message)
		},
	})
}

$(document).on('click', '.downloadStudent', function (e) {
	e.preventDefault()
	let examId = $(this).attr('data-exam-id')
	let batchId = $(this).attr('data-batch-id')
	let examDate = $(this).attr('data-examDate')

	checkAuth((isAuth) => {
		if (isAuth) {
			downloadStudent(examId, batchId, examDate)
		}
	})
})

async function downloadStudent(examId, batch_id, examDate) {
	console.log(examId, batch_id, examDate)
	addLoading()
	$.ajax({
		url: getUrl() + 'download-student',
		type: 'POST',
		data: {
			batch_list: batch_id,
			center_code: cc,
			exam_id: examId,
			exam_date: examDate,
		},
		success: function (data) {
			removeLoading()
			if (data.call == 1) {
				alert('Student List Downloaded Successfully.')
				window.location.reload()
				return false
			}
			if (data.call == 0) {
				alert('Internal Query Error.')
				return false
			}
			if (data.call == 5) {
				alert('Student List Not Found.')
			}
		},
		error: function (error) {
			removeLoading()
			console.log(error.responseJSON, 'error')
			let err = error.responseJSON
			if (err.call == 999) {
				alert(err.message)
			}
		},
	})
}

async function finalPublish(examId) {
	addLoading()
	$.ajax({
		url: getUrl() + 'final-publish',
		type: 'POST',
		data: {
			exam_id: examId,
		},
		success: function (data) {
			removeLoading()
			if (data.call == 1) {
				alert(data.message)
				window.location.reload()
				return false
			}
			if (data.call == 2) {
				alert(data.message)
				return false
			}
			if (data.call == 3) {
				alert(data.message)
				return false
			}
		},
		error: function (error) {
			removeLoading()
			alert('Server Error')
			console.log(error)
		},
	})
}

function activeSession(pub_id) {
	$.post(
		getUrl() + '/startExamSession',
		{ pub_id: pub_id },
		function (data, status) {
			if (status == 'success') {
				var _json = data
				switch (_json.call) {
					case 0:
						alert('Fail.. Try Again.')
						break
					case 1:
						alert('Session Started Successfully.')
						getAllExamList()
						break
				}
			}
		}
	)
}

let newExam = {
	examId: 0,
	pub_id: 0,
	batch_no: 0,
	cc: 0,

	_startExamAuthModal() {
		newExam.examId = $(this).attr('data-id')
		$('#newExamStartAuthModal').modal('show')
	},

	_submitExamDetails() {
		let password = $('#new-exam-auth-password').val()
		if (password == '' || +password !== +cc) return alert('Invalid Password!!!')

		$.post(
			getUrl() + '/loadExam',
			{ pub_id: newExam.examId },
			function (data, status) {
				if (status == 'success') {
					var _json = data
					switch (_json.call) {
						case 0:
							alert('Fail.. Try Again.')
							break
						case 1:
							alert('Exam Started Successfully.')
							$('#new-exam-auth-password').val('')
							$('#newExamStartAuthModal').modal('hide')
							getAllExamList()
							break
					}
				}
			}
		)
	},
	_confirmEndSlot() {
		newExam.pub_id = $(this).attr('data-id')
		newExam.batch_no = $(this).attr('data-tm_allow_to')
		newExam.cc = $(this).attr('data-cc')

		$('#examBackupModal').modal('show')
	},

	_takeExamBackup() {
		let pub_id = newExam.pub_id
		let batch_no = newExam.batch_no
		let cc = newExam.cc
		let password = $('#exam-backup-auth-password').val()
		console.log(pub_id, batch_no, cc)

		if (+password !== +cc) return alert('Invalid Password')

		addLoading()
		$.post(
			getUrl() + '/exam-backup',
			{
				pub_id: pub_id,
				batch_no: batch_no,
				cc: cc,
			},
			function (data, status) {
				removeLoading()
				$('#examBackupModal').modal('hide')
				$('#exam-backup-auth-password').val('')
				if (status == 'success') {
					var _json = data
					switch (_json.call) {
						case 0:
							alert('Fail.. Try Again.')
							break
						case 1:
							alert('Exam Saved Successfully.... Click Ok To Take Backup')
							takeExamBackupSql(pub_id, batch_no, cc)
							break
						case 2:
							alert('Student Records Not Found For Backup.')
							break
						default:
							alert('Server Error, Try Again')
							break
					}
				}
			}
		)
	},
}

$(document).on('click', '.activeExamBtn', newExam._startExamAuthModal)

$(document).on('click', '#startExamSubmitBtn', newExam._submitExamDetails)

$(document).on('click', '.end-slot-backup-btn', newExam._confirmEndSlot)

$(document).on('click', '#examCompletedConfirm', () => {
	$('.exam-complete-confirm').toggleClass('d-none')
	$('.backup-confirm').toggleClass('d-none')
})

$(document).on('click', '#examBackupConfirm', () => {
	$('.exam-complete-confirm').addClass('d-none')
	$('.backup-confirm').addClass('d-none')
	$('.backup-password').removeClass('d-none')
})

$(document).on('click', '.close-backup-modal', () => {
	$('.exam-complete-confirm').removeClass('d-none')
	$('.backup-confirm').addClass('d-none')
	$('.backup-password').addClass('d-none')
})

$(document).on(
	'click',
	'#examCompletedConfirmAuthPass',
	newExam._takeExamBackup
)

let markAbsentDetails = {
	pub_id: 0,
	batch_no: 0,
}
$(document).on('click', '.mark-absent-btn', function () {
	markAbsentDetails.pub_id = $(this).attr('data-id')
	markAbsentDetails.batch_no = $(this).attr('data-tm_allow_to')

	$('#markAbsentModel').modal('show')
})

$(document).on('click', '.submitMarkAbsentBtn', function () {
	markStudentAsAbsent()
})

function markStudentAsAbsent() {
	let id = markAbsentDetails.pub_id
	let batch_no = markAbsentDetails.batch_no

	let password = $('#mark-absent-auth-password').val()

	if (+password !== +cc) return alert('Invalid password')

	addLoading()
	$.post(
		getUrl() + 'marked-as-absent',
		{ pub_id: id, batch_no: batch_no },
		function (data, status) {
			$('#markAbsentModel').modal('hide')
			$('#mark-absent-auth-password').val()
			removeLoading()
			if (status == 'success') {
				if (typeof data === 'object') {
					var _json = data
				} else {
					var _json = JSON.parse(data)
				}
				if (_json.call == 1) {
					getAllExamList()
				} else {
					if (_json.call == 999) {
						alert('Master Server Not Found')
					} else {
						alert('Exam Not Found On Master Server_2')
					}
				}
			} else {
				alert('Master Server Not Found')
			}
		}
	).error(function (error) {
		removeLoading()
		alert('Server Error')
		console.log(error)
	})
}

function takeExamBackupSql(pub_id, batch_no, cc) {
	addLoading()
	$.post(
		getUrl() + '/exam-backup-sql',
		{
			pub_id: pub_id,
			batch_no: batch_no,
			cc: cc,
		},
		function (data, status) {
			removeLoading()
			if (status == 'success') {
				var _json = data
				switch (_json.call) {
					case 0:
						alert('Fail.. Try Again.')
						break
					case 1:
						alert('Backup Created Successfully.')
						unsetExam(pub_id, batch_no, cc)
						break
				}
			}
		}
	)
}
function unsetExam(pub_id, batch_no, cc) {
	addLoading()
	$.post(
		getUrl() + '/unset-exam',
		{
			pub_id: pub_id,
			batch_no: batch_no,
			cc: cc,
		},
		function (data, status) {
			removeLoading()
			if (status == 'success') {
				var _json = data
				switch (_json.call) {
					case 0:
						alert('Fail.. Try Again.')
						break
					case 1:
						alert('Exam Stopped Successfully.')
						getAllExamList()
						break
					default:
						alert('Server Error, Try Again')
						break
				}
			}
		}
	)
}

$(document).on('click', '.view-students-btn', function () {
	getStudentsBatchwise($(this).attr('data-exam-id'))
})
function getStudentsBatchwise(examId) {
	addLoading()
	$.post(
		getUrl() + 'get-students-batch-wise',
		{
			batch_no: examId,
			cc: cc,
		},
		function (data, status) {
			removeLoading()
			console.log(data, '-here-')
			printStudentsDetails(data.data)
		}
	)
}

function printStudentsDetails(list) {
	let studentsListModal = $('#studentsListModal')
	let studentsListTbody = $('#students-details-tbody')

	studentsListModal.modal('show')
	let _html
	if (list.length == 0) {
		_html = `<tr class='text-center'>
					<td colspan='10'>
						Nothing But Crickets!!!
					</td>
				</tr>`
	} else {
		_html = list.map((el, i) => {
			// prettier-ignore
			return ` <tr>
						<td class='text-center'> ${el.sl_roll_number} </td>
						<td width='5%'> 
							<img class='h-100 w-100' src='${is_mock_mode ? `/${el.sl_image}` : `/pics/_images/${el.sl_image.split('/')[1]}`}' alt='student-profile-img'/>
						</td>
						<td width='5%'> 
							<img class='h-100 w-100' src='${is_mock_mode ? `/${el.sl_sign}` : `/pics/_images/${el.sl_sign.split('/')[1]}`}' alt='student-profile-img'/>
						</td>
						<td> ${el.sl_f_name} ${el.sl_m_name} ${el.sl_l_name} </td>
						<td> ${el.sl_contact_number} </td>
						<td> ${el.sl_application_number} </td>
						<td> ${el.sl_post} </td>
					</tr>
				`
		})
	}

	studentsListTbody.html(_html)
	// makeDataTable('.students-list-table')
}

function makeDataTable(tableName) {
	let table = new DataTable(tableName, {
		responsive: true,
		destroy: true,
	})
}
