// blocks/navigation/navigation.jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

function NavigationMenu({ navItems }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLinkClick = () => {
    // Close mobile menu
    const menu = document.querySelector('.nav-menu');
    if (menu) {
      menu.classList.remove('active');
    }
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.classList.remove('active');
    }
  };

  const handleMainLinkClick = (e, hasDropdown) => {
    // If this item has dropdown, prevent default on desktop hover
    if (hasDropdown && window.innerWidth > 768) {
      // Allow navigation to main URL on desktop
      // Dropdown will show on hover
    }

    handleLinkClick();
  };

  const parseDropdownItems = (dropdownText) => {
    if (!dropdownText) return [];

    return dropdownText
      .split(',')
      .map((item) => {
        const trimmedItem = item.trim();
        if (!trimmedItem) return null;

        if (trimmedItem.includes('|')) {
          const [text, url] = trimmedItem.split('|');
          return { text: text.trim(), url: url.trim() };
        }
        return { text: trimmedItem, url: '#' };
      })
      .filter(Boolean);
  };

  return (
    <ul className="nav-menu" id="navigation-menu">
      {navItems.map((item, index) => {
        const hasDropdown = item.dropdownText && item.dropdownText.trim();
        const hasDropdownImg = hasDropdown && item.dropdownImg;
        const dropdownItems = parseDropdownItems(item.dropdownText);

        return (
          <li
            key={index}
            className={`${hasDropdown ? 'has-dropdown' : ''} ${
              hasDropdownImg ? 'has-dropdownImg' : ''
            }`}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a
              href={item.url}
              onClick={(e) => handleMainLinkClick(e, hasDropdown)}
            >
              {item.text}
            </a>

            {hasDropdown && hasDropdownImg && (
              <div
                className="dropdown-content"
                style={{ display: hoveredItem === index ? 'flex' : 'none' }}
              >
                <div className="dropdown-container">
                  {/* Left - Navigation Links */}
                  <div className="dropdown-nav">
                    {dropdownItems.map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.url}
                        onClick={handleLinkClick}
                      >
                        {dropdownItem.text}
                      </a>
                    ))}
                  </div>

                  {/* Right - Featured Image */}
                  <div className="dropdown-image">
                    <img
                      src={item.dropdownImgSrc}
                      alt={item.text}
                      className="dropdown-featured-img"
                    />
                    <div className="image-overlay">
                      <h3 className="overlay-title">{item.text}</h3>
                      <p className="overlay-subtitle">Explore our collection</p>
                      <a href={item.url} className="overlay-button">
                        EXPLORE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasDropdown && !hasDropdownImg && (
              <div
                className="dropdown-content dropdown-simple"
                style={{ display: hoveredItem === index ? 'flex' : 'none' }}
              >
                {dropdownItems.map((dropdownItem, idx) => (
                  <a
                    key={idx}
                    href={dropdownItem.url}
                    onClick={handleLinkClick}
                  >
                    {dropdownItem.text}
                  </a>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function decorate(block) {
  const navItems = [...block.children].map((item) => {
    // Get the columns
    const textCol = item.querySelector('div:nth-child(1)');
    const urlCol = item.querySelector('div:nth-child(2)');
    const dropdownCol = item.querySelector('div:nth-child(3)');
    const dropdownImgCol = item.querySelector('div:nth-child(4)');

    const text = textCol?.textContent.trim() || '';
    const url = urlCol?.textContent.trim() || '#';
    const dropdownText = dropdownCol?.textContent.trim() || '';

    let dropdownImgSrc = null;
    const imgElement = dropdownImgCol?.querySelector('img');
    if (imgElement) {
      dropdownImgSrc = imgElement.src;
    }

    return {
      text,
      url,
      dropdownText,
      dropdownImg: !!dropdownImgSrc,
      dropdownImgSrc,
    };
  });

  // Create a container for the menu
  const menuContainer = document.createElement('div');
  menuContainer.id = 'navigation-menu-container';

  // Replace the block with the container
  block.replaceWith(menuContainer);

  // Render React component
  const root = createRoot(menuContainer);
  root.render(<NavigationMenu navItems={navItems} />);
}
