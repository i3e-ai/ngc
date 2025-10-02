import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef, useCallback } from 'react';

// === React Component for a Single Feature Item ===
function Item({ item, index, originalLength }) {
  const itemRef = useRef(null);

  const handleClick = () => {
    if (item.link) {
      window.location.href = item.link;
    } else {
      const event = new CustomEvent('featureitem-click', {
        detail: {
          index: index % originalLength,
          title: item.title,
          item: itemRef.current,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Perform image optimizations directly
  useEffect(() => {
    const img = itemRef.current?.querySelector('img');
    if (img) {
      const itemIndex = index % originalLength;
      if (itemIndex < 3) {
        img.loading = 'eager';
        if (itemIndex === 0) img.setAttribute('fetchpriority', 'high');
      } else {
        img.loading = 'lazy';
      }
    }
  }, [index, originalLength]);

  return (
    <div
      ref={itemRef}
      className="featureitem-item"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="article"
      tabIndex="0"
      aria-label={`Feature item ${(index % originalLength) + 1}: ${item.title}`}
    >
      <span className="featureitem-category">Featured</span>
      <div
        className="featureitem-image"
        dangerouslySetInnerHTML={{ __html: item.imageHTML }}
      />
      <div className="featureitem-content">
        <h3 className="featureitem-title">{item.title}</h3>
        <p className="featureitem-subtitle">{item.subtitle}</p>
      </div>
    </div>
  );
}

// === Main FeatureItem Carousel Component ===
function FeatureItem({ items }) {
  const [clonedItems, setClonedItems] = useState([]);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const translateXRef = useRef(0);
  const itemWidthRef = useRef(0);

  // Function to update item classes based on center position
  const updateFocusStates = useCallback(() => {
    if (!trackRef.current || !itemWidthRef.current) return;
    const centerPosition =
      Math.abs(translateXRef.current) + window.innerWidth / 2;
    const centerItemIndex =
      Math.floor(centerPosition / itemWidthRef.current) % items.length;

    trackRef.current.childNodes.forEach((item, index) => {
      item.classList.remove('featureitem-center', 'featureitem-side');
      const itemIndex = index % items.length;
      if (itemIndex === centerItemIndex) {
        item.classList.add('featureitem-center');
      } else if (
        itemIndex === (centerItemIndex - 1 + items.length) % items.length ||
        itemIndex === (centerItemIndex + 1) % items.length
      ) {
        item.classList.add('featureitem-side');
      }
    });
  }, [items.length]);

  // The animation loop
  const slide = useCallback(() => {
    translateXRef.current -= 1; // Move left
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${translateXRef.current}px)`;
    }
    const resetPoint = -(items.length * itemWidthRef.current);
    if (translateXRef.current <= resetPoint) {
      translateXRef.current = 0;
    }
    updateFocusStates();
    animationFrameRef.current = requestAnimationFrame(slide);
  }, [items, updateFocusStates]);

  const startAutoplay = useCallback(() => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(slide);
  }, [slide]);

  const stopAutoplay = useCallback(() => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // Setup effect
  useEffect(() => {
    if (!items.length) return;

    // Clone items for infinite loop effect
    const clones = 4;
    const allItems = Array(clones)
      .fill(items)
      .flat();
    setClonedItems(allItems);

    // Calculate item width after rendering
    const timeoutId = setTimeout(() => {
      if (trackRef.current?.firstChild) {
        const computedStyle = window.getComputedStyle(trackRef.current);
        const gap = parseInt(computedStyle.gap, 10) || 32;
        itemWidthRef.current = trackRef.current.firstChild.offsetWidth + gap;
        startAutoplay();
      }
    }, 100);

    // Event listeners for pausing
    const container = containerRef.current;
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('touchstart', stopAutoplay, { passive: true });
    container.addEventListener('touchend', startAutoplay, { passive: true });

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      stopAutoplay();
      container.removeEventListener('mouseenter', stopAutoplay);
      container.removeEventListener('mouseleave', startAutoplay);
      container.removeEventListener('touchstart', stopAutoplay);
      container.removeEventListener('touchend', startAutoplay);
    };
  }, [items, startAutoplay, stopAutoplay]);

  return (
    <div ref={containerRef} className="featureitem-container">
      <div ref={trackRef} className="featureitem-track">
        {clonedItems.map((item, index) => (
          <Item
            key={index}
            item={item}
            index={index}
            originalLength={items.length}
          />
        ))}
      </div>
    </div>
  );
}

// === Decorate function (The Bridge) ===
export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';

  const featureItemsData = [...block.children]
    .map((row) => {
      const [imageCol, contentCol] = row.children;
      if (!imageCol || !contentCol) return null;

      return {
        imageHTML: imageCol.innerHTML,
        title:
          contentCol.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '',
        subtitle: contentCol.querySelector('p')?.textContent || '',
        link: contentCol.querySelector('a')?.href,
      };
    })
    .filter(Boolean);

  block.innerHTML = '';
  const root = createRoot(block);
  root.render(<FeatureItem items={featureItemsData} />);
}
