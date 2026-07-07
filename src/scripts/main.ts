const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

toggle?.addEventListener("click", () => {
	links?.classList.toggle("open");
});

links?.addEventListener("click", (e) => {
	if ((e.target as HTMLElement).tagName === "A") {
		links.classList.remove("open");
	}
});

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el: HTMLElement) {
	el.dataset.done = "1";
	const target = parseInt(el.dataset.count ?? "0", 10);
	const prefix = el.dataset.prefix || "";
	const suffix = el.dataset.suffix || "";

	if (reduced) {
		el.textContent = prefix + target + suffix;
		return;
	}

	let start: number | null = null;
	function step(ts: number) {
		if (!start) start = ts;
		const p = Math.min((ts - start) / 1100, 1);
		el.textContent = prefix + Math.floor(p * target) + suffix;
		if (p < 1) requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
}

const io = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				const counter = entry.target.querySelector<HTMLElement>("[data-count]");
				if (counter && !counter.dataset.done) animateCount(counter);
				io.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.18 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const newsBtn = document.getElementById("newsBtn") as HTMLButtonElement | null;
const newsEmail = document.getElementById("newsEmail") as HTMLInputElement | null;

newsBtn?.addEventListener("click", () => {
	if (!newsEmail) return;
	if (newsEmail.value && newsEmail.value.indexOf("@") > 0) {
		newsBtn.textContent = "¡Suscrito! ✓";
		newsBtn.disabled = true;
		newsEmail.disabled = true;
	} else {
		newsEmail.style.borderColor = "#ff6b6b";
		newsEmail.focus();
	}
});
