export default function decorate(block) {
  // Prevent the script from running again on the same block
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';

  // Process each child div as a separate product card
  const cards = [...block.querySelectorAll(':scope > div')];
  cards.forEach((row) => {
    const [imageCell, detailsCell] = row.children;

    // Skip if the row doesn't have the expected two-column structure
    if (!imageCell || !detailsCell) {
      return;
    }

    imageCell.classList.add('prodect-image-wrapper'); // Note: "prodect" might be a typo for "product"
    detailsCell.classList.add('product-details');

    const titleEl = detailsCell.querySelector('h2');
    const priceEl = detailsCell.querySelector('h3');

    if (titleEl) {
      titleEl.classList.add('product-title');
    }
    if (priceEl) {
      priceEl.classList.add('product-price');
    }

    // Create the 'Add to Cart' button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Cart'; // Corrected text from 'Add to Content'
    addButton.classList.add('add-to-cart-button');

    // Generate a product ID from the title, with a fallback
    const productId = titleEl ? titleEl.textContent.trim().toLowerCase().replace(/\s+/g, '-') : 'unknown-product';

    addButton.addEventListener('click', () => {
      // eslint-disable-next-line no-undef
      handleAddToCart(productId);
    });

    detailsCell.append(addButton);
  });
}