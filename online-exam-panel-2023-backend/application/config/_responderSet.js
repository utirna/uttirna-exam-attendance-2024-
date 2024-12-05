exports.sendData = {
	_call: 0,
	_error: '',
	_sys_erorr: '',
	_data: [],
}

exports.myDate = {
	getDate: function () {
		let date_ob = new Date()
		let date = ('0' + date_ob.getDate()).slice(-2)
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
		let year = date_ob.getFullYear()
		return year + '-' + month + '-' + date
	},

	changeDateFormat: (date) => {
		let d = date.split('-')
		return `${d[2]}-${d[1]}-${d[0]}`
	},

	getTime: function () {
		let date_ob = new Date()
		let hours = ('0' + date_ob.getHours()).slice(-2)
		let minutes = ('0' + date_ob.getMinutes()).slice(-2)
		let seconds = ('0' + date_ob.getSeconds()).slice(-2)
		return hours + ':' + minutes + ':' + seconds
	},
	getDateTime: function () {
		let date_ob = new Date()
		let date = ('0' + date_ob.getDate()).slice(-2)
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
		let year = date_ob.getFullYear()
		let hours = ('0' + date_ob.getHours()).slice(-2)
		let minutes = ('0' + date_ob.getMinutes()).slice(-2)
		let seconds = ('0' + date_ob.getSeconds()).slice(-2)
		return (
			year +
			'-' +
			month +
			'-' +
			date +
			' ' +
			hours +
			':' +
			minutes +
			':' +
			seconds
		)
	},
	getTimeStamp: function () {
		let date_ob = new Date()
		let date = ('0' + date_ob.getDate()).slice(-2)
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
		let year = date_ob.getFullYear()
		let hours = ('0' + date_ob.getHours()).slice(-2)
		let minutes = ('0' + date_ob.getMinutes()).slice(-2)
		let seconds = ('0' + date_ob.getSeconds()).slice(-2)
		return (
			year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds
		)
	},
}
exports.checkResult = {
	checkResultForNullData: function (result) {
		return new Promise(function (resolve, reject) {
			if (result.length == 0) {
				reject({ _call: 1, _error: 'No Data Found', _data: [] })
			} else {
				resolve({ _call: 1, _error: '', _data: result })
			}
		})
	},
	checkResultInserted: function (data, msg) {
		return new Promise(function (resolve, reject) {
			if (data.affectedRows <= 0) {
				reject({ _call: 0, _error: msg, _sys_erorr: {}, _data: [] })
			} else {
				resolve({ _call: 1, _error: '', _sys_erorr: {}, _data: [] })
			}
		})
	},
	checkResultUpdated: function (data, msg) {
		return new Promise(function (resolve, reject) {
			if (data.affectedRows <= 0) {
				reject({ _call: 0, _error: msg, _sys_erorr: {}, _data: [] })
			} else {
				resolve({ _call: 1, _error: '', _sys_erorr: {}, _data: [] })
			}
		})
	},
}

exports.table_list = [
	'tm_final_student_question_paper',
	'tm_final_student_test_list',
	'tm_publish_test_list',
	'tm_student_question_paper',
	'tm_student_test_list',
	'tm_test_question_sets',
	'tn_main_student_list',
	'tn_student_list',
]
