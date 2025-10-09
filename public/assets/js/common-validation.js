$(function () {
	$(".numaricwithdecimal").on("keypress keyup blur", function (event) {
		var limit = $(this).data("limiter");

		var value = $(this).val();

		if (limit === undefined) limit = 999;

		var rex = /[^0-9.]/g;

		if (value.length < limit) {
			if (rex.test(value)) {
				$(this).val(value.replace(rex, ""));
			}
		} else {
			value = value.slice(0, limit);

			$(this).val(value.replace(rex, ""));
		}
	});

	$(".numaric").on("keypress keyup blur", function (event) {
		var limit = $(this).data("limiter");

		var value = $(this).val();

		if (limit === undefined) limit = 999;

		var rex = /\D/g;

		if (value.length < limit) {
			if (rex.test(value)) {
				$(this).val(value.replace(rex, ""));
			}
		} else {
			value = value.slice(0, limit);

			$(this).val(value.replace(rex, ""));
		}
	});

	$(".onlyalpha").on("keypress keyup blur", function (event) {
		var value = $(this).val();

		var rex = /[^a-zA-Z ]/g;

		$(this).val(value.replace(rex, ""));
	});

	$(".onlyalphawithdecimal").on("keypress keyup blur", function (event) {
		var value = $(this).val();

		var rex = /[^a-zA-Z.() ]/g;

		$(this).val(value.replace(rex, ""));
	});

	$(".onlyalphawithdash").on("keypress keyup blur", function (event) {
		var value = $(this).val();

		var rex = /[^a-zA-Z- ]/g;

		$(this).val(value.replace(rex, ""));
	});

	$(".onlyAlphaNumeric").on("keypress keyup blur", function (event) {
		var value = $(this).val();

		var rex = /[^A-Z0-9]/g;

		var limit = Number($(this).data("limiter"));

		var length = value.length;

		if (length > limit) {
			value = value.slice(0, limit);

			$(this).val(value);
		} else {
			$(this).val(value.replace(rex, ""));
		}
	});
});

// jquery validation custom methods
// For registration page
// mobile number starts with 6,7,8,9 only
$.validator.addMethod(
	"validMobileNumber",
	function (value, element) {
		return /^[6-9][0-9]{9}$/.test(value);
	},
	"Enter valid mobile number",
);

$.validator.addMethod(
	"allowedEmail",
	function (value, element) {
		if (!value) return false; // required check if needed

		// Basic email regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return false;
		}

		// Extract domain
		const domain = value.split("@")[1].toLowerCase();

		// Allowed domains list
		const allowedDomains = [
			"gmail.com",
			"yahoo.com",
			"outlook.com",
			"rediff.com",
			"hotmail.com",
			"icloud.com",
		];

		return allowedDomains.includes(domain);
	},
	"Enter a valid email",
);
