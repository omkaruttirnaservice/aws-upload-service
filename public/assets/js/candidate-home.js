import { _hideLoader, _showLoader, alertjs, compareDate } from "./common.js";

$(function () {
	$("#idApplyForNewPost").on("click", async function () {
		_showLoader();
		try {
			window.location.assign("/user-eligibility/" + regString);
		} catch (error) {
			console.log(error);
			alertjs.warning(
				{
					t: "Warning",
					m:
						error?.message ||
						"Unable to process payments try again later",
				},

				function () {},
			);
		} finally {
			_hideLoader();
		}
	});

	$("#logout").on("click", function () {
		window.location.assign("/logout");
	});

	function setExamList() {
		var _tr = "";

		if (updateData.length > 0) {
			$.each(updateData, function (index, value) {
				_tr += `<tr>

                            <td>${index + 1}.</td>`;

				if (Number(value.p_done)) {
					_tr += `<td>
                                <button id="" class="d-inline-block c-button c-btn-primary">Completed</button>
                            </td>`;
				} else {
					_tr += `<td>

                                <label name="" id="" class="d-inline-block c-button c-btn-warning" href="#">Incomplete</label>

                            </td>`;
				}

				_tr += `<td>${value.applied_post}</td>
						<td>${value.appication_number}</td>
						<td><small>${value.created_date}</td>
						<td>${value.post_fee + " /-"}</td>`;

				if (value.post_fee == 0) {
					_tr += `<td>-</td>`;
				} else {
					if (Number(value.p_done)) {
						if (Number(value.payment_is_done)) {
							_tr += `<td>
										<button  class="d-inline-block c-button c-btn-primary">Done</button>
									</td>`;
						} else {
							_tr += `<td>
										<a id="make-payment-btn" class="d-inline-block c-button c-btn-primary make-payment-btn" href="/payment-page?r=${regID}&f=${value.appication_number}">Make Payment</a>
									</td>`;
						}
					} else {
						_tr += `<td>
									<label name="" id="" class="c-button c-btn-warning">Incomplete</label>
								</td>`;
					}
				}

				const _isPreviewDone = Number(value.p_done) == 1;
				const _isPaymentDone = Number(value.payment_is_done) == 1;
				const _isHtGenerated = isHtGenerated;
				const _isAnswerKeyGenerated = isAnswerKeyGenerated;
				const _isPracticalExamHtGenerated = isPracticalExamHtGenerated;

				const _isPresentforExam = value.ca_exam_present_status == 1;

				if (_isPreviewDone) {
					_tr += `<td>`;
					if (_isPaymentDone) {
						// FOR ONLINE / OFFLINE HALLTICKET
						if (_isHtGenerated) {
							_tr += `<a target="_blank" class="d-inline-block c-button c-btn-success d-none" href="/application?r=${regID}&f=${value.appication_number}">Application</a>
									<button class="btn btn-success btn-sm print-ht-btn" data-url='/print-ht?r=${regID}&f=${value.appication_number}&name=${userName.split(" ").join("_")}'">Download Hallticket</button>`;
						}

						// FOR practical exam hallticket
						if (
							_isPracticalExamHtGenerated &&
							_isPresentforExam &&
							isPostForPracticalExam(value.applied_post)
						) {
							/**
							 * If candidate is present for exam for the pacticular post
							 * If practical exam halltickets are generated
							 * If the candidates post is eligible for practical eaxm
							 * Then only allow the candidate to download the practical exam hallticket */
							_tr += `<a target="_blank" class="d-inline-block c-button c-btn-success d-none" href="/application?r=${regID}&f=${value.appication_number}">Application</a>
									<button class="btn btn-success btn-sm print-ht-btn" data-url='/practical-exam-ht?fid=${value.appication_number}&name=${userName.split(" ").join("_")}'">Download Hallticket</button>`;
						} else if (
							_isPracticalExamHtGenerated &&
							!_isPresentforExam
						) {
							_tr += "--";
						} else if (
							!isPostForPracticalExam(value.applied_post)
						) {
							_tr += "--";
						}

						if (_isAnswerKeyGenerated && _isPresentforExam) {
							_tr += `<a target="_blank" class="d-inline-block c-button c-btn-success" href="/paper-key?r=${regID}&f=${value.appication_number}">Answer Key</a>`;
						} else if (
							!_isAnswerKeyGenerated &&
							!_isHtGenerated &&
							!_isPracticalExamHtGenerated
						) {
							_tr += `-`;
						} else if (
							_isAnswerKeyGenerated &&
							!_isPresentforExam
						) {
							_tr += `<button class="d-inline-block c-button c-btn-primary">Absent</button>`;
						}
					} else {
						_tr += `-`;
					}

					_tr += `</td>`;
					_tr += `</tr>`;
				} else {
					_tr += ` <td>
								<div class="d-flex gap-1">
									<button 
										name="" 
										id="applicationEditBtn" 
										class="d-inline-block c-button c-btn-primary applicationEditBtn application-modify-btn" 
										data-type="EDIT"
										data-index="${index}"
										data-f-id="${value.id}"
									>Edit</button>
									<button 
										name="" 
										id="applicationResumeBtn" 
										class="d-inline-block c-button c-btn-success applicationResumeBtn application-modify-btn"
										data-type="RESUME"
										data-index="${index}"
										data-f-id="${value.id}"
									>Resume</button>
								</div>
							</td>
						</tr>`;
					//_tr += `<td>-</td></tr>`;
				}
			});

			$("#examList").html(_tr);
		}

		$("#exams").fadeIn(500);
	}

	$("#exams").removeClass("d-none").hide();

	// setExamList();

	if (
		compareDate(new Date(), impDates.pRegistrationEndDate) ||
		isResultGenerated ||
		isInterviewLetterGenerated
	) {
		// $("#idApplyForNewPost").addClass("d-none");
	}

	// edit form end
	if (compareDate(new Date(), impDates.pEditEndDate)) {
		// $(".applicationEditBtn").addClass("d-none");
		// $(".applicationResumeBtn").addClass("d-none");
		// $(".applicationEditBtn").parent().html("-");
	}

	// payment end
	if (compareDate(new Date(), impDates.pPaymentEndDate)) {
		// $(".make-payment-btn").addClass("d-none");
		// $(".make-payment-btn").parent().html("-");
	}
});

