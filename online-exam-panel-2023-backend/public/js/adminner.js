$(function () {
	class NewSession {
		constructor() {
			$('#clearAllRecoresYes').on('click', this._confirmClearAllRecords);
			$('#clearAllRecoresAuthSubmit').on('click', this._clearAllRecords);
		}

		_confirmClearAllRecords() {
			$('#newSessionConfirmModal').modal('hide');
			$('#newSessionAuthPass').modal('show');
		}

		_clearAllRecords(e) {
			e.preventDefault();
			let password = $('#new-session-auth-password').val();
			if (password != 'utirna') return alert('Incorrect Password');
			addLoading();

			$.post(getUrl() + 'clear-all-redcores', function (data, status) {
				removeLoading();
				if (status == 'success') {
					var _json = data;
					switch (_json.call) {
						case 0:
							alert('Fail.. Try Again.');
							break;
						case 1:
							alert('New Session Set Successfully');
							break;
						default:
							alert('Server Error, Try Again');
							break;
					}
				}
			});
		}
	}

	let newSession = new NewSession();

	$('#uploadToMaster').on('click', function () {
		getAllDoneExams();
	});
});
function uploadExamToMasert(_this, pub_id) {
	// alert('This Will Upload Exams Details To Master Server,Do You Want To Continue ?');
	// checkAuth((isAuth) => {
	// 	console.log(isAuth, '==isAuth==');
	// 	if (isAuth) {
	$.ajax({
		url: getUrl() + 'save-exams-to-master',
		method: 'POST',
		data: { pub_id: pub_id },
		success: (data, status) => {
			removeLoading();
			if (status == 'success') {
				var _json = data;
				console.log(_json, '==_json==')
				switch (_json.call) {
					case 1:
						alert('Uploaded Exam Successfully.');
						//$(_this).addClass('hide');
						getAllDoneExams();
						break;
					case 2:
						alert('Fail, Student List Not Found');
						break;
					case 3:
						alert('Fail,' + _json.data);
						break;
					case 4:
						alert('Fail, Exam Paper Not Found');
						break;
					case 4:
						alert('Inner Query Error, Please See Console');
						break;
					case 999:
						alert('Master Admin Server Not Found');
						break;
					default:
						alert('Opration Fail Try Again');
						break;
				}
			} else {
				alert('Master Server Error');
			}
		},
		error: () => {
			removeLoading();
			alert('Server Error');
			console.log(error);
		},
	});
	// 	}
	// });
}
// function uploadExamToMasert(_this, pub_id) {
// 	confirmCall('This Will Upload Exams Details To Master Server,Do You Want To Continue ?', function ($this_data, type, ev) {
// 		if (type == 'yes') {
// 			prompt('Enter Authentication Password', '*******', 'password', function (value) {
// 				if (parseInt(value, 10) !== cc) {
// 					alert('Invalid Password !!!!');
// 					return false;
// 				}
// 				addLoading();
// 				$.post(getUrl() + 'save-exams-to-master', { pub_id: pub_id }, function (data, status) {
// 					console.log(data);
// 					removeLoading();

// 					if (status == 'success') {
// 						var _json = data;
// 						switch (_json.call) {
// 							case 1:
// 								alert('Uploaded Exam Successfully.');
// 								//$(_this).addClass('hide');
// 								getAllDoneExams();
// 								break;
// 							case 2:
// 								alert('Fail, Student List Not Found');
// 								break;
// 							case 3:
// 								alert('Fail,' + _json.data);
// 								break;
// 							case 4:
// 								alert('Fail, Exam Paper Not Found');
// 								break;
// 							case 4:
// 								alert('Inner Query Error, Please See Console');
// 								break;
// 							case 999:
// 								alert('Master Admin Server Not Found');
// 								break;
// 							default:
// 								alert('Opration Fail Try Again');
// 								break;
// 						}
// 					} else {
// 						alert('Master Server Error');
// 					}
// 				}).error(function (error) {
// 					removeLoading();
// 					alert('Server Error');
// 					console.log(error);
// 				});
// 			});
// 		}
// 	});
// }

