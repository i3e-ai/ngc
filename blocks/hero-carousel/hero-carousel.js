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

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.style.opacity = index === currentSlide ? '1' : '0';
    });
    const dots = pagination.querySelectorAll('button');
    dots.forEach((dot, index) => {
      dot.className = index === currentSlide ? 'active' : '';
    });
  }

  function nextSlide() {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    updateSlides();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      resetAutoplay();
    }
  }

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlides();
      resetAutoplay();
    });
    pagination.appendChild(dot);
  });

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
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

  updateSlides();
  startAutoplay();
}

export default function decorate(block) {
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';

  const rows = [...block.children];

  rows.forEach((row, index) => {
    row.classList.add('slide');

    if(row.children.length < 2) return;
    const [imageCol, textCol] = row.children;

    imageCol.classList.add('slide-image');
    
    // Optimize image loading for LCP and CLS
    const img = imageCol.querySelector('img');
    if (img) {
      // First slide should load eagerly for better LCP
      if (index === 0) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.loading = 'lazy';
      }
      
      // Add dimensions to prevent CLS if not already present
      if (!img.width && !img.height) {
        img.width = '2000';
        img.height = '1200';
        img.style.aspectRatio = '5/3';
      }
    }

      textCol.classList.add('slide-text');
      const h2 = textCol.querySelector('h2');
      const h3 = textCol.querySelector('h3');
      if (h2) h2.classList.add('slide-title');
      if (h3) h3.classList.add('slide-subtitle');

      const allH3s = textCol.querySelectorAll('h3');
      allH3s.forEach((h3Element) => {
        if (h3Element.textContent.trim().toLowerCase() === 'know more') {
          const link = document.createElement('a');
          link.href = '#';
          link.className = 'slide-button';
          link.textContent = h3Element.textContent;
          h3Element.replaceWith(link);
        }
      });
    
    slidesContainer.appendChild(row);
  });

  block.innerHTML = '';
  block.appendChild(slidesContainer);

  initializeCarousel(block);
}
