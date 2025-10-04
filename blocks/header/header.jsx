import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';

function Header({ logoHtml, titleHtml, hamburgerHtml }) {
  const [isOpen, setIsOpen] = useState(false);
  const [navMenu, setNavMenu] = useState(null);
  const headerRef = useRef(null);

  // Toggle menu function
  const toggleMenu = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  // Setup navigation menu
  useEffect(() => {
    const setupNavigation = () => {
      const navigationMenu = document.querySelector('.nav-menu');
      if (navigationMenu) {
        setNavMenu(navigationMenu);

        // Add click handlers to navigation links to close menu
        const navLinks = navigationMenu.querySelectorAll('a');
        navLinks.forEach((link) => {
          link.addEventListener('click', () => {
            setIsOpen(false);
            document.body.classList.remove('no-scroll');
          });
        });
      } else {
        // Retry if navigation isn't loaded yet
        setTimeout(setupNavigation, 100);
      }
    };

    setTimeout(setupNavigation, 100);

    // Cleanup
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // Move nav menu to nav-sections when available
  useEffect(() => {
    const navSectionsEl = document.querySelector('.nav-sections');
    if (navMenu && navSectionsEl && !navSectionsEl.contains(navMenu)) {
      navSectionsEl.appendChild(navMenu);
    }
  }, [navMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Update nav-menu active class
  useEffect(() => {
    const navigationMenu = document.querySelector('.nav-menu');
    if (navigationMenu) {
      if (isOpen) {
        navigationMenu.classList.add('active');
      } else {
        navigationMenu.classList.remove('active');
      }
    }
  }, [isOpen]);

  return (
    <div ref={headerRef} aria-expanded={isOpen}>
      <div className="header-content">
        <div className="nav-brand">
          <div dangerouslySetInnerHTML={{ __html: logoHtml }} />
          <div dangerouslySetInnerHTML={{ __html: titleHtml }} />
        </div>

        <div className="nav-hamburger">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={isOpen}
            onClick={toggleMenu}
            dangerouslySetInnerHTML={{ __html: hamburgerHtml }}
          />
        </div>
      </div>

      <div className={`nav-sections ${isOpen ? 'is-open' : ''}`} />
    </div>
  );
}

export default function decorate(block) {
  const contentRow = block.querySelector(':scope > div');
  if (!contentRow || contentRow.children.length < 3) return;

  const [titleWrapper, logoWrapper, hamburgerWrapper] = contentRow.children;

  // Fix image dimensions to prevent layout shift
  const fixImageDimensions = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img) => {
      // Remove lazy loading from header images for faster LCP
      img.removeAttribute('loading');
      // Add explicit dimensions if not present to prevent layout shift
      if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
        // Set reasonable defaults for header logo
        img.setAttribute('width', '120');
        img.setAttribute('height', '120');
      }
      // Remove inline styles that can cause layout shift
      img.style.removeProperty('width');
      img.style.removeProperty('height');
      img.style.removeProperty('max-width');
    });
    return tempDiv.innerHTML;
  };

  // Extract HTML content with fixed images
  const logoHtml = fixImageDimensions(logoWrapper.innerHTML);
  const titleHtml = titleWrapper.innerHTML;
  const hamburgerHtml = hamburgerWrapper.innerHTML;

  // Clear the block
  block.innerHTML = '';

  // Set aria-expanded on block
  block.setAttribute('aria-expanded', 'false');

  // Render React component
  const root = createRoot(block);
  root.render(
    <Header
      logoHtml={logoHtml}
      titleHtml={titleHtml}
      hamburgerHtml={hamburgerHtml}
    />,
  );
}
