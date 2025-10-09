$(document).ready(() => {
	function scrollToDivExcludingNavbar(divId, navbarSelector) {
		const target = document.getElementById(divId);
		const navbar = document.querySelector(navbarSelector);

		if (!target) {
			console.warn(`Div with id "${divId}" not found.`);
			return;
		}

		const navbarHeight = navbar ? navbar.offsetHeight : 0;
		const elementPosition =
			target.getBoundingClientRect().top + window.pageYOffset;
		const offsetPosition = elementPosition - navbarHeight;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	}

	$(".scroll-to-btn").on("click", function () {
		const target = $(this).attr("data-target-div");
		scrollToDivExcludingNavbar(target, "header");
	});
});
