// public/embed.js
(function () {
	// const SCRIPT_TAG =
	// 	document.currentScript ||
	// 	(function () {
	// 		// fallback
	// 		const scripts = document.getElementsByTagName("script");
	// 		return scripts[scripts.length - 1];
	// 	})();

	// const cfg = {
	// 	apiBase: "http://localhost:3001", // change to your domain
	// 	clientId: SCRIPT_TAG.getAttribute("data-client-id") || "",
	// 	prefillEmail: SCRIPT_TAG.getAttribute("data-prefill-email") || "",
	// 	prefillMobile: SCRIPT_TAG.getAttribute("data-prefill-mob") || "",
	// 	theme: SCRIPT_TAG.getAttribute("data-theme") || "indigo",
	// };
	const cfg = {
		apiBase: "http://localhost:3001/", // change to your domain
		clientId: "",
		prefillEmail: "",
		prefillMobile: "",
		theme: "indigo",
	};

	// if (!cfg.clientId) {
	// 	console.warn("[TicketEmbed] missing data-client-id on script tag.");
	// 	return;
	// }

	// Create floating button
	function createButton() {
		const btn = document.createElement("button");
		btn.id = "ticket-embed-btn";
		btn.type = "button";
		btn.setAttribute("aria-label", "Open support");
		btn.style.cssText = [
			"position:fixed",
			"right:24px",
			"bottom:24px",
			"z-index:2147483647",
			"background:#4f46e5", // indigo-600
			"color:white",
			"border-radius:12px",
			"padding:12px 18px",
			"font-weight:600",
			"box-shadow:0 10px 30px rgba(79,70,229,0.18)",
			"cursor:pointer",
		].join(";");

		btn.innerText = "Support";
		btn.addEventListener("click", openModal);
		document.body.appendChild(btn);
	}

	// Build modal + iframe
	function openModal() {
		// Prevent repeated calls
		if (document.getElementById("ticket-embed-modal")) return;

		showIframeModal(`${cfg.apiBase}start`);
	}

	function showIframeModal(src) {
		const modal = document.createElement("div");
		modal.id = "ticket-embed-modal";
		modal.style.cssText =
			"position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.48);z-index:2147483646;padding:20px;";

		const box = document.createElement("div");
		box.style.cssText =
			"width:100%;max-width:920px;height:90vh;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(2,6,23,0.5);position:relative;";

		const closeBtn = document.createElement("button");
		closeBtn.innerHTML = "✕";
		closeBtn.title = "Close";
		closeBtn.style.cssText =
			"position:absolute;right:12px;top:12px;background:transparent;border:none;font-size:20px;cursor:pointer;";
		closeBtn.addEventListener("click", () => modal.remove());

		const iframe = document.createElement("iframe");
		iframe.src = src;
		iframe.width = "100%";
		iframe.height = "100%";
		iframe.style.border = "0";

		iframe.setAttribute("allow", "clipboard-write;"); // optional
		iframe.setAttribute(
			"sandbox",
			"allow-scripts allow-same-origin allow-modals",
		);

		iframe.setAttribute(
			"sandbox",
			"allow-forms allow-scripts allow-same-origin allow-popups",
		); // tune as required

		box.appendChild(closeBtn);
		box.appendChild(iframe);
		modal.appendChild(box);
		document.body.appendChild(modal);

		// optional: listen for messages from the iframe (ticket events)
		window.addEventListener(
			"message",
			function handle(e) {
				// IMPORTANT: verify origin — compare to your ticket-system domain
				// if (e.origin !== 'https://tickets.example.com') return;
				const msg = e.data || {};
				if (msg && msg.type === "ticketCreated") {
					// host can react here (e.g., show toast). also forward to app-level callback if defined
					window.dispatchEvent(
						new CustomEvent("ticketEmbed:ticketCreated", {
							detail: msg,
						}),
					);
					// remove modal on create
					modal.remove();
				}
				if (msg && msg.type === "closeEmbed") {
					modal.remove();
				}
			},
			{ once: false },
		);
	}

	// expose a global API so host can open programmatically
	window.TicketEmbed = {
		open: openModal,
	};

	// init
	createButton();
})();
