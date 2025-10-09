import { alertjs, _showLoader, _hideLoader } from "./common.js";

$(function () {
	$("#submitPreview").on("click", function () {
		_showLoader();
		if (validatePreview()) {
			var $this = $("#submitPreview");
			$this
				.prop("disabled", true)
				.html(
					`<i class="fa-solid fa-floppy-disk mr-2" aria-hidden="true"> Saving Preview...   </i>`,
				);

			$.ajax({
				method: "POST",
				url: "/sumbit-preveiw",
				data: {},
			})
				.done(function (data, status) {
					_hideLoader();
					$this
						.prop("disabled", false)
						.html(
							`<i class="fa-solid fa-floppy-disk mr-2" aria-hidden="true"> Submit   </i>`,
						);
					var json = data;
					if (json._call == 1) {
						alertjs.success(
							{
								t: "Success",
								m: "Application preview submitted successfully. <br />  अर्जाचा पूर्वावलोकन यशस्वीरीत्या सबमिट झाला आहे.",
							},
							function () {
								window.location.assign(
									`/payment-page?r=${regID}&f=${form_id}`,
								);
							},
						);

						return false;
					}
					if (json._call == 1) {
						alertjs.warning(
							{
								t: "Warning",
								m: "Your session has expired. Kindly log in again. <br  /> आपले सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.",
							},
							function () {
								window.location.assign("/home");
							},
						);
						return false;
					}
				})
				.fail(function (error) {
					_hideLoader();
					$this
						.prop("disabled", false)
						.html(
							`<i class="fa-solid fa-floppy-disk mr-2" aria-hidden="true"> Submit   </i>`,
						);

					alertjs.error(function () {
						console.log(error);
					});
				})
				.always(function () {
					_hideLoader();
					$this
						.prop("disabled", false)
						.html(
							`<i class="fa-solid fa-floppy-disk mr-2" aria-hidden="true"> Submit   </i>`,
						);
				});
		} else {
			_hideLoader();
		}
	});
	$("#back").on("click", function () {
		window.location.assign("/document-upload/" + regString);
	});
});

function validatePreview() {
	if ($("#chkPhoto").prop("checked") == false) {
		alertjs.warning(
			{
				m: "Please confirm your photo. <br />  कृपया आपला फोटो तपासून पुष्टी करा.",
				t: "Warning",
			},
			function () {},
		);

		return false;
	}

	if ($("#chkSignature").prop("checked") == false) {
		alertjs.warning(
			{
				t: "Warning",
				m: "Please confirm your signature. <br />  कृपया आपली सही तपासून पुष्टी करा.",
			},
			function () {},
		);
		return false;
	}
	if ($("#chkIagree").prop("checked") == false) {
		alertjs.warning(
			{
				t: "Warning",
				m: "You must accept the declaration to proceed. <br />  पुढे जाण्यासाठी आपण घोषणा (declaration) स्वीकारणे आवश्यक आहे.",
			},
			function () {},
		);
		return false;
	}
	return true;
}
