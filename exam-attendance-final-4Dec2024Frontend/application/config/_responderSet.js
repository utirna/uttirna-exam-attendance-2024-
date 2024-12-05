exports.sendData = {
	_call: 0,
	_error: '',
	_sys_erorr: '',
	_data: [],
};

exports.myDate = {
	getDate: function () {
		let date_ob = new Date();
		let date = ('0' + date_ob.getDate()).slice(-2);
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
		let year = date_ob.getFullYear();
		return year + '-' + month + '-' + date;
	},

	changeDateFormat: (date) => {
		let d = date.split('-');
		return `${d[2]}-${d[1]}-${d[0]}`;
	},

	getTime: function () {
		let date_ob = new Date();
		let hours = ('0' + date_ob.getHours()).slice(-2);
		let minutes = ('0' + date_ob.getMinutes()).slice(-2);
		let seconds = ('0' + date_ob.getSeconds()).slice(-2);
		return hours + ':' + minutes + ':' + seconds;
	},
	getDateTime: function () {
		let date_ob = new Date();
		let date = ('0' + date_ob.getDate()).slice(-2);
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
		let year = date_ob.getFullYear();
		let hours = ('0' + date_ob.getHours()).slice(-2);
		let minutes = ('0' + date_ob.getMinutes()).slice(-2);
		let seconds = ('0' + date_ob.getSeconds()).slice(-2);
		return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	},
	getTimeStamp: function () {
		let date_ob = new Date();
		let date = ('0' + date_ob.getDate()).slice(-2);
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
		let year = date_ob.getFullYear();
		let hours = ('0' + date_ob.getHours()).slice(-2);
		let minutes = ('0' + date_ob.getMinutes()).slice(-2);
		let seconds = ('0' + date_ob.getSeconds()).slice(-2);
		return year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds;
	},
};
