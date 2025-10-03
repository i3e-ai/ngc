import { createRoot } from 'react-dom/client';

function Hero({ contentHTML }) {
  // This component renders the content that overlays the hero background.
  return (
    <div
      className="hero-content"
      dangerouslySetInnerHTML={{ __html: contentHTML }}
    />
  );
}

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
  block.classList.add('hero');

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [imageCol, contentCol] = [...row.children];
  const image = imageCol?.querySelector('picture img');

  let contentHTML = '';
  if (contentCol) {
    contentHTML = contentCol.innerHTML;
  }

  if (image) {
    // Perform LCP optimizations on the original image element.
    image.loading = 'eager';
    image.setAttribute('fetchpriority', 'high');

    const imageUrl = new URL(image.src).pathname;
    block.style.backgroundImage = `url(${imageUrl})`;

    // The preload link is a one-time setup action, best handled here.
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  }

  // Render the React component into the now-prepared block.
  block.innerHTML = '';
  const root = createRoot(block);
  root.render(<Hero contentHTML={contentHTML} />);
}
