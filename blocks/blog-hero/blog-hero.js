export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [imageCol, contentCol] = [...row.children];
  const image = imageCol.querySelector('picture img'); // Get the final img element

  if (image) {
    // Optimize for LCP since this is likely above-the-fold
    image.loading = 'eager';
    image.setAttribute('fetchpriority', 'high');
    
    // Construct the URL without any width parameters to get the full-size image
    const imageUrl = new URL(image.src).pathname;
    block.style.backgroundImage = `url(${imageUrl})`;
    
    // Preload the background image for better LCP
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  }
  imageCol.remove();

  contentCol.classList.add('hero-content');
  block.append(contentCol);
  row.remove();
}
