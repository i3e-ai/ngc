function handleAddToCart(productId){
  console.log(`Product with ID: ${productId} added to Cart!`);
  alert(`Added ${productId} to your cart.`);
}

export default function decorate (block){
  const [imageCell, detailsCell] = block.querySelector(':scope > div').children;
  imageCell.classList.add('prodect-image-wrapper');
  detailsCell.classList.add('product-details');

  const titleEl = detailsCell.querySelector('h2');
  const priceEl = detailsCell.querySelector('h3');

  if(titleEl){
    titleEl.classList.add('product-title');
  }
  if(priceEl){
    priceEl.classList.add('product-price');
    const priceValue = parseFloat(priceEl.textContent);

  }
  const addButton = document.createElement('button');
  addButton.textContent = 'Add to Content';
  addButton.classList.add('add-to-cart-button');

  const productId = titleEl ? titleEl.textContent.trim().toLowerCase().replace(/\s+/g, '-') : 'unknown-product';

  addButton.addEventListener('click', ()=>{
    handleAddToCart(productId);
  });

  detailsCell.append(addButton);
}