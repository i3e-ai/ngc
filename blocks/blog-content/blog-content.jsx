import { createRoot } from 'react-dom/client';

function ArticleBody({ bodyHTML }) {
  return <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />;
}

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';

  // 1. Find and extract the inner HTML from the AEM wrapper (div > div).
  const contentWrapper = block.querySelector(':scope > div > div');
  if (!contentWrapper) return;

  const bodyHTML = contentWrapper.innerHTML;

  // 2. Prepare the main block element and render the React component.
  block.classList.add('article-body');
  block.innerHTML = '';

  const root = createRoot(block);
  root.render(<ArticleBody bodyHTML={bodyHTML} />);
}
