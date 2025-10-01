import { createRoot } from 'react-dom/client';
import { useState, useEffect, useCallback } from 'react';

function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        goToNext();
        setIsAutoPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const handleDotClick = (index) => {
    goToSlide(index);
    setIsAutoPlaying(false);
  };

  const handleNavClick = (direction) => {
    if (direction === 'prev') {
      goToPrev();
    } else {
      goToNext();
    }
    setIsAutoPlaying(false);
  };

  if (slides.length === 0) {
    return <div className="hero-carousel-empty">No slides available</div>;
  }

  return (
    <div className="hero-carousel-container">
      {/* Slides */}
      <div className="hero-carousel-track">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            dangerouslySetInnerHTML={{ __html: slide.htmlContent }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-nav prev"
            onClick={() => handleNavClick('prev')}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-nav next"
            onClick={() => handleNavClick('next')}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {slides.length > 1 && (
        <button
          type="button"
          className="carousel-play-pause"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isAutoPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default function decorate(block) {
  const slideData = [...block.children].map((row, index) => {
    row.classList.add('slide');

    if (row.children.length < 2) {
      return { htmlContent: row.innerHTML };
    }

    const [imageCol, textCol] = row.children;
    imageCol.classList.add('slide-image');
    textCol.classList.add('slide-text');

    // Optimize image loading
    const img = imageCol.querySelector('img');
    if (img) {
      if (index === 0) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.loading = 'lazy';
      }
    }

    // Add classes to heading elements
    const h2 = textCol.querySelector('h2');
    if (h2) h2.classList.add('slide-title');

    const h3 = textCol.querySelector('h3');
    if (h3) h3.classList.add('slide-subtitle');

    // Convert "Know More" h3 to button/link
    const allH3s = textCol.querySelectorAll('h3');
    allH3s.forEach((h3Element) => {
      if (h3Element.textContent.trim().toLowerCase() === 'know more') {
        const link = document.createElement('a');
        link.href = '#'; // Update with actual link if available
        link.className = 'slide-button';
        link.textContent = h3Element.textContent;
        h3Element.replaceWith(link);
      }
    });

    return {
      htmlContent: row.innerHTML,
    };
  });

  block.innerHTML = '';

  const root = createRoot(block);
  root.render(<HeroCarousel slides={slideData} />);
}
