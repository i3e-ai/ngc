import { createRoot } from 'react-dom/client';

function ProductDisplay({ products }) {
  const generateProductId = (title) =>
    title
      ? title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
      : 'unknown-product';

  const onAddToCartClick = (productId) => {
    if (typeof window.handleAddToCart === 'function') {
      window.handleAddToCart(productId);
    } else {
      console.warn(
        'handleAddToCart function is not defined on the window object.',
      );
    }
  };

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

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
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

  block.innerHTML = '';
  const root = createRoot(block);
  root.render(<ProductDisplay products={productsData} />);
}
