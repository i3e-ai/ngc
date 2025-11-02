export default function decorate(block) {
  const navItems = [...block.children];

  // Create only the menu container, not the hamburger button
  const menu = document.createElement('ul');
  menu.className = 'nav-menu';
  menu.id = 'navigation-menu'; // ID for header to target

  navItems.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');

    // Get the columns
    const textCol = item.querySelector('div:nth-child(1)');
    const urlCol = item.querySelector('div:nth-child(2)');
    const dropdownCol = item.querySelector('div:nth-child(3)');
    const dropdownImg = item.querySelector('div:nth-child(4)');

    link.href = urlCol.textContent.trim(); // URL column
    link.textContent = textCol.textContent.trim(); // Text column

    // Check if there's dropdown content in the third column and image column in 4th column
    if (dropdownCol && dropdownCol.textContent.trim() && dropdownImg) {
      li.classList.add('has-dropdown');
      li.classList.add('has-dropdownImg');

      // Create dropdown menu (hidden by default)
      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown-content';
      dropdown.style.display = 'none'; // Hide by default

      // Create container for dropdown content with flex layout
      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'dropdown-container';

      // Create left side for navigation links
      const dropdownNav = document.createElement('div');
      dropdownNav.className = 'dropdown-nav';

      // Parse dropdown items (format: "Text|URL,Text2|URL2" or just "Text,Text2")
      const dropdownItems = dropdownCol.textContent.split(',');

      dropdownItems.forEach((dropdownItem) => {
        const trimmedItem = dropdownItem.trim();
        if (trimmedItem) {
          const dropdownLink = document.createElement('a');

          // Check if item has URL (format: "Text|URL")
          if (trimmedItem.includes('|')) {
            const [text, url] = trimmedItem.split('|');
            dropdownLink.textContent = text.trim();
            dropdownLink.href = url.trim();
          } else {
            // Just text, create a default URL or use #
            dropdownLink.textContent = trimmedItem;
            dropdownLink.href = '#';
          }

          // Add click handler for dropdown items
          dropdownLink.addEventListener('click', () => {
            menu.classList.remove('active');
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
              hamburger.classList.remove('active');
            }
          });

          dropdownNav.appendChild(dropdownLink);
        }
      });

      // Create right side for image
      const dropdownImage = document.createElement('div');
      dropdownImage.className = 'dropdown-image';

      // Get the image from the 4th column
      const imgElement = dropdownImg.querySelector('img');
      if (imgElement) {
        // Clone the image to avoid moving it from original location
        const clonedImg = imgElement.cloneNode(true);
        clonedImg.className = 'dropdown-featured-img';
        dropdownImage.appendChild(clonedImg);

        // Optional: Add overlay content on the image
        const imageOverlay = document.createElement('div');
        imageOverlay.className = 'image-overlay';

        const overlayTitle = document.createElement('h3');
        overlayTitle.textContent = textCol.textContent.trim(); // Use nav item name as title
        overlayTitle.className = 'overlay-title';

        const overlaySubtitle = document.createElement('p');
        overlaySubtitle.textContent = 'Explore our collection'; // Default subtitle
        overlaySubtitle.className = 'overlay-subtitle';

        const overlayButton = document.createElement('a');
        overlayButton.textContent = 'EXPLORE';
        overlayButton.href = urlCol.textContent.trim();
        overlayButton.className = 'overlay-button';

        imageOverlay.appendChild(overlayTitle);
        imageOverlay.appendChild(overlaySubtitle);
        imageOverlay.appendChild(overlayButton);
        dropdownImage.appendChild(imageOverlay);
      }

      // Assemble the dropdown structure
      dropdownContainer.appendChild(dropdownNav);
      dropdownContainer.appendChild(dropdownImage);
      dropdown.appendChild(dropdownContainer);

      // Add hover events to show/hide dropdown
      li.addEventListener('mouseenter', () => {
        dropdown.style.display = 'flex'; // Changed to flex for proper layout
      });

      li.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none';
      });

      li.appendChild(dropdown);
    } else if (dropdownCol && dropdownCol.textContent.trim()) {
      // Handle dropdown without image (fallback to original behavior)
      li.classList.add('has-dropdown');

      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown-content dropdown-simple';
      dropdown.style.display = 'none';

      const dropdownItems = dropdownCol.textContent.split(',');

      dropdownItems.forEach((dropdownItem) => {
        const trimmedItem = dropdownItem.trim();
        if (trimmedItem) {
          const dropdownLink = document.createElement('a');

          if (trimmedItem.includes('|')) {
            const [text, url] = trimmedItem.split('|');
            dropdownLink.textContent = text.trim();
            dropdownLink.href = url.trim();
          } else {
            dropdownLink.textContent = trimmedItem;
            dropdownLink.href = '#';
          }

          dropdownLink.addEventListener('click', () => {
            menu.classList.remove('active');
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
              hamburger.classList.remove('active');
            }
          });

          dropdown.appendChild(dropdownLink);
        }
      });

      li.addEventListener('mouseenter', () => {
        dropdown.style.display = 'flex';
      });

      li.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none';
      });

      li.appendChild(dropdown);
    }

    // Main link click handler
    link.addEventListener('click', () => {
      // If this item has dropdown, prevent default on desktop hover
      if (li.classList.contains('has-dropdown') && window.innerWidth > 768) {
        // Allow navigation to main URL on desktop
        // Dropdown will show on hover
      }

      // Close mobile menu
      menu.classList.remove('active');
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.remove('active');
      }
    });

    li.appendChild(link);
    menu.appendChild(li);
  });

  block.replaceWith(menu);
}
