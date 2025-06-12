// Pagination Script
(function () {
  const modulesPerPage = 5;
  const container = document.body;
  const pagination = document.getElementById('pagination');
  const sections = Array.from(container.querySelectorAll('section'));
  let currentPage = 1;
  const totalPages = Math.ceil(sections.length / modulesPerPage);

  function showPage(page) {
    currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * modulesPerPage;
    const end = start + modulesPerPage;

    sections.forEach((section, idx) => {
      section.style.display = idx >= start && idx < end ? 'block' : 'none';
    });

    renderPagination();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPagination() {
    pagination.innerHTML = '';

    const createButton = (label, pageNum, disabled = false, isActive = false) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      if (isActive) btn.classList.add('active');
      btn.disabled = disabled;
      if (!disabled) btn.onclick = () => showPage(pageNum);
      pagination.appendChild(btn);
    };

    createButton('Previous', currentPage - 1, currentPage === 1);

    const maxButtons = 7;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    if (start > 1) {
      createButton(1, 1);
      if (start > 2) pagination.appendChild(document.createTextNode('...'));
    }

    for (let i = start; i <= end; i++) {
      createButton(i, i, false, i === currentPage);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pagination.appendChild(document.createTextNode('...'));
      createButton(totalPages, totalPages);
    }

    createButton('Next', currentPage + 1, currentPage === totalPages);
  }

  showPage(1);
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Slideshow Setup ---
  const images = [
    "img/ev.png", "img/img1.jpg", "img/img2.png", "img/img3.png", "img/img4.png",
    "img/img5.png", "img/img6.png", "img/img7.png", "img/img8.png", "img/img9.png"
  ];
  const captions = [
    "Passenger Coach", "Trestle", "BFL", "TUG",
    "Passenger Ramp", "APU", "GPU",
    "Trolley"];
  let currentIndex = 0;
  const img = document.getElementById("slideshow-img");
  const caption = document.getElementById("caption");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  function updateSlideshow() {
    if (!img || !caption) return;
    img.src = images[currentIndex];
    img.alt = captions[currentIndex] || "Slideshow image";
    caption.textContent = captions[currentIndex] || "";
  }

  function changeSlide(n) {
    currentIndex = (currentIndex + n + images.length) % images.length;
    updateSlideshow();
  }

  if (prev) prev.addEventListener("click", () => changeSlide(-1));
  if (next) next.addEventListener("click", () => changeSlide(1));
  updateSlideshow();

  // --- Scroll Buttons ---
  const scrollUpBtn = document.getElementById('scroll-up');
  const scrollDownBtn = document.getElementById('scroll-down');

  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  // --- Module Progress Tracking ---
  const moduleSequence = ['day1', 'quiz1', 'day2', 'quiz2', 'quiz3'];
  const buttons = document.querySelectorAll('.day-button');

  // Disable all buttons except Day 1 initially
  buttons.forEach(btn => {
    const day = btn.dataset.day;
    btn.disabled = day !== 'day1';
  });

  // Restore progress from localStorage
  const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');

  function updateButtonStates() {
    buttons.forEach(btn => {
      const currentDay = btn.dataset.day;
      const index = moduleSequence.indexOf(currentDay);

      btn.disabled = !(index === 0 || completedModules.includes(moduleSequence[index - 1]));

      if (completedModules.includes(currentDay)) {
        btn.classList.add('completed');
      }
    });
  }

  updateButtonStates();

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      if (!completedModules.includes(day)) {
        completedModules.push(day);
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
        updateButtonStates();
      }
    });
  });

  // --- Anti Right-Click and Screenshot Protection ---
  document.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', e => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('').catch(() => {});
      alert('Screenshots are disabled on this page.');
      e.preventDefault();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      alert('Printing is disabled on this page.');
      e.preventDefault();
    }
  });

  // --- Blur on Tab Switch (Privacy) ---
  function blurScreen() {
    document.body.style.filter = 'blur(5px)';
  }
  function unblurScreen() {
    document.body.style.filter = 'none';
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) blurScreen();
    else unblurScreen();
  });

  // --- Mobile Gesture Blocking ---
  document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturestart', e => e.preventDefault());
});
