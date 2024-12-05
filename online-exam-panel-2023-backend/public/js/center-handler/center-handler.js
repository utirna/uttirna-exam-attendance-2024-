// upload center layout

console.log(session);

$(document).on('click', '#upload-layout-btn', async function (e) {
	// this uploads the lab layout in form filling server
	e.preventDefault();

	addLoading();

	try {
		let layout = storedLayouts.find((el) => el.id == +$('#saved-layouts').val());

		let _uploadLabLayoutRes = await fetch(session.IP_FORM_FILLING + 'node-manager/upload-lab-layout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ layout }),
		});

		let _data = await _uploadLabLayoutRes.json();

		removeLoading();
		if (_data.call == 1) {
			$.notify('Success:' + _data.message, 'success');
		}

		if (_data.call == 2) {
			$.notify('Error:' + _data.message, 'error');
		}

		if (_data.call == 0) {
			$.notify('Error:' + 'Could not create nodes', 'error');
		}
	} catch (error) {
		if (error.message == 'fetch failed') {
			$.notify('Error: Unable to connect form filling server', 'error');
		} else {
			$.notify('Error:' + error?.message || 'Server errror', 'error');
		}
	}
});

$(document).on('click', '#reset-layout-btn', async function (e) {
	// this resets the lab layout in form filling server
	// clear all node details of the layout on form filling server
	e.preventDefault();
	addLoading();
	try {
		let layout = storedLayouts.find((el) => el.id == +$('#saved-layouts').val());
		console.log(layout);

		if (!layout) {
			$.notify('Error: ', 'Invalid layout', 'error');
		}

		let _res = await fetch(session.IP_FORM_FILLING + '/node-manager/reset-lab-layout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ layout }),
		});

		let { call, message } = await _res.json();

		removeLoading();
		switch (call) {
			case 999:
				$.notify('Error' + message, 'error');
				break;

			case 0:
				$.notify('Error' + message, 'error');
				break;

			case 1:
				$.notify('Success: ' + message, 'success');
				break;

			default:
				$.notify('Something went wrong');
		}
	} catch (error) {
		if (error.message == 'Failed to fetch') {
			$.notify('Unable to connnect form filling server', 'error');
		} else {
			$.notify(error.message, 'error');
		}
	}
});

$(document).on('keypress', '#centerName', function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == '13' && $(this).val() !== '') {
		inputDepartment;

		rotaHandler.centerDetails.centerName = $(this).val();
		rotaHandler.printMasterTree();
	}
});

// print flow chart
$(document).on('click', '#print-layout', function (e) {
	e.preventDefault();
	window.print();
});

$(document).on('click', '#doneViewFinal', function (event) {
	if (rotaHandler.centerDetails.departmentDetails.length == 0) {
		$.notify('No Center Details Passed', 'error');
		return false;
	}

	$('#mainGraph').addClass('d-none');
	$('#finalGraph').removeClass('d-none');
	$('.action-btn').toggleClass('d-none');
	$('#center').html(rotaHandler.centerDetails.centerName + ' Lab Layout');
	rotaHandler.printHirarchiTree();
});
$(document).on('click', '#back', function (event) {
	$('#mainGraph').removeClass('d-none');
	$('#finalGraph').addClass('d-none');
	$('.action-btn').toggleClass('d-none');
});

