const FOLLOWER_LERP_FACTOR = 0.1;
const INTERACTIVE_ELEMENTS_SELECTOR = "a, button, .project-card, .skill-bar, input, textarea, .achievement-card";

const cursorDot = document.getElementById("custom-cursor");
const cursorFollower = document.getElementById("cursor-follower");

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursorDot) {
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }
});

function animateFollower(): void {
  followerX += (mouseX - followerX) * FOLLOWER_LERP_FACTOR;
  followerY += (mouseY - followerY) * FOLLOWER_LERP_FACTOR;

  if (cursorFollower) {
    cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
  }

  requestAnimationFrame(animateFollower);
}

animateFollower();

// Expand cursor follower when hovering over interactive elements
document.body.addEventListener("mouseover", (event) => {
  const target = event.target as HTMLElement;
  const isInteractive = target.closest(INTERACTIVE_ELEMENTS_SELECTOR);

  if (isInteractive) {
    cursorDot?.classList.add("active");
    cursorFollower?.classList.add("active");
  } else {
    cursorDot?.classList.remove("active");
    cursorFollower?.classList.remove("active");
  }
});
