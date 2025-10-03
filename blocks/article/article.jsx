import { createRoot } from 'react-dom/client';

// React component to render the articles
function Article({ articles }) {
  return (
    <>
      {articles.map((article, index) => (
        <div key={index} className="article-item">
          <div
            className="article-image"
            dangerouslySetInnerHTML={{ __html: article.imageHTML }}
          />
          <div
            className="article-text"
            dangerouslySetInnerHTML={{ __html: article.textHTML }}
          />
        </div>
      ))}
    </>
  );
}

// The decorate function acts as the bridge from AEM to React
export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
  block.classList.add('article');

  // 1. Parse the AEM DOM into a clean data array
  const articlesData = [...block.children]
    .map((row) => {
      const [imageWrapper, textWrapper] = row.children;
      if (!imageWrapper || !textWrapper) return null;

      return {
        imageHTML: imageWrapper.innerHTML,
        textHTML: textWrapper.innerHTML,
      };
    })
    .filter(Boolean); // Filter out any malformed rows

  // 2. Render the React component
  const root = createRoot(block);
  block.innerHTML = ''; 
  root.render(<Article articles={articlesData} />);
}
