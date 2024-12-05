$(document).ready(() => {
	function handleFetchError(err) {
		if (err?.status == 0) {
			$.notify('Unable to connect to form filling server', {
				autoHide: false,
				clickToHide: false,
			});
		}
		$.notify(err?.message || 'Error', 'error');
	}

	function getIpMacId() {
		// This functin gets ip and mac id from url parameters
		//- const params = new URLSearchParams(window.location.search)
		//- const mac_id = params.get('mac')
		//- const ip_add = params.get('ip')

		// for dev purpose the details are hard coded
		let mac_id = '10:00:00:00';
		let ip_add = '192.168.1.1';

		return {
			mac_id,
			ip_add,
		};
	}

	function checkCurrentPcRegistered() {
		/**
		 * Check if the currenct pc is registered already with its mac id
		 * If (pc is registered and exams are available) then redirect to login page
		 * */

		let ipmac = getIpMacId();

		if (!ipmac.mac_id) {
			$.notify('Error: ' + 'Unable to get mac id', 'error');
			return false;
		}

		//  macId: ipmac.mac_id
		$.ajax({
			url: ip_form_filling + 'node-manager/check-is-pcregistered',
			type: 'POST',
			data: { macId: ipmac.mac_id },
			success: function (data) {
				if (data.data.length >= 1 && $('#exams').val()) {
					$.notify(data.message, 'warn');
					$.notify('Redirecting you to exam login page', 'warn');
					setTimeout(() => {
						checkExamLink();
					}, 3000);
				}
			},
			error: function (error) {
				handleFetchError(error.responseJSON);
			},
		});
	}

	$(document).on('change', '#department', async function () {
		getFloorData($(this).val());
	});

	$(document).on('change', '#floor', async function () {
		getLabsData($(this).val());
	});

	function getDepartmentDetails() {
		$.ajax({
			url: ip_form_filling + 'node-manager/node-departments',
			type: 'POST',
			data: { c_name: _session.c_name },
			success: function (data) {
				console.log(data);
				if (data.data.departments.length == 0) {
					$.notify('No departments found', 'warn', {
						autoHide: false,
					});
					return false;
				}
				setDepartments(data.data.departments);
			},
			error: function (err) {
				handleFetchError(err);
			},
		});
	}

	function setDepartments(departments) {
		var _departmentHtml;
		var _departmentEl = $('#department');
		if (departments.length == 0) {
			return;
		}
		// prettier-ignore
		if (departments.length == 1) {
			_departmentHtml += '<option value="' + departments[0] + '"+ selected>' + departments[0] + '</option>';
			_departmentEl.append(_departmentHtml);
			getFloorData(_departmentEl.val());
		} else {
			$.each(departments, function (idx, el) {
				_departmentHtml += '<option value="' + el + '"+ selected>' + el + '</option>';
			});
			_departmentEl.append(_departmentHtml);
		}
	}

	function getFloorData(department) {
		if (!department) {
			$.notify('Department not selected', 'warn');
			return false;
		}

		$.ajax({
			url: ip_form_filling + 'node-manager/node-floors',
			type: 'POST',
			data: { department: department },
			success: function (data) {
				if (data.data.floors.length == 0) {
					$.notify('Floors data not found', 'warn');
					return false;
				}
				setFloors(data.data.floors);
			},
			error: function (err) {
				handleFetchError(err);
			},
		});
	}

	function setFloors(floors) {
		var _floorHtml = "<option value='' selected>-- Select Floor --</option>";
		if (floors.length == 0) {
			$.notify('No floors found', 'warn');
			return;
		}
		// prettier-ignore
		if (floors.length == 1) {
			_floorHtml += '<option value="' + floors[0] + '" selected>' + floors[0] + '</option>';
			$('#floor').html(_floorHtml);
			getLabsData($('#floor').val());
		} else {
			$.each(floors, function (idx, el) {
				_floorHtml += '<option value="' + el + '">' + el + '</option>';
			});
			$('#floor').html(_floorHtml);
		}
	}

	async function getLabsData(floor) {
		if (!floor) {
			$.notify('Floor not selected', 'warn');
			return false;
		}
		var department = $('#department').val();

		$.ajax({
			url: ip_form_filling + 'node-manager/node-labs',
			type: 'POST',
			data: { department: department, floor: floor },
			success: function (data) {
				if (data.data.labs.length == 0) {
					$.notify('Labs data not found', 'warn');
					return false;
				}
				setLabs(data.data.labs);
			},
			error: function (err) {
				handleFetchError(err);
			},
		});
	}

	function setLabs(labs) {
		let _html = '<option value="" selected>-- Select Lab --</option>';
		if (labs.length == 0) {
			return;
		}

		// prettier-ignore
		if (labs.length == 1) {
			_html += '<option value="' + labs[0] + '" selected> ' + labs[0] + '</option>';
		} else {
			labs.forEach((el) => {
				_html += '<option value="' + el + '"> ' + el + '</option>';
			});
		}

		$('#labs').html(_html);
	}

	$(document).on('click', '#get-node-list-btn', function (e) {
		e.preventDefault();
		getNodeComputersList();
		// await runInterval();
	});

	async function getNodeComputersList() {
		let department = $('#department').val();
		let floor = $('#floor').val();
		let lab = $('#labs').val();
		let exam = $('#exams').val();

		if (!department) {
			$.notify('Please select department', 'warn');
			return;
		}

		if (!floor) {
			$.notify('Please select floor', 'warn');
			return;
		}

		if (!lab) {
			$.notify('Please select lab', 'warn');
			return;
		}

		if (!exam) {
			$.notify('Please select exam', 'warn');
			return;
		}

		$.ajax({
			url: ip_form_filling + 'node-manager/node-computers',
			type: 'POST',
			data: { department: department, floor: floor, lab: lab },
			success: function (data) {
				if (data?.data?.computers?.length === 0) {
					$.notify('No nodes found', 'warn');
					return false;
				}

				renderNodeComputers(data.data.computers);
				runInterval();
			},
			error: function (err) {
				handleFetchError(err);
			},
		});

		// let _nodeComputersRes = await fetch(
		// 	ip_form_filling + 'node-manager/node-computers',
		// 	{
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify({ department, floor, lab }),
		// 	}
		// );

		// let _nodeComputers = await _nodeComputersRes.json();
	}

	function renderNodeComputers(computers) {
		if (computers?.length == 0 || computers?.length == undefined) {
			$.notify('No computers found', 'warn');
			return;
		}

		// var _computerListHtml = computers.map((el) => {
		// 	var isRegistered = el.mac_id == null ? false : true;
		// 	// prettier-ignore
		// 	return `<button ${isRegistered ? 'disabled' : '' }
		// 									class='btn btn-primary computer-reg-btn
		// 									${isRegistered ? 'active' : 'idle'}'
		// 									data-node-data='${JSON.stringify(el)}'>
		// 							${el.pc_no}
		// 					</button>`
		// });

		var _computerListHtml = '';
		$.each(computers, function (idx, el) {
			var isRegistered = true;
			if (el.mac_id == null || el.mac_id == undefined) {
				isRegistered = false;
			}
			var isRegisteredClass = 'idle';
			var disabled = 'disabled';
			var nodeData = JSON.stringify(el);
			if (isRegistered) {
				isRegisteredClass = 'active';
				disabled = 'disabled';
			} else {
				isRegisteredClass = 'idle';
				disabled = '';
			}
			// prettier-ignore
			_computerListHtml += "<button "+disabled+" class='btn btn-primary computer-reg-btn "+ isRegisteredClass +  "' data-node-data='"+nodeData+"'> " +
														el.pc_no + 
													"</button>"
		});

		$('.computers-container').html(_computerListHtml);
	}

	$(document).on('click', '.computer-reg-btn', async function (e) {
		e.preventDefault();
		var nodeData = JSON.parse($(this).attr('data-node-data'));
		var id = nodeData.id;
		var pc_no = nodeData.pc_no;
		var ipmac = getIpMacId();

		var sendData = {
			id: id,
			pc_no: pc_no,
			mac_id: ipmac.mac_id,
			ip_add: ipmac.ip_add,
		};
		updateNodeDetails(sendData);
	});

	async function updateNodeDetails(data) {
		// var _updateNodeDetailsRes = await fetch(
		// 	ip_form_filling + 'node-manager/update-node-details',
		// 	{
		// 		method: 'PUT',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify(data),
		// 	}
		// );
		// var _data = await _updateNodeDetailsRes.json();
		// var { message, status, data: __data } = _data;
		// switch (status) {
		// 	case 200:
		// 		$.notify(message, 'success');
		// 		checkExamLink();
		// 		// getNodeComputersList()
		// 		return false;
		// 	case 400:
		// 		$.notify(message, 'error');
		// 		return false;
		// 	case 409:
		// 		$.notify(
		// 			message +
		// 				` in center ${__data[0].center_name}, department ${__data[0].department}, floor ${__data[0].floor}, lab ${__data[0].lab}`,
		// 			{
		// 				autoHide: false,
		// 				position: 'right bottom',
		// 				className: 'warn',
		// 			}
		// 		);
		// 		break;
		// }

		$.ajax({
			url: ip_form_filling + 'node-manager/update-node-details',
			type: 'PUT',
			data: data,
			success: function (data) {
				var message = data.message;
				var status = data.status;

				if (status == 200) {
					$.notify(message, 'success');
					checkExamLink();
					// getNodeComputersList()
					return false;
				}
			},
			error: function (err) {
				var status = err.status;
				var message = err.responseJSON.message;

				if (status == 400) {
					$.notify(message + '1', 'error');
					return false;
				}
				if (err.status == 409) {
					var __data = err.responseJSON.data[0];
					$.notify('Conflict');

					$.notify(message + ` in center ${__data.center_name}, department ${__data.department}, floor ${__data.floor}, lab ${__data.lab}`, {
						autoHide: false,
						position: 'right bottom',
						className: 'warn',
					});
				}
				handleFetchError(err);
			},
		});
	}

	var NODE_LIST_REFRESH_INTERVAL = null;
	function runInterval() {
		clearInterval(NODE_LIST_REFRESH_INTERVAL);
		NODE_LIST_REFRESH_INTERVAL = setInterval(() => {
			getNodeComputersList();
		}, 10000);
	}

	var mockExamsHandler = {
		mockExamsList: null,

		_getExamList() {
			$.ajax({
				url: '/admin/mock-exams-list',
				success: function (data) {
					if (data.data.length == 0) {
						$.notify('No mock exams found', 'warn');
						return false;
					}

					mockExamsHandler.mockExamsList = data.data;
					mockExamsHandler._renderExams(data.data);
				},
				error: function (err) {
					handleFetchError(err);
				},
			});
		},

		_renderExams(_list) {
			if (_list.length == 0) {
				$.notify('No mock exams found', 'warn', {
					autoHide: false,
				});
				return false;
			}
			// prettier-ignore
			var _mockExamListHtml = '<option value="' + _list[0].id + '">' + _list[0].mt_name + '</option>';

			$('#exams').html(_mockExamListHtml);
		},
	};

	function checkExamLink() {
		/**
		 * This function automatically sets the exam link and skip exam link page.
		 * This is done for mock mode only.
		 * */
		var selectedExamId = $('#exams').val();

		var selectedExam = {};
		$.each(mockExamsHandler.mockExamsList, function (idx, el) {
			if (el.id == selectedExamId) {
				selectedExam = el;
			}
		});

		var _lnk = selectedExam.ptl_link_1;

		$('#exam-link').val(_lnk);

		$('#check-link-form-submit-btn').trigger('click');
	}

	(function () {
		checkCurrentPcRegistered();
		mockExamsHandler._getExamList();
		getDepartmentDetails();
	})();
});
