function toggleMenu(header, navSections) {
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', !isExpanded);
  navSections.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');

  // Also toggle the navigation menu if it exists
  const navigationMenu = document.querySelector('.nav-menu');
  if (navigationMenu) {
    navigationMenu.classList.toggle('active');
  }
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
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.innerHTML = hamburgerWrapper.innerHTML;
  hamburgerWrapper.innerHTML = '';
  hamburgerWrapper.append(hamburgerButton);

  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');

  contentRow.innerHTML = '';
  contentRow.append(brand, hamburgerWrapper);

  block.append(navSections);
  block.setAttribute('aria-expanded', 'false');

  // Main hamburger click handler
  hamburgerButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu(block, navSections);

    // Update button aria-expanded attribute
    const isExpanded = block.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', isExpanded);
  });

  // Wait for navigation menu to be available and move it to nav-sections
  const setupNavigation = () => {
    const navigationMenu = document.querySelector('.nav-menu');
    if (navigationMenu && !navSections.contains(navigationMenu)) {
      // Move the navigation menu into nav-sections
      navSections.appendChild(navigationMenu);

      // Add click handlers to navigation links to close menu
      const navLinks = navigationMenu.querySelectorAll('a');
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          // Close the menu when a link is clicked
          block.setAttribute('aria-expanded', 'false');
          hamburgerButton.setAttribute('aria-expanded', 'false');
          navSections.classList.remove('is-open');
          navigationMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
        });
      });
    } else if (!navigationMenu) {
      // Retry if navigation isn't loaded yet
      setTimeout(setupNavigation, 100);
    }
  };

  // Start checking for navigation
  setTimeout(setupNavigation, 100);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.setAttribute('aria-expanded', 'false');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      navSections.classList.remove('is-open');
      document.body.classList.remove('no-scroll');

      const navigationMenu = document.querySelector('.nav-menu');
      if (navigationMenu) {
        navigationMenu.classList.remove('active');
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      block.setAttribute('aria-expanded', 'false');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      navSections.classList.remove('is-open');
      document.body.classList.remove('no-scroll');

      const navigationMenu = document.querySelector('.nav-menu');
      if (navigationMenu) {
        navigationMenu.classList.remove('active');
      }
    }
  });
}