$(document).on('click', '.trash-hand', function (event) {
	var type = $(this).data('name');
	var d = Number($('.tbodyDepartment').val());
	var f = Number($('.tbodyFloor').val());
	var l = Number($('.tbodyLab').val());

	switch (type) {
		case 'saved-layouts':
			let layoutId = $('#saved-layouts').val();
			if (layoutId == '-1') return;
			rotaHandler.deleteLayout(layoutId);
			break;
		case 'dept':
			if (d == -1) {
				return false;
			}
			rotaHandler.tdIndex.floor = -1;
			rotaHandler.tdIndex.lab = -1;
			rotaHandler.tdIndex.dept = -1;
			$('.tbodyDepartment').val('-1');
			$('.tbodyFloor').val('-1');
			$('.tbodyLab').val('-1');
			$('.tNode').val('');
			$('.uNode').val('');
			$('.bfNode').val('');
			rotaHandler.centerDetails.departmentDetails.splice(d, 1);
			rotaHandler.manageDept();
			break;
		case 'floor':
			if (f == -1) {
				return false;
			}
			rotaHandler.tdIndex.floor = -1;
			rotaHandler.tdIndex.lab = -1;
			$('.tbodyFloor').val('-1');
			$('.tbodyLab').val('-1');
			$('.tNode').val('');
			$('.uNode').val('');
			$('.bfNode').val('');
			rotaHandler.centerDetails.departmentDetails[d].floorDetails.splice(f, 1);
			rotaHandler.manageFloor(rotaHandler.tdIndex.dept);
			break;
		case 'lab':
			if (l == -1) {
				return false;
			}
			rotaHandler.tdIndex.lab = -1;
			$('.tbodyLab').val('-1');
			$('.tNode').val('');
			$('.uNode').val('');
			$('.bfNode').val('');
			rotaHandler.centerDetails.departmentDetails[d].floorDetails[f].labDetails.splice(l, 1);
			rotaHandler.manageLab(rotaHandler.tdIndex.dept, rotaHandler.tdIndex.floor);
			break;
	}
});
$(document).on('keypress', '#inputDepartment', function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == '13' && $(this).val() !== '') {
		if (rotaHandler.centerDetails.centerName === '') {
			$('#centerName').notify('Please Enter Center Name', {
				autoHideDelay: 2500,
			});
			return false;
		}
		var data = {
			name: $(this).val(),
			floorDetails: [],
		};
		rotaHandler.centerDetails.departmentDetails.push(data);
		rotaHandler.manageDept();
		$(this).val('');
	}
});
$(document).on('keypress', '#inputFloor', function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == '13' && $(this).val() !== '') {
		if (rotaHandler.tdIndex.dept == -1) {
			$('.tbodyDepartment').notify('Please Select Department', {
				autoHideDelay: 2500,
			});
			return false;
		}

		var data = {
			name: $(this).val(),
			labDetails: [],
		};
		var index = rotaHandler.tdIndex.dept;
		rotaHandler.centerDetails.departmentDetails[index].floorDetails.push(data);
		rotaHandler.manageFloor(index);
		$(this).val('');
	}
});
$(document).on('keypress', '#inputLab', function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == '13' && $(this).val() !== '') {
		if (rotaHandler.tdIndex.floor == -1) {
			$('.tbodyFloor').notify('Please Select Floor', {
				autoHideDelay: 2500,
			});
			return false;
		}
		var data = {
			name: $(this).val(),
			totalNumberNode: 0,
			userNode: 0,
			buffernode: 0,
		};
		var dept_index = rotaHandler.tdIndex.dept;
		var floor_index = rotaHandler.tdIndex.floor;
		rotaHandler.centerDetails.departmentDetails[dept_index].floorDetails[floor_index].labDetails.push(data);
		rotaHandler.manageLab(dept_index, floor_index);
		$(this).val('');
	}
});
$(document).on('keypress', '.tNode', function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == '13' && $(this).val() !== '') {
		if (rotaHandler.tdIndex.lab == -1) {
			$('.tbodyLab').notify('Please Select Lab', { autoHideDelay: 2500 });
			return false;
		}
		if (isNaN($(this).val())) {
			$('.tNode').notify('Invalid Node Number', { autoHideDelay: 2500 });
			return false;
		}
		var tNode = Number($(this).val());
		var bfNode = Math.round((tNode * 10) / 100);
		rotaHandler.centerDetails.departmentDetails[rotaHandler.tdIndex.dept].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].totalNumberNode = tNode;
		rotaHandler.centerDetails.departmentDetails[rotaHandler.tdIndex.dept].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].userNode = tNode - bfNode;
		rotaHandler.centerDetails.departmentDetails[rotaHandler.tdIndex.dept].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].buffernode = bfNode;
		rotaHandler.manageNodeDetails(rotaHandler.tdIndex.dept, rotaHandler.tdIndex.floor, rotaHandler.tdIndex.lab);
	}
});

$(document).on('change', '.tbodyDepartment', function (event) {
	rotaHandler.tdIndex.floor = -1;
	rotaHandler.tdIndex.lab = -1;
	rotaHandler.tdIndex.dept = Number($(this).val());
	if (rotaHandler.tdIndex.dept !== -1) rotaHandler.manageFloor(rotaHandler.tdIndex.dept);
});

$(document).on('change', '.tbodyFloor', function (event) {
	rotaHandler.tdIndex.lab = -1;
	rotaHandler.tdIndex.floor = Number($(this).val());
	if (rotaHandler.tdIndex.floor !== -1) rotaHandler.manageLab(rotaHandler.tdIndex.dept, rotaHandler.tdIndex.floor);
});
$(document).on('change', '.tbodyLab', function (event) {
	rotaHandler.tdIndex.lab = Number($(this).val());
	if (rotaHandler.tdIndex.lab !== -1) rotaHandler.manageNodeDetails(rotaHandler.tdIndex.dept, rotaHandler.tdIndex.floor, rotaHandler.tdIndex.lab);
});

