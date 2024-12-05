$(document).on("keypress", "#centerName", function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == "13") {
		rotaHandler.centerDetails.centerName = $(this).val();
		rotaHandler.printMasterTree();
	}
});
$(document).on("keypress", "#inputDepartment", function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == "13") {
		var data = {
			name: $(this).val(),
			floorDetails: [],
		};
		rotaHandler.centerDetails.departmentDetails.push(data);
		var list = rotaHandler.centerDetails.departmentDetails;
		rotaHandler.printTablesNodes(
			".tbodyDepartment",
			list,
			rotaHandler.tdIndex.dept,
			"tdDept"
		);
		rotaHandler.printMasterTree();
		$(this).val("");
	}
});
$(document).on("keypress", "#inputFloor", function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == "13") {
		if (rotaHandler.tdIndex.dept == -1) {
			alert("Please Select Department");
			return false;
		}

		var data = {
			name: $(this).val(),
			labDetails: [],
		};
		var index = rotaHandler.tdIndex.dept;
		rotaHandler.centerDetails.departmentDetails[index].floorDetails.push(
			data
		);
		rotaHandler.manageFloor(index);
		$(this).val("");
	}
});
$(document).on("keypress", "#inputLab", function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == "13") {
		if (rotaHandler.tdIndex.floor == -1) {
			alert("Please Select Floor");
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
		rotaHandler.centerDetails.departmentDetails[dept_index].floorDetails[
			floor_index
		].labDetails.push(data);
		rotaHandler.manageLab(dept_index, floor_index);
		$(this).val("");
	}
});
$(document).on("keypress", ".tNode", function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode == "13") {
		if (rotaHandler.tdIndex.lab == -1) {
			alert("Please Select Lab");
			return false;
		}
		if (isNaN($(this).val())) {
			alert("Invalid Node Number");
			return false;
		}
		var tNode = Number($(this).val());
		var bfNode = Math.round((tNode * 10) / 100);
		rotaHandler.centerDetails.departmentDetails[
			rotaHandler.tdIndex.dept
		].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].totalNumberNode = tNode;
		rotaHandler.centerDetails.departmentDetails[
			rotaHandler.tdIndex.dept
		].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].userNode = tNode - bfNode;
		rotaHandler.centerDetails.departmentDetails[
			rotaHandler.tdIndex.dept
		].floorDetails[rotaHandler.tdIndex.floor].labDetails[
			rotaHandler.tdIndex.lab
		].buffernode = bfNode;
		rotaHandler.manageNodeDetails(
			rotaHandler.tdIndex.dept,
			rotaHandler.tdIndex.floor,
			rotaHandler.tdIndex.lab
		);
	}
});

$(document).on("click", ".tdDept", function (event) {
	rotaHandler.tdIndex.floor = -1;
	rotaHandler.tdIndex.lab = -1;
	rotaHandler.tdIndex.dept = Number($(this).data("index"));
	$(".tdDept").removeClass("tdActive");
	$(this).addClass("tdActive");
	rotaHandler.manageFloor(rotaHandler.tdIndex.dept);
});

$(document).on("click", ".tdFloor", function (event) {
	rotaHandler.tdIndex.lab = -1;
	rotaHandler.tdIndex.floor = Number($(this).data("index"));
	$(".tdFloor").removeClass("tdActive");
	$(this).addClass("tdActive");
	rotaHandler.manageLab(rotaHandler.tdIndex.dept, rotaHandler.tdIndex.floor);
});
$(document).on("click", ".tdLab", function (event) {
	rotaHandler.tdIndex.lab = Number($(this).data("index"));
	$(".tdLab").removeClass("tdActive");
	$(this).addClass("tdActive");
	rotaHandler.manageNodeDetails(
		rotaHandler.tdIndex.dept,
		rotaHandler.tdIndex.floor,
		rotaHandler.tdIndex.lab
	);
});

var rotaHandler = {
	tdIndex: {
		dept: -1,
		floor: -1,
		lab: -1,
	},
	centerDetails: {
		centerName: "",
		departmentDetails: [],
	},
	department: {
		departmentName: "",
		floorDetails: [],
	},
	floor: {
		name: "",
		labDetails: [],
	},
	lab: {
		name: "",
		totalNumberNode: 0,
		userNode: 0,
		buffernode: 0,
	},
	manageNodeDetails: function (d_index, f_index, l_index) {
		var currentLab =
			rotaHandler.centerDetails.departmentDetails[d_index].floorDetails[
				f_index
			].labDetails[l_index];
		$(".tNode").val(currentLab.totalNumberNode);
		$(".uNode").val(currentLab.userNode);
		$(".bfNode").val(currentLab.buffernode);
		rotaHandler.printMasterTree();
	},
	manageFloor: function (index) {
		var list =
			rotaHandler.centerDetails.departmentDetails[index].floorDetails;
		rotaHandler.printTablesNodes(
			".tbodyFloor",
			list,
			rotaHandler.tdIndex.floor,
			"tdFloor"
		);
		rotaHandler.printMasterTree();
		$(this).val("");
	},
	manageLab: function (dept_index, floor_index) {
		var list =
			rotaHandler.centerDetails.departmentDetails[dept_index]
				.floorDetails[floor_index].labDetails;
		rotaHandler.printTablesNodes(
			".tbodyLab",
			list,
			rotaHandler.tdIndex.lab,
			"tdLab"
		);
		rotaHandler.printMasterTree();
		$(this).val("");
	},
	printTablesNodes: function (appendTo, list, matchIndex, classNam) {
		$(appendTo).html("");
		var tdActive = "tdActive";
		$.each(list, function (index, value) {
			tdActive = matchIndex == index ? "tdActive" : "";
			$(appendTo).append(
				`<tr>
					<td class="hand ${classNam} ${tdActive}" data-index="${index}"><span>${value.name}</span></td>
				</tr>`
			);
		});
		rotaHandler.printMasterTree();
	},
	printMasterTree: function () {
		var data = rotaHandler.centerDetails;
		var _tr = `<ul class="tree">`;
		_tr += `<li><a>${data.centerName}</a>`;
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
								_tr += `<li><a>${l_value.name}</a>
									<ul>
									 <li>
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
		$("#masterTree").html(_tr);
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
};
