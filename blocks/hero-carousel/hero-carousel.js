function initializeCarousel(block) {
  const slidesContainer = block.querySelector('.slides-container');
  const slides = block.querySelectorAll('.slide');
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination';
  block.appendChild(pagination);

  let currentSlide = 0;
  let autoplayInterval = null;
  const maxSlide = slides.length - 1;

  if (slides.length <= 1) {
    pagination.style.display = 'none';
    return;
  }

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50; // Minimum pixels for a swipe

  // --- MOVED FUNCTIONS UP ---
  // These functions are now defined before they are used below.

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.style.opacity = index === currentSlide ? '1' : '0';
      slide.setAttribute(
        'aria-hidden',
        index !== currentSlide ? 'true' : 'false',
      );
    });
    const dots = pagination.querySelectorAll('button');
    dots.forEach((dot, index) => {
      dot.className = index === currentSlide ? 'active' : '';
    });
  }

  function startAutoplay() {
    // eslint-disable-next-line no-use-before-define
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  function nextSlide() {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    updateSlides();
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left
      nextSlide();
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right
      prevSlide();
      resetAutoplay();
    }
  }

  // --- END OF MOVED FUNCTIONS ---

  // Create pagination dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      currentSlide = index;
      // Calls to updateSlides and resetAutoplay are now valid
      updateSlides();
      resetAutoplay();
    });
    pagination.appendChild(dot);
  });

  // Touch Event Handlers
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    // Call to handleSwipe is now valid
    handleSwipe();
  }

  slidesContainer.addEventListener('touchstart', handleTouchStart, {
    passive: true,
  });
  slidesContainer.addEventListener('touchend', handleTouchEnd, {
    passive: true,
  });

  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      resetAutoplay();
    }
  });

  block.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  block.addEventListener('mouseleave', startAutoplay);

  block.setAttribute('tabindex', '0');
  updateSlides();
  startAutoplay();
}

export default function decorate(block) {
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';

  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('slide');
    const [imageCol, textCol] = row.children;

    // **NEW: Handle the background image**
    if (imageCol) {
      const img = imageCol.querySelector('img');
      if (img) {
        // Get the image URL and apply it to the parent slide's background
        row.style.backgroundImage = `url(${img.src})`;
        // Remove the original image column so it doesn't take up space
        imageCol.remove();
      }
    }

    if (textCol) {
      textCol.classList.add('slide-text');
      // Check for headings before adding classes to avoid errors
      const h2 = textCol.querySelector('h2');
      const h3 = textCol.querySelector('h3');
      if (h2) h2.classList.add('slide-title');
      if (h3) h3.classList.add('slide-subtitle');

      // creting h3 element a button
      const allH3s = textCol.querySelectorAll('h3');
      allH3s.forEach((h3Element) => {
        // Check if the h3 is meant to be a button
        if (h3Element.textContent.trim().toLowerCase() === 'know more') {
          const link = document.createElement('a');
          link.href = '#'; // Set a placeholder link
          link.className = 'slide-button';
          link.textContent = h3Element.textContent;

          // Replace the h3 element with the new 'a' tag
          h3Element.replaceWith(link);
        }
      });
    }
    slidesContainer.appendChild(row);
  });

  block.innerHTML = '';
  block.appendChild(slidesContainer);

  initializeCarousel(block); // Assumes initializeCarousel is in the same file or imported
}
