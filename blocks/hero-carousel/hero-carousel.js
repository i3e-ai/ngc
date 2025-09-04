function initializeCarousel(block, nextBtn, prevBtn) {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  if (slides.length === 0) {
    return;
  }

  function updateButtonStates() {
    if (prevBtn) {
      prevBtn.setAttribute(
        'aria-disabled',
        currentSlide === 0 ? 'true' : 'false',
      );
    }
    if (nextBtn) {
      nextBtn.setAttribute(
        'aria-disabled',
        currentSlide === maxSlide ? 'true' : 'false',
      );
    }
  }

  // Set initial positions
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
    slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
  });

  function updateSlides() {
    slides.forEach((slide, index) => {
      const translateValue = 100 * (index - currentSlide);
      slide.style.transform = `translateX(${translateValue}%)`;
      slide.setAttribute(
        'aria-hidden',
        index !== currentSlide ? 'true' : 'false',
      );
    });

    // Update button states for accessibility
    updateButtonStates();
  }

  /**
   * Moves to next slide
   */
  function nextSlide() {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    updateSlides();
  }

  /**
   * Moves to previous slide
   */
  function prevSlide() {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    updateSlides();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  });

  block.setAttribute('tabindex', '0');
  updateButtonStates();
}

export default function decorate(block) {
  // Create navigation buttons
  function createButton(className, text) {
    const button = document.createElement('button');
    button.classList.add('btn', className);
    button.setAttribute('aria-label', text);
    button.textContent = text;
    return button;
  }

  // Assumed variables based on original code
  let nextBtn;
  let prevBtn;
  const rows = [...block.children];

  // Process each row
  rows.forEach((row) => {
    const centerDiv = row.querySelector('div[data-align="center"]');

    if (centerDiv) {
      // Check for navigation symbols
      const heading = centerDiv.querySelector('h1, h2');
      if (heading) {
        const symbol = heading.textContent.trim();
        if (symbol === '<') {
          // Create next button
          nextBtn = createButton('btn-next', 'Next');
          row.replaceWith(nextBtn);
          return;
        }
        if (symbol === '>') {
          // Create previous button
          prevBtn = createButton('btn-prev', 'Previous');
          row.replaceWith(prevBtn);
          return;
        }
      }
    }

    // This is a content slide
    row.classList.add('slide');

    // Process columns
    const columns = [...row.children];
    columns.forEach((col, colIndex) => {
      if (colIndex === 0) {
        col.classList.add('slide-image');
      } else if (colIndex === 1) {
        col.classList.add('slide-text');

        // Add classes to headings
        const h2 = col.querySelector('h2');
        const h3 = col.querySelector('h3');

        if (h2) h2.classList.add('slide-title');
        if (h3) h3.classList.add('slide-subtitle');
      }
    });
  });

  // Initialize carousel functionality
  initializeCarousel(block, nextBtn, prevBtn);
}
