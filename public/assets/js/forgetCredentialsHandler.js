const getUserIdBtnEl = $("#get-user-id");
const otpInputContainerEl = $("#otp-input-container");

const messageContainer = $("#messageContainer");
const messageContainer2 = $("#messageContainer-2");

let reference_id = null;

$("#get-user-id").click(function (event) {
	event.preventDefault();
	let $this = $(this);
	if ($("#forget-username").valid()) {
		$this.prop("disabled", true);
		$.ajax({
			method: "post",
			url: "/v2/getUsernameRecovery",
			data: {
				aadharNumber: $('input[name="forAadharNumber"]').val(),
				mobileNumber: $('input[name="forgetMobileNumber"]').val(),
				type: type == "userid" ? "user ID" : "password",
			},
		})
			.done(function (data) {
				reference_id = data.data.reference_id;
				otpInputContainerEl.removeClass("hidden");
				getUserIdBtnEl.addClass("hidden");
				messageContainer.html(`
						<p class="text-sm text-red-500 ">${data.usrMsg}</p>`);
			})
			.fail(function (error) {
				const er = error?.responseJSON;

				messageContainer.html(`
						<p class="text-sm text-red-500 ">${er?.usrMsg}</p>`);
			})
			.always(function () {
				$this.prop("disabled", false);
			});
	}
});

$("#verify-otp-btn").click(function (event) {
	event.preventDefault();
	let $this = $(this);
	if ($("#forget-username").valid()) {
		$this.prop("disabled", true).html("Verifying OTP...");

		$.ajax({
			method: "post",
			url: "/verify-otp",
			data: {
				otp: $('input[name="otp"]').val(),
				reference_id,
				aadharNumber: $('input[name="forAadharNumber"]').val(),
				mobileNumber: $('input[name="forgetMobileNumber"]').val(),
			},
		})
			.done(function (data) {
				messageContainer.html(`
						<p class="text-sm text-red-500 ">${data?.usrMsg || "Details shared to registered email"}</p>`);

				$("#forget-username")[0].reset();
				otpInputContainerEl.addClass("hidden");
			})
			.fail(function (error) {
				const er = error?.responseJSON;

				$("#otp-error").html(`
						<p class="text-sm text-red-500 ">${er?.usrMsg}</p>`);
				setTimeout(() => {
					$("#otp-error").html("");
				}, 1400);
			})
			.always(function () {
				$this.prop("disabled", false).html("Verify OTP");
			});
	}
});

$("#forget-username").validate({
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
			required: "&nbsp;Enter Aadhaar Card Number",
			number: "&nbsp;Invalid Aadhaar Card Number",
			minlength: "&nbsp;Aadhaar Card Number Must Be {0} Digits",
			maxlength: "&nbsp;Aadhaar Card Number Be At Least {0} Digits",
		},
		forgetMobileNumber: {
			required: "&nbsp;Enter Mobile Number",
			number: "&nbsp;Invalid Mobile Number",
			minlength: "&nbsp;Mobile Number Must Be {0} Digits",
			maxlength: "&nbsp;Mobile Number Be At Least {0} Digits",
		},
	},
	errorPlacement: function (error, element) {
		error.insertAfter(element);
		$("label[class='error']").addClass("text-danger font-weight-bolder");
	},
});