function removeThisExam(pub_id, batch_no) {
	addLoading();
	$.post(getUrl() + 'clear-this-exam', { pub_id: pub_id, batch_no: batch_no }, function (data, status) {
		removeLoading();
		if (status == 'success') {
			var _json = data;
			switch (_json.call) {
				case 0:
					alert('Fail.. Try Again.');
					break;
				case 1:
					alert('Exam Session Cleared Successfully.');
					getAllDoneExams();
					break;
				default:
					alert('Server Error, Try Again');
					break;
			}
		}
	});
}

function getAllDoneExams() {
	$.ajax({
		url: getUrl() + 'get-done-exam-list',
		success: ({ data, call }) => {
			if (call == 1) {
				LoadDoneExamList(data, '#done_exams_list_tbody');
			} else {
				$('#done_exams_list_tbody').html('<tr><td colspan="5" style="text-align:center">No Exams Available</td></tr>');
			}
		},
		error: (err) => {
			alert('Server Error... Please See Console');
			console.log(err, '==err==');
		},
	});

	// $.get(getUrl() + 'get-done-exam-list', function (data, status) {
	// 	if (status == 'success') {
	// 		var _json = data
	// 		if (_json.call == 1) {
	// 			LoadDoneExamList(_json.data, '#done_exams_list_tbody')
	// 		} else {
	// 			$('#done_exams_list_tbody').html(
	// 				'<tr><td colspan="5" style="text-align:center">No Exams Available</td></tr>'
	// 			)
	// 		}
	// 	} else {
	// 		alert('Remote Server Error')
	// 	}
	// }).error(function (error) {
	// 	alert('Server Error... Please See Console')
	// 	console.log(error)
	// })
}

function LoadDoneExamList(list, table_name) {
	console.log(list, '==list==');
	$('#tab').addClass('active');
	$('#home').removeClass('active');
	if (list.length > 0) {
		$(table_name).html('');
		list.forEach(function (value, index) {
			var _tr = '<tr>';
			_tr += '<td>' + (index + 1) + '</td>' + '<td>' + value.mt_name + '</td>';
			_tr += '<td>' + value.mt_test_time + ' Min</td>' + '<td>Batch-' + value.tm_allow_to + '</td>';

			if (value.is_uploaded == '1') {
				_tr +=
					'<td><label type="button" class="label-info btn-sm" style="margin-right:10px;">Exam Uploaded !</label>' +
					'<button type="button" class="btn btn-success btn-sm" style="margin-right:10px;" onclick="removeThisExam(' +
					value.id +
					',' +
					value.tm_allow_to +
					')">Clear Exam Session</button>' +
					'</tr>';
			} else {
				_tr +=
					'<td><button type="button" class="btn btn-primary btn-sm" onclick="uploadExamToMasert(this,' +
					value.id +
					')">Upload Exam</button></td>' +
					'</tr>';
			}
			$(table_name).append(_tr);
		});
	} else {
		$(table_name).html('<tr><td colspan="5" style="text-align:center"> No Exams Found</td></tr>');
	}
}

function checkAuth(cb) {
	showModal('#pass-auth-modal');
	let isAuth = false;

	function _isAuth() {
		let pass = $('#auth-password');
		if (+pass.val() !== cc) {
			console.log('unauthorized');
			isAuth = false;
			pass.val('');
			$(document).off('click', '#auth-submit-btn', _isAuth);
			cb(isAuth);
			checkAuth(cb);
			return;
		} else {
			isAuth = true;
			pass.val('');
			hideModal('#pass-auth-modal');
			cb(isAuth);
			$(document).off('click', '#auth-submit-btn', _isAuth);
			return;
		}
	}

	$(document).on('click', '#auth-submit-btn', _isAuth);
}
