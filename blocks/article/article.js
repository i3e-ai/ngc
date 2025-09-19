export default function decorate(block) {
  // Select each row in the block, where each row represents an article.
  const articles = [...block.children];
  articles.forEach((article) => {
    article.classList.add('article-item');

    const [imageWrapper, textWrapper] = article.children;

    if (imageWrapper) {
      imageWrapper.classList.add('article-image');
    }
    if (textWrapper) {
      textWrapper.classList.add('article-text');
    }
  });
}