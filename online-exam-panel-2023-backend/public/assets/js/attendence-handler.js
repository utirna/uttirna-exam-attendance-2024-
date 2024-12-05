console.log('js loaded')
const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const snapshotDiv = document.getElementById('snapshot-div')

const ctx = canvas.getContext('2d')

const capturedImage = null

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: false,
	})
	.then((stream) => {
		video.srcObject = stream
		video.play()
	})
	.catch((err) => {
		console.log(`An error occured : ${err}`)
	})

let snapshotBlob = null

function takeSnapshot() {
	canvas.width = video.videoWidth
	canvas.height = video.videoHeight

	ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

	canvas.toBlob(function (blob) {
		snapshotBlob = blob // Save the blob in the global variable

		const img = new Image()
		const url = URL.createObjectURL(blob)

		img.onload = function () {
			// Do something with the image here, like displaying it
			video.style.display = 'none'
			snapshotDiv.style.display = 'block'
			snapshotDiv.innerHTML = ''
			snapshotDiv.appendChild(img)

			// Optionally, you can revoke the object URL once it's no longer needed
			URL.revokeObjectURL(url)
		}

		img.src = url
	}, 'image/jpeg')
}

function resetData() {
	video.style.display = 'block'
	snapshotDiv.style.display = 'none'
}

const takeSnapBtn = document.getElementById('take-snap-btn')
takeSnapBtn.addEventListener('click', takeSnapshot)

const resetBtn = document.getElementById('reset-btn')
resetBtn.addEventListener('click', resetData)

const handleMarkAttendence = async (sendData) => {
	try {
		const _url = `/attendance/mark-present`

		const _response = await fetch(_url, {
			method: 'POST',
			body: sendData,
		})

		const { success } = await _response.json()

		if (success) {
			alertjs.success({
				t: 'Attendence Marked Successfully',
			})
		}
	} catch (err) {
		console.log(`Error while marking the attendence`)
	}
}

const handleRejection = async (rejectData) => {
	try {
	} catch (err) {
		console.log(`Error while rejecting : ${err}`)
	}
}

const markPresentBtn = document.getElementById('mark-present-btn')
document.addEventListener('click', function (e) {
	if (e.target && e.target.id === 'mark-present-btn') {
		e.preventDefault()

		const sendData = new FormData()

		const id = +markPresentBtn.getAttribute('data-studentId')

		sendData.set('id', id)
		sendData.set('student_photo', snapshotBlob)

		console.log(snapshotBlob)

		alertjs.deleteSpl('Mark Present ?', (status) => {
			if (status) {
				handleMarkAttendence(sendData)
			}
		})
	}

	if (e.target && e.target.id === 'reject-btn') {
		e.preventDefault()
		const data = {}
		handleMarkAttendence(data)
	}

	if (e.target && e.target.id === 'reset-page-btn') {
		e.preventDefault()
		document.querySelectorAll('.toggle-content').forEach((element) => {
			element.style.display = 'none'
		})
		document.getElementById('initial-text').style.display = 'block'
	}
})

function showStudentData(student) {
	document.getElementById('initial-text').style.display = 'none'
	document.querySelectorAll('.toggle-content').forEach((element) => {
		element.style.display = 'flex'
	})

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
	]

	idValue.forEach(({ id, val }) => {
		document.getElementById(id).innerHTML = val
	})

	markPresentBtn.setAttribute('data-studentId', student.id)
}

//SEARch functionality

const loaderContainerDiv = document.getElementById('loader-container')

const handleFetchStudentDetails = async (id) => {
	try {
		loaderContainerDiv.style.display = 'block'
		// document.getElementById('initial-text').style.display = 'none'
		document.querySelectorAll('.toggle-content').forEach((element) => {
			element.style.display = 'none'
		})

		const _url = `/attendance/student-details`

		const _response = await fetch(_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		})

		const { success, data } = await _response.json()

		if (success) {
			loaderContainerDiv.style.display = 'none'
			const { student, already_present } = data

			console.log(data)

			if (already_present) {
				alertjs.warning({
					t: 'Already Marked Present',
				})
				return
			}

			if (!student) {
				alertjs.warning({
					t: 'No student found.',
				})
				return
			}

			showStudentData(student)
		}
	} catch (err) {
		console.log(`Error while fetching the student details : ${err}`)
		loaderContainerDiv.style.display = 'none'
	}
}

const searchStudentBtn = document.getElementById('search-btn')

searchStudentBtn.addEventListener('click', function (e) {
	e.preventDefault()
	const id = +document.getElementById('student-id').value
	handleFetchStudentDetails(id)
})

const studentIdInput = document.getElementById('student-id')

studentIdInput.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		e.preventDefault()
		const id = +studentIdInput.value
		handleFetchStudentDetails(id)
	}
})