$(document).on('click', '#saveCenter', function (e) {
	e.preventDefault();
	console.log(rotaHandler.centerDetails);
	rotaHandler.saveCenterDetails();
});
$(document).on('change', '#saved-layouts', function () {
	let id = $(this).val();
	let layout = storedLayouts.find((el) => {
		return el.id == id;
	});
	rotaHandler.centerDetails.centerName = layout.center_name;
	rotaHandler.centerDetails.departmentDetails = JSON.parse(layout.department_details);
	console.log(rotaHandler.centerDetails);

	rotaHandler.printMasterTree(rotaHandler.centerDetails);
});

$(document).ready(() => {
	renderSavedLayoutsDropdown(storedLayouts);
});

function renderSavedLayoutsDropdown(list) {
	let _html = list.map((el) => {
		return `<option value='${el.id}'>${el.center_name}</option>`;
	});
	_html = `<option value='-1'>-- Select Layout --</option> ` + _html;
	$('#saved-layouts').html(_html);
}

var rotaHandler = {
	tdIndex: {
		dept: -1,
		floor: -1,
		lab: -1,
	},
	centerDetails: {
		centerName: '',
		departmentDetails: [],
	},
	department: {
		departmentName: '',
		floorDetails: [],
	},
	floor: {
		name: '',
		labDetails: [],
	},
	lab: {
		name: '',
		totalNumberNode: 0,
		userNode: 0,
		buffernode: 0,
	},
	manageDept: function () {
		var list = rotaHandler.centerDetails.departmentDetails;
		rotaHandler.printTablesNodes('.tbodyDepartment', list, rotaHandler.tdIndex.dept, 'tdDept');
		rotaHandler.printMasterTree();
		$(this).val('');
	},
	manageNodeDetails: function (d_index, f_index, l_index) {
		var currentLab = [];
		if (d_index !== -1 && f_index !== -1 && f_index !== -1) {
			var currentLab = rotaHandler.centerDetails.departmentDetails[d_index].floorDetails[f_index].labDetails[l_index];
			$('.tNode').val(currentLab.totalNumberNode);
			$('.uNode').val(currentLab.userNode);
			$('.bfNode').val(currentLab.buffernode);
			rotaHandler.printMasterTree();
		} else {
			$('.tNode').val('');
			$('.uNode').val('');
			$('.bfNode').val('');
			rotaHandler.printMasterTree();
		}
	},
	manageFloor: function (index) {
		var list = [];
		if (index !== -1) list = rotaHandler.centerDetails.departmentDetails[index].floorDetails;

		rotaHandler.printTablesNodes('.tbodyFloor', list, rotaHandler.tdIndex.floor, 'tdFloor');
		rotaHandler.printMasterTree();
		$(this).val('');
	},
	manageLab: function (dept_index, floor_index) {
		var list = [];
		if (floor_index !== -1 && dept_index !== -1)
			var list = rotaHandler.centerDetails.departmentDetails[dept_index].floorDetails[floor_index].labDetails;
		rotaHandler.printTablesNodes('.tbodyLab', list, rotaHandler.tdIndex.lab, 'tdLab');
		rotaHandler.printMasterTree();
		$(this).val('');
	},
	printTablesNodes: function (appendTo, list, matchIndex, classNam) {
		$(appendTo).html(`<option value="-1">----Select-----</option>`);
		var tdActive = 'tdActive';
		$.each(list, function (index, value) {
			tdActive = matchIndex == index ? 'selected' : '';
			$(appendTo).append(`<option value="${index}" ${tdActive}>${value.name}</option>`);
		});
		rotaHandler.printMasterTree();
	},
	saveCenterDetails: async function () {
		var data = {
			centerName: this.centerDetails.centerName,
			departmentDetails: JSON.stringify(this.centerDetails.departmentDetails),
		};
		console.log(data);
		let _response = await fetch('/admin/center-handler/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		let { message, success } = await _response.json();
		if (success) {
			$.notify(message, 'success');
		}
	},
	deleteLayout: async function (id) {
		console.log(id);
		let _response = await fetch('/admin/center-handler/new', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		});
		let { message, success } = await _response.json();
		if (success) {
			$.notify(message, 'success');
			storedLayouts = storedLayouts.filter((el) => {
				return el.id != id;
			});
			renderSavedLayoutsDropdown(storedLayouts);
		}
	},
	printMasterTree: function (data = rotaHandler.centerDetails) {
		var total = {
			t: 0,
			u: 0,
			d: 0,
		};

		data = rotaHandler.centerDetails;
		console.log(data, 'print data');

		var _tr = `<ul class="tree">`;
		_tr += `<li><a id="centerText">${data.centerName}</a>`;
		if (data.departmentDetails.length > 0) {
			_tr += `<ul>`;
			$.each(data.departmentDetails, function (index, value) {
				_tr += `<li><a>${value.name}</a>`;
				var floorsList = data.departmentDetails[index].floorDetails;
				if (floorsList.length !== 0) {
					_tr += `<ul>`;
					$.each(floorsList, function (f_index, f_value) {
						_tr += `<li><a>${f_value.name}</a>`;
						var labList = floorsList[f_index].labDetails;
						if (labList.length !== 0) {
							_tr += `<ul>`;
							$.each(labList, function (l_index, l_value) {
								total.t += l_value.totalNumberNode;
								total.u += l_value.userNode;
								total.d += l_value.buffernode;
								var lab =
									rotaHandler.tdIndex.lab == l_index && rotaHandler.tdIndex.floor == f_index && rotaHandler.tdIndex.dept == index ? 'lab' : '';
								_tr += `<li class="${lab}"><a>${l_value.name}</a>
									<ul>
									 <li class="${lab}">
									  <a class="text-primary">Total:${l_value.totalNumberNode}</a>
									  <a class="text-success">User:${l_value.userNode}</a>
									  <a class="text-danger">Buffer:${l_value.buffernode}</a>
									 </li>
									</ul>
								</li>`;
							});
							_tr += `</ul>`;
						}
						_tr += `</li>`;
					});
					_tr += `</ul>`;
				}
				_tr += `</li>`;
			});
			_tr += `</ul>`;
		}
		_tr += `</li></ul>`;
		$('#masterTree').html(_tr);
		$('#centerText').append(
			"&nbsp;<span class='text-success'>[" +
				total.t +
				"</span><span class='text-primary'> - " +
				total.u +
				"</span><span class='text-danger'> - " +
				total.d +
				']</span>'
		);
		/*	`

		<li><a>Parent 2</a></li>
		<li> <a>Parent 3</a>
		<ul>
			<li> <a>1st Child of 3</a>
			<ul>
				<li><a>1st grandchild</a></li>
				<li><a>2nd grandchild</a></li>
			</ul>
			</li>
			<li><a>2nd Child of 3</a></li>
			<li><a>3rd Child of 3</a></li>
		</ul>
		</li>
		<li> <a>Parent 4</a>
		<ul>
			<li><a>Parent 4's only child</a></li>
		</ul>
		</li>
	</ul>`*/
	},
	printHirarchiTree: function () {
		var total = {
			t: 0,
			u: 0,
			d: 0,
		};

		var data = rotaHandler.centerDetails;
		$('#college-name').text(data.centerName);
		var _tr = `<ul>`;
		_tr += `<li><span class="tf-nc text-success" id="centerText1">${data.centerName}</span>`;
		if (data.departmentDetails.length > 0) {
			_tr += `<ul>`;
			$.each(data.departmentDetails, function (index, value) {
				_tr += `<li><span class="tf-nc m-0 p-1">${value.name}</span>`;
				var floorsList = data.departmentDetails[index].floorDetails;
				if (floorsList.length !== 0) {
					_tr += `<ul>`;
					$.each(floorsList, function (f_index, f_value) {
						_tr += `<li><span class="tf-nc m-0 p-1">${f_value.name}</span>`;
						var labList = floorsList[f_index].labDetails;
						if (labList.length !== 0) {
							_tr += `<ul>`;
							$.each(labList, function (l_index, l_value) {
								total.t += l_value.totalNumberNode;
								total.u += l_value.userNode;
								total.d += l_value.buffernode;
								var lab = rotaHandler.tdIndex.lab == l_index ? 'lab' : '';
								_tr += `<li class="${lab}"><span class="tf-nc m-0 p-1">${l_value.name}</span>
									<ul>
									 <li class="${lab}">
									  <span class="tf-nc m-0 p-1">Total:${l_value.totalNumberNode}<br>User:${l_value.userNode}<br>Buffer:${l_value.buffernode}</span>
									 </li>
									</ul>
								</li>`;
							});
							_tr += `</ul>`;
						}
						_tr += `</li>`;
					});
					_tr += `</ul>`;
				}
				_tr += `</li>`;
			});
			_tr += `</ul>`;
		}
		_tr += `</li></ul>`;
		$('#printHirarchiTree').html(_tr);

		$('#centerText1').append(
			"&nbsp;<span class='text-success'>[" +
				total.t +
				"</span><span class='text-primary'> - " +
				total.u +
				"</span><span class='text-danger'> - " +
				total.d +
				']</span>'
		);

		/*	`

		<li><a>Parent 2</a></li>
		<li> <a>Parent 3</a>
		<ul>
			<li> <a>1st Child of 3</a>
			<ul>
				<li><a>1st grandchild</a></li>
				<li><a>2nd grandchild</a></li>
			</ul>
			</li>
			<li><a>2nd Child of 3</a></li>
			<li><a>3rd Child of 3</a></li>
		</ul>
		</li>
		<li> <a>Parent 4</a>
		<ul>
			<li><a>Parent 4's only child</a></li>
		</ul>
		</li>
	</ul>

	#container_2 {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
}
	`*/
	},
};
