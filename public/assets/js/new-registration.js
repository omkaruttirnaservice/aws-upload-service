import { alertjs } from "./common.js";

$(function () {
	$(".check_confimation").on("focus", function (e) {
		var _this = $(this);
		var d_id = _this.attr("data-confirmWith");
		var main_data = $("#" + d_id).val();
		if (main_data.length < 1) {
			_this
				.siblings("small")
				.html("Type Upper Value First")
				.addClass("text-danger");
			$("#" + d_id).focus();
		} else {
			_this.siblings("small").html("").removeClass("text-danger");
		}
	});

	$(".setFullName").blur(function () {
		var full_name =
			$("#newFname").val() +
			" " +
			$("#newMname").val() +
			" " +
			$("#newLname").val();
		console.log(full_name);
		fullName == ""
			? $("#fullName").val("Here Your Name Will Appeard")
			: $("#fullName").val(full_name.toUpperCase());
	});

	var validate = $("#newRegDetails").validate({
		rules: {
			newAadharNumber: {
				required: true,
				number: true,
				minlength: 12,
				maxlength: 12,
			},
			checkAddhar: {
				required: true,
				equalTo: "#newAadharNumber",
			},
			newFname: {
				required: true,
				lettersonly: true,
				noSpaces: true,
			},
			checkNewFname: {
				required: true,
				equalTo: "#newFname",
			},
			newMname: {
				required: true,
				lettersonly: true,
			},
			checkNewMname: {
				required: true,
				equalTo: "#newMname",
			},
			newLname: {
				required: true,
				lettersonly: true,
				noSpaces: true,
			},
			checkNewLname: {
				required: true,
				equalTo: "#newLname",
			},
			newMobileNumber: {
				required: true,
				number: true,
				minlength: 10,
				maxlength: 10,
				validMobileNumber: true,
			},
			checkNewMobileNumber: {
				required: true,
				equalTo: "#newMobileNumber",
			},
			newAlternativeMobileNumber: {
				minlength: {
					param: 10,
					depends: function (element) {
						return $(element).val().length > 0;
					},
				},
				maxlength: {
					param: 10,
					depends: function (element) {
						return $(element).val().length > 0;
					},
				},
				validMobileNumber: {
					depends: function (element) {
						return $(element).val().length > 0;
					},
				},
			},
			newMailPartOne: {
				required: true,
				email: true,
				allowedEmail: true,
			},
			checkNewMailPartOne: {
				required: true,
				equalTo: "#newMailPartOne",
				allowedEmail: true,
			},
		},
		messages: {
			newAadharNumber: {
				required: "Enter Aadhaar Number",
				number: "Invalid Aadhaar Number.",
				minlength: "12 Digits Only",
				maxlength: "12 Digits Only",
			},
			checkAddhar: {
				required: "Enter Aadhaar Number",
				equalTo: "Aadhaar Numbers doesn't match.",
			},
			// newPanCard: {
			//     minlength: 'PAN card Must Be {0} Digits.',
			//     maxlength: 'PAN card Must Be {0} Digits.',
			// },
			// checkPanCard: {
			//     equalTo: "PAN card number doesn't match.",
			// },
			newFname: {
				required: "Enter First Name.",
				lettersonly: "Invalid First Name.",
				noSpaces: "Enter First Name.",
			},
			checkNewFname: {
				required: "Enter First Name.",
				equalTo: "First names don't match.",
			},
			newMname: {
				required: "Enter Middle Name.",
				lettersonly: "Invalid Middle Name.",
			},
			checkNewMname: {
				required: "Enter Middle Name.",
				equalTo: "Middle names doesn't match.",
			},
			newLname: {
				required: "Enter Last Name.",
				lettersonly: "Invalid Last Name.",
				noSpaces: "Enter Last Name.",
			},
			checkNewLname: {
				required: "Enter Last Name.",
				equalTo: "Last names doesn't match.",
			},
			newMobileNumber: {
				required: "Enter Mobile Number.",
				number: "Invalid Mobile Number.",
				validMobileNumber: "Enter valid mobile number",
			},
			checkNewMobileNumber: {
				required: "Enter Mobile Number.",
				equalTo: "Mobile numbers doesn't match.",
			},
			newAlternativeMobileNumber: {
				number: "Invalid Alternative Mobile Number.",
				minlength: "Mobile Number Must Be {0} Digits.",
				maxlength: "Mobile Number Must Be {0} Digits.",
			},
			newMailPartOne: {
				required: "Enter Mail ID.",
				email: "Invalid Email ID.",
			},
			checkNewMailPartOne: {
				required: "Enter Email Id.",
				equalTo: "Confirm Mail ID Doesn't Match",
			},
		},
		// errorPlacement: function (error, element) {
		//     if (element.is('.oneMailError')) {
		//         //$('.setOneMailError').html('');
		//         error.appendTo(element.siblings('.setOneMailError'));
		//         //$("label[class='error']").addClass('text-danger font-weight-bolder');
		//     } else {
		//         if (element.is('.twoMailError')) {
		//             // $('.setTwoMailError').html('');
		//             error.appendTo(element.siblings('.setTwoMailError'));
		//             //$("label[class='error']").addClass('text-danger font-weight-bolder');
		//         } else {
		//             let e = $(element).parent('div').parent('td');
		//             error.appendTo(e);
		//         }
		//     }
		//     $("label[class='error']").addClass(
		//         'text-danger font-weight-bolder'
		//     );
		// },
	});

	function checkDeclerationChecked() {
		return $("#reg-decleration-confirm").prop("checked");
	}

	function checkPopupDeclerationChecked() {
		return $("#reg-decleration-confirm-popup").prop("checked");
	}

	$("#verifyNewRegistration").click(function (e) {
		e.preventDefault();

		validate;

		// return;

		if (!$("#newRegDetails").valid()) {
			alertjs.warning(
				{
					t: "Warning",
					m: "Please fill in all the required details. <br/> (कृपया सर्व आवश्यक तपशील भरा.)",
				},
				function () {
					$("label[class='error']").addClass(
						"text-danger font-weight-bolder",
					);
				},
			);
		} else {
			if (!checkDeclerationChecked()) {
				alertjs.warning(
					{
						t: "Warning",
						m: "Please confirm the declaration before proceeding. <br/> पुढे जाण्यापूर्वी कृपया घोषणापत्राची पुष्टी करा.",
					},
					() => {},
				);
				return false;
			}

			alertjs.success(
				{
					t: "Verified",
					m: "You can now submit the registration. <br/> आपण आता नोंदणी सादर करू शकता.",
				},
				function () {
					$("#saveNewRegistration").show();
				},
			);
		}
	});

	$("#saveNewRegistration").hide();
	$("#saveNewRegistration").click(function (e) {
		e.preventDefault();

		var $this = $(this);

		if (!$("#newRegDetails").valid()) {
			alertjs.warning(
				{
					t: "Warning",
					m: "Some fields are invalid. Please check and fill all details correctly. <br/> काही माहिती चुकीची आहे. कृपया सर्व तपशील नीट भरा. ",
				},
				function () {
					$("label[class='error']").addClass(
						"text-danger font-weight-bolder",
					);
				},
			);
			return false;
		}
		checkForValidation();

		if (!checkDeclerationChecked()) {
			alertjs.warning(
				{
					t: "Warning",
					m: "Please confirm the declaration before proceeding. <br/> पुढे जाण्यापूर्वी कृपया घोषणापत्राची पुष्टी करा.",
				},
				() => {},
			);
			return false;
		}

		saveRegistration();
		// showPreviewModal();
	});

	$(document).on("click", "#confirmRegDetails", function (e) {
		if (!checkPopupDeclerationChecked()) {
			alertjs.warning(
				{
					t: "Warning",
					m: "Please confirm the declaration before proceeding. <br/> पुढे जाण्यापूर्वी कृपया घोषणापत्राची पुष्टी करा.",
				},
				() => {},
			);
			return false;
		}
		// saveRegistration();
	});

	function saveRegistration() {
		let $this = $("#saveNewRegistration");
		$this.prop("disabled", true);
		$.ajax({
			method: "POST",
			url: "registerd-new-user",
			data: newRegArray,
		})
			.done(function (data, status) {
				$this.prop("disabled", false).html(`Submit`);

				var json = data;
				if (json._call == 1) {
					$this.prop("disabled", false).html(`Submit`);

					alertjs.success(
						{
							t: "Congratulations (अभिनंदन) ",
							m: "Registration completed successfully. <br/> नोंदणी यशस्वीरीत्या पूर्ण झाली आहे.",
						},
						function () {
							window.location.replace(
								"/user-eligibility/" + json.resp_id,
							);
						},
					);
				}
				if (json._call == 2) {
					$this.prop("disabled", false).html(`Submit`);

					alertjs.warning(
						{
							t: "Already Registered",
							m: "This Aadhaar number is already registered.<br /> हा आधार क्रमांक आधीच नोंदणीकृत आहे.",
						},
						function () {},
					);
				}
			})
			.fail(function (error) {
				$this.prop("disabled", false).html(`Submit`);
				alertjs.error(function () {
					console.log(error);
				});
			})
			.always(function () {
				$this.prop("disabled", false).html(`Submit`);
			});
	}
});