function checkIfDateExpired(dateType) {
	const findDate = impDates.filter(_date => _date._column === dateType);
	return findDate[0].isExpired ? findDate[0].isExpired : false;
}

function isPostForPracticalExam(post) {
	const postList = ["वाहन चालक", "वीजतंत्री", "भुईकाटा ऑपरेटर"];

	return postList.includes(post.trim());
}

$(document).on("click", ".print-ht-btn", function () {
	const url = $(this).attr("data-url");
	const width = 1366;
	const height = 768;
	const features = `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=${width},height=${height},initial-scale=1.0,maximum-scale=1.0,user-scalable=no`;

	const printWindow = window.open(url, "_blank", features);
	if (printWindow) {
		printWindow.focus();
	} else {
		alert("Pop-up blocked. Please allow pop-ups for this site.");
	}
});

$(document).on("click", ".application-modify-btn", async function () {
	let f_id = $(this).attr("data-f-id");
	let type = $(this).attr("data-type");
	let index = $(this).attr("data-index");

	_showLoader();
	try {
		await setEditor(f_id, type, index);
	} catch (error) {
		alertjs.warning(
			{
				t: "Warning",
				m:
					error?.message ||
					"Unable to process payments try again later",
			},

			function () {},
		);
	} finally {
		_hideLoader();
	}
});

async function setEditor(f_id, type, index) {
	const _resp = await fetch("/set-editor", {
		method: "POST",
		body: JSON.stringify({ cfi: f_id }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const jsonData = await _resp.json();
	if (!_resp.ok) {
		throw new Error(jsonData.usrMsg || "Please try again later");
	}

	if (type === "EDIT") {
		window.location.assign("/user-details/" + regString);
		return false;
	}

	if (type === "RESUME") {
		var inArray = [
			updateData[index].g_done,

			updateData[index].e_done,

			updateData[index].d_done,

			updateData[index].p_done,

			updateData[index].payment_is_done,
		];

		$.each(inArray, function (index, value) {
			if (value === 0) {
				var url = "/user-details/";

				switch (index) {
					case 0:
						url = "/user-details/";

						break;

					case 1:
						url = "/education-details/";

						break;

					case 2:
						url = "/document-upload/";

						break;

					case 3:
						url = "/application-preview/";

						break;

					case 4:
						url = "/payment-page/";
				}

				//  console.log(url);

				window.location.assign(url + regString);

				return false;
			}
		});
	}
}
