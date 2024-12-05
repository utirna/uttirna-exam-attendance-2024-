import { useState, alertjs, showBsModal } from '../alertjs.js';

// Inside inside public both
let relativeImagePath = `/pics/_images`;
let relativeSignPath = `/pics/_sign`;

let backendUrl = '';

//Const elements
const serverConnectionBtn = document.getElementById('check-server-connection-btn');

const serverAddressInputTag = document.getElementsByName('server-ip-address-name')[0];

const protocolSelectTag = document.getElementsByName('protocol')[0];

const portInputTag = document.getElementsByName('port')[0];

const contentSection = document.querySelectorAll('.content-section');

if (typeof _session !== undefined && _session) {
	try {
		if (!!_session.serverUrl) {
			let _protocol = _session.protocol;
			let _ipAddress = _session.ipAddress;
			let _port = _session.port;
			backendUrl = `${_protocol}://${_ipAddress}:${_port}`;

			document.getElementById('connnected-ip-container').innerText = _ipAddress;
		}
	} catch (error) {
		console.log(`error while constructin backend url : ${error}`);
	}
}

if (typeof _session !== undefined && _session) {
	if (!_session.serverUrl) {
		// $("#ipAddressModal").modal("show");
		showBsModal('ipAddressModal');
	} else {
		contentSection.forEach((section) => (section.style.display = 'block'));
	}
} else {
	contentSection.forEach((section) => (section.style.display = 'none'));
}

let candidateBtnActive = false;
let setCandidateBtnActive = (value) => (candidateBtnActive = value);

const candidateBtn = document.getElementById('candidate-view-active-btn');
const staffBtn = document.getElementById('staff-view-active-btn');

const toggleCandidateButtonActiveState = () => {
	const candidateViewContainer = document.getElementById('candidate-view-container');
	const staffViewContainer = document.getElementById('staff-view-container');
	if (candidateBtn && staffBtn) {
		if (candidateBtnActive) {
			candidateBtn.classList.add('active');
			staffBtn.classList.remove('active');
			candidateViewContainer.style.display = 'block';
			staffViewContainer.style.display = 'none';
		} else {
			candidateBtn.classList.remove('active');
			staffBtn.classList.add('active');
			candidateViewContainer.style.display = 'none';
			staffViewContainer.style.display = 'block';
		}
	}
};

setCandidateBtnActive(true);
toggleCandidateButtonActiveState();

candidateBtn?.addEventListener('click', () => {
	setCandidateBtnActive(true);
	toggleCandidateButtonActiveState();
});

staffBtn?.addEventListener('click', () => {
	setCandidateBtnActive(false);
	// console.log(candidateBtnActive);
	toggleCandidateButtonActiveState();
});

