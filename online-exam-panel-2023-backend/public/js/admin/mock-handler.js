$(document).ready(() => {
	console.log('mock handler loaded')

	let mockSettingForm = $('#mock-setting-form')

	// validate mock-setting-form
	mockSettingForm.validate({
		rules: {
			'total-questions': {
				required: true,
			},
			'total-candidates': {
				required: true,
			},
			'test-duration': {
				required: true,
			},
			'total-marks': {
				required: true,
			},
		},
	})

	$(document).on('submit', mockSettingForm, function (e) {
		e.preventDefault()
		console.log('hi')
		// if (!mockSettingForm.valid()) return false

		let formData = new FormData(mockSettingForm[0])
		for (let [key, value] of formData) {
			console.log(key, value)
		}

		postMockSettingForm(formData)
	})

	let submitMockBtnLoading = $('#submit-mock-btn-loader')
	submitMockBtnLoading.hide()

	async function postMockSettingForm(data) {
		addLoading()
		try {
			submitMockBtnLoading.show()

			let _res = await fetch('/admin/mock-exam-setting', {
				method: 'POST',
				body: data,
			})
			let _data = await _res.json()
			console.log(_data, '-here====')

			switch (_data.status) {
				case 440:
					submitMockBtnLoading.hide()
					window.location.href = '/admin'
					break
				case 201:
					alert(_data.message)
					submitMockBtnLoading.hide()
					window.location.href = '/admin/exams'
					break
			}
		} catch (error) {
			console.log(error, 'error')
			submitMockBtnLoading.hide()
		} finally {
			submitMockBtnLoading.hide()
			removeLoading()
		}
	}
})
