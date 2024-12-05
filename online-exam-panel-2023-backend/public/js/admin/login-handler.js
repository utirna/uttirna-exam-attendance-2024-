$(document).ready(() => {
	let isMockMode = false;

	$(document).on('click', '.mock-mode-btn', function () {
		$('.mock-off').toggleClass('d-none');
		$('.mock-on').toggleClass('d-none');
		isMockMode = !isMockMode;
	});

	$(document).on('submit', '#admin-login-form', async function (e) {
		e.preventDefault();
		let user_name = $('#user_name').val();
		let password = $('#password').val();

		let _res = await fetch(`${getUrl()}check-examo-auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_name,
				password,
				isMockMode,
			}),
		});

		let _data = await _res.json();

		if (_data.status == 401) {
			window.location.herf = '/admin';
			return false;
		}

		isMockMode
			? (window.location.href = '/admin/mock-exam-setting')
			: (window.location.href = '/admin/exams');
	});

	$(function () {
		$('#requestCenterCode').on('click', function () {
			var center_code = $('#centerCode').val();
			$('#modal-id').modal('hide');
			$('#centerCode').val('');
			addLoading();
			$.ajax({
				url: getUrl() + 'requestCenterCode',
				type: 'POST',
				data: {
					center_code: center_code,
				},
				success: function (data) {
					removeLoading();
					if (data.call == 1) {
						alert(
							'Login Details Updated Successfully, Contact Master Server Admin For Login Info.'
						);
						return false;
					}
					if (data.call == 0) {
						alert('Internal Query Error.');
						return false;
					}
					if (data.call == 5) {
						alert(
							'Invalid Center Code, Please Contact To Master Server Admin.'
						);
					}
					if (data.call == 999) {
						alert('Master Server Not Found');
					}
				},
				error: function (error) {
					removeLoading();
					alert('Server Error');
				},
			});
		});

		$('#requestUpdateIP').on('click', function () {
			$('#modalIdIp').modal('hide');

			const ipMaster = $('#ip-master').val();
			const ipFormFilling = $('#ip-form-filling').val();

			addLoading();
			$.ajax({
				url: getUrl() + 'requestUpdateIP',
				type: 'POST',
				data: {
					ipMaster,
					ipFormFilling,
				},
				success: function (data) {
					removeLoading();
					$('#ip-master').val('');
					$('#ip-form-filling').val('');
					if (data.success) {
						alert(data.message);
						return false;
					}
				},
				error: function (error) {
					removeLoading();
					alert('Server Error');
				},
			});
		});
	});
});