function checkForValidation() {
	newRegArray.newAadharNumber = $("#" + ids[0]).val();
	newRegArray.newFname = $("#" + ids[1]).val();
	newRegArray.newMname = $("#" + ids[2]).val();
	newRegArray.newLname = $("#" + ids[3]).val();
	newRegArray.newMobileNumber = $("#" + ids[4]).val();
	newRegArray.newAlternativeMobileNumber = $("#" + ids[5]).val();
	newRegArray.newMailPartOne = $("#" + ids[6]).val();
	newRegArray.newMailPartTwo = $("#" + ids[7]).val();
}
// newRegArray.newPanCard = $('#' + ids[8]).val();

var ids = [
	"newAadharNumber",
	"newFname",
	"newMname",
	"newLname",
	"newMobileNumber",
	"newAlternativeMobileNumber",
	"newMailPartOne",
	"newMailPartTwo",
];
// 'newPanCard',

var newRegArray = {
	newAadharNumber: "",
	newFname: "",
	newMname: "",
	newLname: "",
	newMobileNumber: "",
	newAlternativeMobileNumber: "",
	newMailPartOne: "",
	newMailPartTwo: "",
};
// newPanCard: '',

function showPreviewModal() {
	$("#previewAadhar").text(newRegArray.newAadharNumber);
	$("#previewFname").text(newRegArray.newFname);
	$("#previewMname").text(newRegArray.newMname);
	$("#previewLname").text(newRegArray.newLname);
	$("#previewMobile").text(newRegArray.newMobileNumber);
	$("#previewAltMobile").text(newRegArray.newAlternativeMobileNumber);
	$("#previewEmail").text(newRegArray.newMailPartOne);

	// Show modal using Bootstrap 5 + jQuery
	$("#reg-details-preview-modal").modal("show");
}
