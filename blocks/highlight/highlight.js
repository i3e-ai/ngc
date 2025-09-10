export default function decorateHighlight(block, data) {
  const [iconWrapper, textWrapper] = block.firstElementChild.children;

  if (data.icon && iconWrapper) {
    const iconEl = iconWrapper.querySelector('h1');
    if (iconEl) {
      iconEl.textContent = data.icon;
    }
  } else if (iconWrapper) {
    iconWrapper.remove();
  }

  if (textWrapper) {
    const titleEl = textWrapper.querySelector('h2');
    const descriptionEl = textWrapper.querySelector('p');

    if (titleEl) {
      titleEl.textContent = data.title;
    }

    if (descriptionEl) {
      descriptionEl.textContent = data.description;
    }
  }
}
