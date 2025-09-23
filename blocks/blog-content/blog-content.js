export default function decorate(block) {
  // Find the div that contains your article's content.
  // When you put content in a block table, EDS wraps it in div > div.
  const contentWrapper = block.querySelector(':scope > div > div');
  if (!contentWrapper) return;

  block.innerHTML = contentWrapper.innerHTML;

  block.classList.add('article-body');
}
