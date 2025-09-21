export default function decorate(block) {
  const slides = [...block.children];

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'highlight-slides-container';

  // Create a wrapper for the animation
  const scrollingWrapper = document.createElement('div');
  scrollingWrapper.className = 'scrolling-wrapper';

  slides.forEach((slide) => {
    slide.className = 'highlight-slide';
    scrollingWrapper.appendChild(slide);
  });

  // Duplicate slides for a seamless loop
  slides.forEach((slide) => {
    scrollingWrapper.appendChild(slide.cloneNode(true));
  });

  // Clear the original block's content
  block.innerHTML = '';

  slidesContainer.appendChild(scrollingWrapper);
  block.appendChild(slidesContainer);
}
