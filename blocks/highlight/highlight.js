/**
 * Updates the highlight block with new data.
 * @param {HTMLElement} block The main element of the highlight block (.highlight).
 * @param {object} data The data to populate the block with.
 * @param {string} [data.icon] The optional icon/emoji to display.
 * @param {string} data.title The title text.
 * @param {string} data.description The description text.
 */
function decorateHighlight(block, data) {
  // The HTML structure has two main divs for content.
  // The first div holds the icon (<h1>).
  // The second div holds the text (<h2> and <p>).
  const [iconWrapper, textWrapper] = block.firstElementChild.children;

  // --- Handle the Icon ---
  if (data.icon && iconWrapper) {
    const iconEl = iconWrapper.querySelector("h1");
    if (iconEl) {
      iconEl.textContent = data.icon;
    }
  } else if (iconWrapper) {
    // If no icon data is provided, remove the entire icon wrapper div.
    iconWrapper.remove();
  }

  // --- Handle the Title and Description ---
  if (textWrapper) {
    const titleEl = textWrapper.querySelector("h2");
    const descriptionEl = textWrapper.querySelector("p");

    if (titleEl) {
      titleEl.textContent = data.title;
    }

    if (descriptionEl) {
      descriptionEl.textContent = data.description;
    }
  }
}
