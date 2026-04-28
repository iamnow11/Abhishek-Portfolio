const VISIBILITY_THRESHOLD = 0.5;

document.addEventListener('DOMContentLoaded', () => {
  const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.skill-progress') as HTMLElement;
        if (progressBar) {
          const targetProgress = progressBar.getAttribute('data-progress');
          progressBar.style.width = `${targetProgress}%`;
        }
        entry.target.classList.add('visible');
        skillProgressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: VISIBILITY_THRESHOLD });

  document.querySelectorAll('.skill-item').forEach(skillItem => {
    skillProgressObserver.observe(skillItem);
  });
});