const handleCheckForServerConnection = async (ip_address, protocol, port) => {
	try {
		//TO DO
		const _url = '/connection/establish-connection';
		const _res = await fetch(_url, {
			method: 'POST',
			body: JSON.stringify({
				ip_address: ip_address,
				protocol: protocol,
				port: port,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const { _success, _data, _message, _error } = await _res.json();

		if (_success) {
			$('#ipAddressModal').modal('hide');

			document.querySelectorAll('.content-section').forEach((section) => (section.style.display = 'block'));

			if (_data && _data._session) {
				let _protocol = _data._session.protocol;
				let _ipAddress = _data._session.ipAddress;
				let _port = _data._session.port;
				backendUrl = `${_protocol}://${_ipAddress}:${_port}`;
				document.getElementById('connnected-ip-container').innerText = _ipAddress;
			}
		} else {
			alertjs.warning({
				t: 'Connection Error',
				m: 'Could not establish a connection ',
			});
		}
	} catch (err) {
		console.error('Error while checking for the connection', err);
	}
};

serverConnectionBtn?.addEventListener('click', () => {
	const serverIpAddress = serverAddressInputTag.value;
	const protocol = protocolSelectTag.value;
	const port = portInputTag.value;

	if (!serverIpAddress) {
		alert('Enter server ip address');
		return;
	}
	if (!port) {
		alert('Enter port number');
		return;
	}
	handleCheckForServerConnection(serverIpAddress, protocol, port);
});

// Webcam handler

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapshotDiv = document.getElementById('snapshot-div');

const ctx = canvas.getContext('2d');

let snapshotBlob = null;

// Function to check for vendor-prefixed getUserMedia
function getUserMediaPolyfill(constraints, successCallback, errorCallback) {
	const getUserMedia = navigator.mediaDevices?.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if (getUserMedia) {
		return getUserMedia
			.call(navigator.mediaDevices || navigator, constraints)
			.then(successCallback)
			.catch(errorCallback);
	} else {
		errorCallback(new Error('getUserMedia is not supported in this browser.'));
	}
}

// Start video stream
getUserMediaPolyfill(
	{ video: true, audio: false },
	(stream) => {
		video.srcObject = stream || window.URL.createObjectURL(stream);
		video.play();

		const videoContainer = document.getElementById('video-container');
		video.style.width = `${videoContainer.offsetWidth}px`;
		video.style.height = `${videoContainer.offsetHeight}px`;
	},
	(err) => {
		console.error(`An error occurred: ${err.name}`, err);
		// Handle different errors
		if (err.name === 'NotReadableError') {
			console.error('Camera is already in use.');
		} else if (err.name === 'NotAllowedError') {
			console.error('Permission to access camera was denied.');
		} else if (err.name === 'NotFoundError') {
			console.error('No camera device was found.');
		} else if (err.name === 'OverconstrainedError') {
			console.error("The constraints can't be satisfied by the available devices.");
		} else {
			console.error('An unknown error occurred.');
		}
	}
);

function takeSnapshot() {
	canvas.width = video.videoWidth || 640; // Default width if video is unavailable
	canvas.height = video.videoHeight || 480; // Default height if video is unavailable

	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		snapshotBlob = blob;

		const img = new Image();
		const url = URL.createObjectURL(blob);

		img.onload = function () {
			video.style.display = 'none';
			snapshotDiv.style.display = 'block';
			snapshotDiv.innerHTML = '';
			snapshotDiv.appendChild(img);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	}, 'image/jpeg');
}

function resetData() {
	video.style.display = 'block';
	snapshotDiv.style.display = 'none';
	snapshotBlob = undefined;
}

const takeSnapBtn = document.getElementById('take-snap-btn');
takeSnapBtn.addEventListener('click', takeSnapshot);

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetData);

const showHideButtons = ({ show }) => {
	const cameraButtonsContainer = document.querySelector('.camera-buttons');
	const statusButtonsContainer = document.querySelector('.status-buttons');
	const labPcStatusContainer = document.getElementById('lab-pc-status-container');

	cameraButtonsContainer.style.display = show ? 'flex' : 'none';
	statusButtonsContainer.style.display = show ? 'flex' : 'none';

	labPcStatusContainer.style.display = show ? 'none' : 'flex';
};

const updateStudentDetailsInView = ({ student = null, attendenceCount, pcDetails, wasMarkedPresentJust = false }) => {
	try {
		const totalAllotedElement = document.getElementById('total-alloted');
		const totalPresentElement = document.getElementById('total-present');
		const totalAbsentElement = document.getElementById('total-absent');

		totalAllotedElement.innerText = attendenceCount?.total_students;
		totalPresentElement.innerText = attendenceCount?.present_count;
		totalAbsentElement.innerText = attendenceCount?.attendance_not_marked;

		// const labPcContainer = document.querySelectorAll(".lab-pc-container");

		// labPcContainer.forEach(
		//   (_infoContainer) => (_infoContainer.style.display = "flex")
		// );

		if (wasMarkedPresentJust || student?.sl_present_status == 1) {
			document.getElementById('lab-number').innerText = pcDetails?.lab;
			document.getElementById('pc-number').innerText = `C${pcDetails?.pc_no}`;

			// Once detials are marked present,
			// Hide snapshot buttons and othe below buttons

			showHideButtons({ show: false });
		}
	} catch (err) {
		console.log(`Error while updating student details in view : ${err}`);
	}
};

const handleMarkAttendence = async (sendData) => {
	try {
		// console.log("getin ackecn url = ", backendUrl);

		console.log('marking presnt : ', sendData);
		// const _url = `${ backendUrl }/attendence/mark-present`;
		const _url = `${backendUrl}/api/attendence/v1/mark-present`;

		console.log(_url);

		const _response = await fetch(_url, {
			method: 'POST',
			body: sendData,
		});

		const { call, message, data } = await _response.json();
		const { attendenceCount, pcDetails } = data;
		if (call == 1) {
			alertjs.success({
				t: message,
			});
			updateStudentDetailsInView({
				attendenceCount: attendenceCount[0],
				pcDetails,
				wasMarkedPresentJust: true,
			});
		}

		if (call == 0) {
			alertjs.success({
				t: message,
			});
			updateStudentDetailsInView({
				attendenceCount: attendenceCount[0],
				pcDetails,
				wasMarkedPresentJust: true,
			});
		}
	} catch (err) {
		console.log(`Error while marking the attendence`);
	}
};

const handleRejection = async (rejectData) => {
	try {
	} catch (err) {
		console.log(`Error while rejecting : ${err}`);
	}
};

const markPresentBtn = document.getElementById('mark-present-btn');
document.addEventListener('click', function (e) {
	if (e.target && e.target.id === 'mark-present-btn') {
		e.preventDefault();

		if (!snapshotBlob) {
			return alertjs.warning({
				t: 'Warning',
				m: 'Please capture candidate photo',
			});
		}

		const sendData = new FormData();

		const id = +markPresentBtn.getAttribute('data-studentId');

		sendData.set('id', id);
		sendData.set('student_photo', snapshotBlob);

		// console.log(snapshotBlob);

		alertjs.deleteSpl('Mark Present ?', (status) => {
			if (status) {
				handleMarkAttendence(sendData);
			}
		});
	}

	if (e.target && e.target.id === 'reject-btn') {
		e.preventDefault();
		const data = {};
		handleMarkAttendence(data);
	}

	if (e.target && e.target.id === 'reset-page-btn') {
		e.preventDefault();
		document.querySelectorAll('.toggle-content').forEach((element) => {
			element.style.display = 'none';
		});
		document.getElementById('initial-text').style.display = 'block';
	}
});

// By default focus on input
const searchCandidateInput = document.getElementById('student-id');
if (searchCandidateInput) {
	searchCandidateInput.focus();
}

document.addEventListener('keydown', function (e) {
	if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() == 'k') {
		e.preventDefault();
		if (searchCandidateInput) {
			searchCandidateInput.focus();
		}
	}
});

// const dummyStudent = {
//   full_name: "John Doe",
//   sl_application_number: "123456",
//   id: "10003",
//   dob: "2000-01-01",
//   sl_post: "Senior",
//   exam_date: "2024-06-15",
//   sl_batch_no: "Batch A",
// };

const webcamImageRelativePath = '/pics/_webcam_images/';

function showStudentData(_student) {
	document.getElementById('initial-text').style.display = 'none';
	document.querySelectorAll('.toggle-content').forEach((element) => {
		element.style.display = 'flex';
	});

	let student = _student;

	//Dummy person
	//   student = dummyStudent;

	const idValue = [
		{
			id: 'name',
			val: student.full_name || '-',
		},
		{
			id: 'application-number',
			val: student.sl_application_number || '-',
		},
		{
			id: 'username',
			val: student.id || '-',
		},
		{
			id: 'dob',
			val: student.dob || '-',
		},
		{
			id: 'post',
			val: student.sl_post || '-',
		},
		{
			id: 'exam-date',
			val: student.exam_date || '-',
		},
		{
			id: 'batch',
			val: student.sl_batch_no || '-',
		},
	];

	idValue.forEach(({ id, val }) => {
		document.getElementById(id).innerHTML = val;
	});

	markPresentBtn.setAttribute('data-studentId', student.id);

	// alert(student.sl_present_status);

	// const labPcContainer = document.querySelectorAll(".lab-pc-container");

	// console.log("studne present status ", student.sl_present_status);
	// labPcContainer.forEach(
	//   (_infoContainer) =>
	//     (_infoContainer.style.display =
	//       student.sl_present_status === 2 ? "none" : "flex")
	// );

	const labPcStatusContainer = document.getElementById('lab-pc-status-container');

	labPcStatusContainer.style.display = student.sl_present_status === 2 ? 'flex' : 'none';

	// document.getElementById("lab-number").innerText = pcDetails.lab;
	// document.getElementById("pc-number").innerText = pcDetails.pc_no;

	//Resetting the webcam details and setting snapshot as undefined
	resetData();

	// console.log("student details while showing the details ", student);

	showHideButtons({ show: student.sl_present_status == 2 });

	const studentImageAbsolutePath = `${backendUrl}${relativeImagePath}/${student.sl_image}`;
	const studentSignAbsolutePath = `${backendUrl}${relativeSignPath}/${student.sl_sign}`;

	document.getElementById('student-image').src = studentImageAbsolutePath;
	document.getElementById('student-sign').src = studentSignAbsolutePath;

	if (student.sl_present_status == 1) {
		const webcamImageAbsPath = `${backendUrl}/${webcamImageRelativePath}${student.sl_cam_image}`;
		const newImageElement = document.createElement('img');
		newImageElement.src = webcamImageAbsPath;

		snapshotDiv.innerHTML = '';
		snapshotDiv.appendChild(newImageElement);

		video.style.display = 'none';
		snapshotDiv.style.display = 'block';
		snapshotBlob = undefined;
	} else {
		resetData();
	}
}

//SEARch functionality

const loaderContainerDiv = document.getElementById('btn-loader-container');

const handleFetchStudentDetails = async (id) => {
	try {
		loaderContainerDiv.style.display = 'block';
		document.getElementById('initial-text').style.display = 'none';
		// document.querySelectorAll(".toggle-content").forEach((element) => {
		//   element.style.display = "none";
		// });

		const _url = `/attendence/student-details`;

		const _response = await fetch(_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		});

		// const _resDat = await _response.json();

		console.log('+_+++++++++++++++++++');

		// console.log(_resDat);

		console.log('+_+++++++++++++++++++');

		const { success, data } = await _response.json();

		console.log(data);

		if (success) {
			loaderContainerDiv.style.display = 'none';
			const { student, already_present, pcDetails, studentAttendenceCount } = data;

			console.log(data);
			// console.log(student);
			// if (already_present) {
			//   alertjs.warning({
			//     t: "Already Marked Present",
			//   });
			//   return;
			// }

			if (!student) {
				alertjs.warning({
					t: 'No Candidate Found.',
				});
				return;
			}

			showStudentData(student);
			console.log(student, studentAttendenceCount, pcDetails);

			updateStudentDetailsInView({
				student,
				attendenceCount: studentAttendenceCount && studentAttendenceCount.length ? studentAttendenceCount[0] : {},
				pcDetails: pcDetails && pcDetails.length > 0 ? pcDetails[0] : undefined,
			});
		}
	} catch (err) {
		console.log(`Error while fetching the student details : ${err}`);
		loaderContainerDiv.style.display = 'none';
	}
};

