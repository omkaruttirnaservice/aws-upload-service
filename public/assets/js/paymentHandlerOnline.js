import {
	_hideLoader,
	_showLoader,
	alertjs,
	openCustomSizeWindow,
} from "./common.js";

window.addEventListener("DOMContentLoaded", () => {
	// (function addPaymentScript() {
	// 	let cdnScript = document.createElement("script");
	// 	cdnScript.setAttribute(
	// 		"src",
	// 		"https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js",
	// 	);
	// 	document.head.appendChild(cdnScript);
	// })();

	(function paymentTimer() {
		let paymentTimer = $("#payment-timer");
		let minutes = 2;
		let seconds = 0;
		setTime(minutes, seconds);

		let interval = setInterval(() => {
			setTime(minutes, seconds);
			if (minutes === 0 && seconds === 0) {
				clearInterval(interval);
			} else if (seconds === 0 && minutes !== 0) {
				minutes--;
				seconds = 59;
			} else if (seconds !== 0) {
				seconds--;
			}
		}, 1000);

		function setTime(minutes, seconds) {
			if (minutes === 0 && seconds === 0) {
				window.location.replace("/logout");
			}
			if (minutes <= 9) {
				minutes = "0" + minutes;
			}
			if (seconds <= 9) {
				seconds = "0" + seconds;
			}
			paymentTimer.html(`${minutes} : ${seconds}`);
		}
	})();

	$("#makePayment").click(async function (e) {
		$("#makePayment").attr("disabled", true);
		_showLoader();
		try {
			await makePayment();
		} catch (error) {
			console.log(error, "=error");
			alertjs.warning(
				{
					t: "Warning",
					m: "Unable to process payment. Please try again later. <br />  पेमेंट प्रक्रिया करता येत नाही. कृपया नंतर पुन्हा प्रयत्न करा.",
				},
				function () {},
			);
		} finally {
			$("#makePayment").attr("disabled", false);
			_hideLoader();
		}
	});

	$("#paymentAgreement").click(function (e) {
		var checked = $(this).prop("checked");
		console.log(1);
		if (checked == true) {
			$(this).prop("disabled", true);
			$("#makePayment").removeClass("d-none");
		}
	});

	const makePayment = async () => {
		try {
			let _tokenRes = await fetch("/v2/get-payment-details", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userDetails: {
						...userDetails,
						r_id: regID,
						f_id: form_id,
					},
				}),
			});
			let _data = await _tokenRes.json();

			if (!_tokenRes.ok) {
				throw new Error(
					"Unable to process payment. Please try again later. <br />  पेमेंट प्रक्रिया करता येत नाही. कृपया नंतर पुन्हा प्रयत्न करा.",
				);
			}

			// addPaymentScript();
			openPay(_data.data, userDetails);
		} catch (error) {
			throw new Error(error?.message || "Please try again later");
		}
	};

	function openPay({ token, merchId }, userDetails) {
		const options = {
			atomTokenId: token,
			merchId: merchId,
			custEmail: userDetails.email,
			custMobile: userDetails.contact,
			returnUrl: `${p.p_form_filling_site}/v2/verify-payment`,
		};
		let atom = new AtomPaynetz(options, "uat");
	}

	// recheck payment status
	$(document).on("click", ".recheck-payment", async function () {
		let paymentDetails = $(this).attr("data-details");

		paymentDetails = JSON.parse(paymentDetails);

		recheckPayment(paymentDetails);
	});

	(async function () {
		let successPaymentCount = 0;
		let paymentContainer = $("#payment-container");
		let processingContainer = $("#processing-container");
		let previewApplicationBtnContainer = $(
			"#preview-application-btn-container",
		);

		if (previous_pay_list.length === 0) {
			paymentContainer.removeClass("d-none");
			processingContainer.addClass("d-none");
			previewApplicationBtnContainer.addClass("d-none");
		} else if (previous_pay_list.length > 0) {
			paymentContainer.addClass("d-none");
			processingContainer.removeClass("d-none");
			previewApplicationBtnContainer.addClass("d-none");

			for (let i = 0; i < previous_pay_list.length; i++) {
				let currentPayment = previous_pay_list[i];

				if (currentPayment.pay_status_code === "OTS_0000") {
					successPaymentCount++;
					continue;
				}

				const isPaymentSuccessful = await recheckPayment(
					currentPayment,
					i,
				);
				if (isPaymentSuccessful) successPaymentCount++;
			}

			if (successPaymentCount > 0) {
				paymentContainer.addClass("d-none");
				processingContainer.addClass("d-none");
				previewApplicationBtnContainer.removeClass("d-none");
				let timeOut = 2;
				let interval = setInterval(() => {
					if (timeOut === 0) {
						const url = `/application?r=${regID}&f=${form_id}`;
						window.location.assign("/");
						openCustomSizeWindow(url);
						clearInterval(interval);
					}
					$("#opening-in").html(` : ${timeOut}`);
					timeOut--;
				}, 1000);
			}

			if (successPaymentCount === 0) {
				paymentContainer.removeClass("d-none");
				processingContainer.addClass("d-none");
				previewApplicationBtnContainer.addClass("d-none");
			}
		}
	})();

	async function recheckPayment(paymentDetails, idx) {
		if (!paymentDetails) return;

		let URL = `/v3/transaction-status?merch_trans_id=${paymentDetails.pay_merch_txn_id}&merchTxnDate=${paymentDetails.payStartDate}&amount=${paymentDetails.pay_amount}`;
		let currentPaymentStatusDiv = $(`.payment-status-${idx}`);

		currentPaymentStatusDiv.html(`<p>Loading...</p>`);

		try {
			let _res = await fetch(URL);
			let _data = await _res.json();

			if (_data.call == 0) {
				currentPaymentStatusDiv.html(
					`<button class="c-button c-btn-danger">Failed</button>`,
				);
				return false;
			}
			if (_data.call == 1) {
				currentPaymentStatusDiv.html(
					`<button class="c-button c-btn-success">Success</button>`,
				);
				return true;
			}
			return false;
		} catch (error) {
			window.location.href = "/home";
		}
	}
});
