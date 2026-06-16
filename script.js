document.addEventListener("DOMContentLoaded", () => {
	const header = document.getElementById("header");
	const menuToggle = document.getElementById("menu-toggle");
	const navMenu = document.getElementById("nav-menu");
	const navLinks = document.querySelectorAll(".nav-menu a");

	// Menú Hamburguesa
	if (menuToggle) {
		menuToggle.addEventListener("click", () => {
			navMenu.classList.toggle("active");
			// Cambiar color de barras si es necesario
			const spans = menuToggle.querySelectorAll("span");
			spans.forEach(
				(s) =>
					(s.style.background = navMenu.classList.contains("active")
						? "white"
						: ""),
			);
		});
	}

	// Cerrar menú al clickear link
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			navMenu.classList.remove("active");
		});
	});

	// Scroll Header
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header.classList.add("scrolled");
		} else {
			header.classList.remove("scrolled");
		}
	});

	// FAQ Acordeón
	const faqItems = document.querySelectorAll(".faq-item");
	faqItems.forEach((item) => {
		const question = item.querySelector(".faq-question");
		question.addEventListener("click", () => {
			faqItems.forEach((other) => {
				if (other !== item) other.classList.remove("active");
			});
			item.classList.toggle("active");
		});
	});
});
