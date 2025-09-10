function toggleMenu(header, navSections) {
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', !isExpanded);
  navSections.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');
}

export default function decorate(block) {
  const contentRow = block.querySelector(':scope > div');
  if (!contentRow || contentRow.children.length < 3) return;

  const [titleWrapper, logoWrapper, hamburgerWrapper] = contentRow.children;

  const brand = document.createElement('div');
  brand.classList.add('nav-brand');
  brand.append(logoWrapper, titleWrapper);

  hamburgerWrapper.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('aria-label', 'Menu');
  hamburgerButton.innerHTML = hamburgerWrapper.innerHTML;
  hamburgerWrapper.innerHTML = '';
  hamburgerWrapper.append(hamburgerButton);

  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');

  contentRow.innerHTML = '';
  contentRow.append(brand, hamburgerWrapper);

  block.append(navSections);
  block.setAttribute('aria-expanded', 'false');

  hamburgerWrapper.addEventListener('click', () => toggleMenu(block, navSections));
}
