const SCROLL_VISIBILITY_THRESHOLD = 0.1;

// Theme: apply saved preference immediately to prevent flash of unstyled theme
document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

// Reading progress bar
function updateReadingProgress(): void {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressPercent = (scrollTop / scrollableHeight) * 100;
  const progressBar = document.getElementById("reading-progress");

  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });

// Scroll-triggered visibility: adds .visible class when elements enter viewport
if ("IntersectionObserver" in window) {
  const scrollVisibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: SCROLL_VISIBILITY_THRESHOLD },
  );

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fade-in, .slide-up").forEach((element) => {
      scrollVisibilityObserver.observe(element);
    });
  });
}

// Console easter egg
console.log(
  "%c> abhishek.init()",
  "color: #fff; font-family: monospace; font-size: 14px; font-weight: bold;"
);
console.log(
  "%cSenior Frontend Engineer. Focused on performance optimization and scalable enterprise platforms.",
  "color: #888; font-family: monospace; font-size: 11px;"
);
console.log(
  "%c\nStack: Angular, React, TypeScript, NgRx.\n\nLooking at the source? Good instinct.\nhttps://github.com/iamnow11",
  "color: #666; font-family: monospace; font-size: 11px;"
);
