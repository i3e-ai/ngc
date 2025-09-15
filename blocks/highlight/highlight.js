/**
 * Decorates the highlight block as a carousel.
 * @param {Element} block The highlight block element
 */
export default function decorate(block) {
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'highlight-slides-container';
  block.innerHTML = ''; // Clear the block
  block.appendChild(slidesContainer);

  let slides = [];
  let currentSlide = 0;

  /**
   * Shows the next slide with a fade transition.
   */
  function showNextSlide() {
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  // Use a MutationObserver to build the carousel once the authored content is loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        // Stop observing once we have the content
        observer.disconnect();

        const rows = block.querySelectorAll(':scope > div');
        rows.forEach((row) => {
          const slide = document.createElement('div');
          slide.className = 'highlight-slide';

          const text = row.textContent.trim();
          // Split the content by the colon ':'
          const parts = text.split(':');

          if (parts.length >= 2) {
            const emojiAndTitle = parts[0].trim();
            const subtitle = parts
              .slice(1)
              .join(':')
              .trim(); // Join back in case subtitle has colons

            // The first character is likely the emoji
            const emoji = emojiAndTitle.substring(
              0,
              emojiAndTitle.indexOf(' ') + 1,
            );
            const title = emojiAndTitle.substring(
              emojiAndTitle.indexOf(' ') + 1,
            );

            slide.innerHTML = `
              <span class="highlight-emoji">${emoji}</span>
              <span class="highlight-title">${title}:</span>
              <span class="highlight-subtitle">${subtitle}</span>
            `;
            slidesContainer.appendChild(slide);
          }
        });

        slides = [...slidesContainer.children];
        if (slides.length > 0) {
          slides[0].classList.add('active');
          if (slides.length > 1) {
            setInterval(showNextSlide, 4000); // Change slide every 4 seconds
          }
        }
      }
    });
  });

  // Start observing the block for the initial authored content
  observer.observe(block, { childList: true });
}
