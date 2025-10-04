import { createRoot } from 'react-dom/client';

function Testimonial({ quote, author }) {
  // Use a React Fragment to render sibling elements.
  return (
    <>
      <blockquote>
        <p>{quote}</p>
      </blockquote>
      <cite>{author}</cite>
    </>
  );
}

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
  block.classList.add('testimonial');

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [authorCell, quoteCell] = row.children;

  const testimonialData = {
    author: authorCell?.querySelector('h2')?.textContent || '',
    quote: quoteCell?.querySelector('h3')?.textContent || '',
  };

  block.innerHTML = '';
  const root = createRoot(block);
  root.render(
    <Testimonial
      quote={testimonialData.quote}
      author={testimonialData.author}
    />,
  );
}
