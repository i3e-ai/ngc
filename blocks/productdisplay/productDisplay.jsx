import { createRoot } from 'react-dom/client';

// The React component for rendering the product cards
function ProductDisplay({ products }) {
  // A helper function to generate a product ID from its title
  const generateProductId = (title) =>
    title
      ? title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
      : 'unknown-product';

  // Click handler that calls the globally available 'handleAddToCart' function
  const onAddToCartClick = (productId) => {
    if (typeof window.handleAddToCart === 'function') {
      window.handleAddToCart(productId);
    } else {
      console.warn(
        'handleAddToCart function is not defined on the window object.',
      );
    }
  };

  // Use a React Fragment to avoid an extra wrapper div.
  // The grid layout is now on the parent 'block' element.
  return (
    <>
      {products.map((product, index) => {
        const productId = generateProductId(product.title);

        return (
          <div key={index}>
            <div
              className="prodect-image-wrapper"
              dangerouslySetInnerHTML={{ __html: product.imageHTML }}
            />
            <div className="product-details">
              <h2 className="product-title">{product.title}</h2>
              <h3 className="product-price">{product.price}</h3>
              <button
                className="add-to-cart-button"
                onClick={() => onAddToCartClick(productId)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

// The decorate function acts as the bridge from AEM to React
export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';

  // *** KEY CHANGE HERE ***
  // Add the grid classes directly to the block element itself.
  block.classList.add('productdisplay');

  const productsData = [...block.querySelectorAll(':scope > div')]
    .map((row) => {
      const [imageCell, detailsCell] = row.children;
      if (!imageCell || !detailsCell) return null;

      return {
        imageHTML: imageCell.innerHTML,
        title: detailsCell.querySelector('h2')?.textContent || '',
        price: detailsCell.querySelector('h3')?.textContent || '',
      };
    })
    .filter(Boolean);

  const root = createRoot(block);
  block.innerHTML = ''; // Clear the original block content
  root.render(<ProductDisplay products={productsData} />);
}
