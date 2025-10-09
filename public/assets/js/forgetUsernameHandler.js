$(function () {
	$("#recoverPassword").click(function (event) {
		$this = $("#recoverPassword");
		event.preventDefault();
		validate;
		if ($("#forgetUsername").valid()) {
			$this.prop("disabled", true).html("Getting Details...");
			$.ajax({
				method: "post",
				url: "/getUsernameRecovery",
				data: {
					aadharNumber: $('input[name="forAadharNumber"]').val(),
					mobileNumber: $('input[name="forgetMobileNumber"]').val(),
				},
			})
				.done(function (data) {
					$this.prop("disabled", false).html("Get Username");
					var json_data = data;
					switch (json_data._call) {
						case 1:
							$("#showPass").html(
								"Your Username is :: " +
									json_data.data[0].username,
							);
							$("#addDhr").prop("disabled", true);
							$("#mobile").prop("disabled", true);
							var parent = $this.parent("td");
							$(parent).addClass("d-none");
							break;
						case 0:
							$("#showPass").html(
								"No data found in record, try again.",
							);
							break;
					}
				})
				.fail(function (error) {
					$this.prop("disabled", false).html("Get Username");
					$("#showPass").html(
						"Server Error Try Again/Contact Admin.",
					);
					console.log(error);
				})
				.always(function () {
					console.log("Done");
				});
		}
	});
});
var validate = $("#forgetUsername").validate({
	rules: {
		forAadharNumber: {
			required: true,
			number: true,
			minlength: 12,
			maxlength: 12,
		},
		forgetMobileNumber: {
			required: true,
			number: true,
			minlength: 10,
			maxlength: 10,
		},
	},
	messages: {
		forAadharNumber: {
			required: "&nbsp;Enter Aadhaar Card Number.",
			number: "&nbsp;Invalid Aadhaar Card Number.",
			minlength: "&nbsp;Aadhaar Card Number Must Be {0} Digits.",
			maxlength: "&nbsp;Aadhaar Card Number Be At Least {0} Digits.",
		},
		forgetMobileNumber: {
			required: "&nbsp;Enter Mobile Number.",
			number: "&nbsp;Invalid Mobile Number.",
			minlength: "&nbsp;Mobile Number Must Be {0} Digits.",
			maxlength: "&nbsp;Mobile Number Be At Least {0} Digits.",
		},
	},
	errorPlacement: function (error, element) {
		error.insertAfter(element);
		$("label[class='error']").addClass("text-danger font-weight-bolder");
	},
});
