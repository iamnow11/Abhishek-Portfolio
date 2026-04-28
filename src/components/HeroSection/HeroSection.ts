const BACK_TO_TOP_SCROLL_THRESHOLD = 300;
const CHARACTER_STAGGER_DELAY = 0.06;

const backToTopButton = document.getElementById("backToTop");

// Show/hide back-to-top button based on scroll position
window.addEventListener(
  "scroll",
  () => {
    if (backToTopButton) {
      backToTopButton.classList.toggle("visible", window.pageYOffset > BACK_TO_TOP_SCROLL_THRESHOLD);
    }
  },
  { passive: true }
);

backToTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Stagger character-by-character fade-in animation for the hero name
document.addEventListener("DOMContentLoaded", () => {
  const nameCharacters = document.querySelectorAll(".name-char");
  nameCharacters.forEach((character, index) => {
    (character as HTMLElement).style.animationDelay = `${index * CHARACTER_STAGGER_DELAY}s`;
    character.classList.add("fade-in");
  });
});
