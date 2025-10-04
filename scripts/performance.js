/**
 * Performance optimization utilities
 */

/**
 * Lazy load a component when it enters the viewport
 * @param {Element} element - The element to observe
 * @param {Function} loadComponent - Function that returns a promise to load the component
 * @param {Object} options - Intersection observer options
 */
export function lazyLoadComponent(element, loadComponent, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  };

  const observerOptions = { ...defaultOptions, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadComponent()
          .then(() => {
            observer.unobserve(element);
          })
          .catch((error) => {
            console.error('Failed to lazy load component:', error);
          });
      }
    });
  }, observerOptions);

  observer.observe(element);
  return observer;
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  // Preload critical CSS
  const criticalCSS = ['/styles/styles.css'];
  
  criticalCSS.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical JavaScript modules
  const criticalJS = ['/scripts/aem.js'];
  
  criticalJS.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Optimize images with Intersection Observer for lazy loading
 * @param {string} selector - CSS selector for images to optimize
 */
export function optimizeImages(selector = 'img[loading="lazy"]:not([src*="media_"])') {
  const images = document.querySelectorAll(selector);
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Only add fade effect if image doesn't already have a src (i.e., uses data-src)
        if (img.dataset.src && !img.src.includes('media_')) {
          // Add fade-in effect only for images that need lazy loading
          img.style.transition = 'opacity 0.3s';
          img.style.opacity = '0';
          
          img.onload = () => {
            img.style.opacity = '1';
          };
          
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
  });

  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Reduce unused CSS by removing unused stylesheets after page load
 */
export function removeUnusedCSS() {
  // This is a simplified version - in production, you'd use tools like PurgeCSS
  const unusedSelectors = [
    '.unused-class',
    '.debug-only',
    '.development-only'
  ];

  // Remove unused CSS rules (basic implementation)
  const styleSheets = Array.from(document.styleSheets);
  
  styleSheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules);
      rules.forEach((rule, index) => {
        if (rule.selectorText) {
          unusedSelectors.forEach((selector) => {
            if (rule.selectorText.includes(selector)) {
              sheet.deleteRule(index);
            }
          });
        }
      });
    } catch (e) {
      // Cross-origin stylesheets can't be accessed
      console.warn('Cannot access stylesheet:', sheet.href);
    }
  });
}

/**
 * Implement resource hints for better loading performance
 */
export function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://esm.sh', crossorigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  ];

  hints.forEach((hint) => {
    // Check if hint already exists
    const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });
}

/**
 * Monitor Core Web Vitals - Summary Version
 */
export function monitorWebVitals() {
  let lcpValue = 0;
  let fidValue = 0;
  let clsScore = 0;

  // Monitor LCP (Largest Contentful Paint) - only log final value
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    lcpValue = lastEntry.startTime;
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Monitor FID (First Input Delay)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      fidValue = entry.processingStart - entry.startTime;
    });
  }).observe({ entryTypes: ['first-input'] });

  // Monitor CLS (Cumulative Layout Shift) - only log significant changes
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    });
  }).observe({ entryTypes: ['layout-shift'] });

  // Log summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('📊 Core Web Vitals Summary:');
      console.log(`LCP: ${lcpValue.toFixed(0)}ms ${lcpValue < 2500 ? '✅' : '❌'}`);
      console.log(`FID: ${fidValue.toFixed(1)}ms ${fidValue < 100 ? '✅' : '❌'}`);
      console.log(`CLS: ${clsScore.toFixed(4)} ${clsScore < 0.1 ? '✅' : '❌'}`);
    }, 3000);
  });
}
