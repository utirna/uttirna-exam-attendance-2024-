let alertjs = {
	success: function (data, callback = () => {}) {
		swal
			.fire({
				title: data.t,
				text: data.m,
				icon: 'success',
			})
			.then(function () {
				callback()
			})
	},
	warning: function (data, callback = () => {}) {
		swal
			.fire({
				title: data.t,
				text: data.m,
				icon: 'warning',
			})
			.then(function () {
				callback()
			})
	},
	delete: function (callback = () => {}) {
		swal
			.fire({
				title: 'सरद माहिती काढायची आहे का?',
				text: '',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'होय',
				cancelButtonText: 'नाही',
			})
			.then((willDelete) => {
				if (willDelete.value) {
					callback(true)
				} else {
					callback(false)
				}
			})
	},
	deleteSpl: function (text, callback = () => {}) {
		swal
			.fire({
				title: text,
				text: '',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
			})
			.then((willDelete) => {
				if (willDelete.value) {
					callback(true)
				} else {
					callback(false)
				}
			})
	},
	common: function (data) {
		swal(data.m)
	},
	input: function (data) {
		$(data.id).notify(data.m, { autoHideDelay: 2500 })
		//$.notify(data.m, { autoHideDelay: data.s });
	},
}