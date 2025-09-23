export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [imageCol, contentCol] = [...row.children];
  const image = imageCol.querySelector('picture img'); // Get the final img element

  if (image) {
    // Construct the URL without any width parameters to get the full-size image
    const imageUrl = new URL(image.src).pathname;
    block.style.backgroundImage = `url(${imageUrl})`;
  }
  imageCol.remove();

  contentCol.classList.add('hero-content');
  block.append(contentCol);
  row.remove();
}