const searchStudentBtn = document.getElementById('search-btn');

searchStudentBtn.addEventListener('click', function (e) {
	e.preventDefault();
	const id = +document.getElementById('student-id').value;
	if (!id || isNaN(id)) {
		return alertjs.warning({
			t: 'Please enter a valid student ID.',
		});
	}
	handleFetchStudentDetails(id);
});

const studentIdInput = document.getElementById('student-id');

studentIdInput.addEventListener('keypress', async function (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		const id = +studentIdInput.value;
		if (!id || isNaN(id)) {
			return alertjs.warning({
				t: 'Please enter a valid student ID.',
			});
		}
		await handleFetchStudentDetails(id);
	}
});
export { backendUrl };

//Temp
// handleFetchStudentDetails(3001);

document.getElementById('student-image').addEventListener('click', function (e) {
	console.log('click');
	showBsModal('viewPhotoModal');
	console.log(e.target.getAttribute('src'));
	let _imgSrc = e.target.getAttribute('src');
	document.getElementById('view-image').src = _imgSrc;
});

document.getElementById('student-sign').addEventListener('click', function (e) {
	console.log('click');
	showBsModal('viewPhotoModal');
	console.log(e.target.getAttribute('src'));
	let _imgSrc = e.target.getAttribute('src');
	document.getElementById('view-image').src = _imgSrc;
});
