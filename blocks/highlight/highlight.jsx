import { createRoot } from 'react-dom/client';

function Highlight({ slidesHTML }) {
  // Duplicate the slides array to create a seamless looping effect with CSS animations.
  const duplicatedSlides = [...slidesHTML, ...slidesHTML];

  return (
    <div className="highlight-slides-container">
      <div className="scrolling-wrapper">
        {duplicatedSlides.map((slideHTML, index) => (
          <div
            key={index}
            className="highlight-slide"
            dangerouslySetInnerHTML={{ __html: slideHTML }}
          />
        ))}
      </div>
    </div>
  );
}

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
  block.classList.add('highlight');

  // Extract the HTML content from each slide authored in AEM.
  const slidesHTML = [...block.children].map((slide) => slide.innerHTML);

  // Render the React component into the block.
  block.innerHTML = '';
  const root = createRoot(block);
  root.render(<Highlight slidesHTML={slidesHTML} />);
}
