/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
function initializeFeatureItem(block) {
  const track = block.querySelector('.featureitem-track');
  const originalItems = [...track.querySelectorAll('.featureitem-item')];

  if (!originalItems.length) return;

  let currentIndex = originalItems.length; // Start at first real item (after clones)
  let autoplay;
  let isTransitioning = false;

  // Wait for layout to be complete
  setTimeout(() => {
    // Clone items for infinite loop effect
    // Add clones of all items at the end
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    // Add clones of all items at the beginning
    originalItems
      .slice()
      .reverse()
      .forEach((item) => {
        const clone = item.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
      });

    const allItems = [...track.querySelectorAll('.featureitem-item')];
    const totalItems = allItems.length;
    const originalLength = originalItems.length;

    const firstItem = allItems[0];
    const computedStyle = window.getComputedStyle(track);
    const gap = parseInt(computedStyle.gap) || 32;
    const itemWidth = firstItem.offsetWidth + gap;

    // Position at first real item (skip the prepended clones)
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    function updateItemStates() {
      allItems.forEach((item, i) => {
        item.classList.remove('featureitem-center', 'featureitem-side');
      });

      // Center item
      if (allItems[currentIndex]) {
        allItems[currentIndex].classList.add('featureitem-center');
      }

      // Side items
      if (allItems[currentIndex - 1]) {
        allItems[currentIndex - 1].classList.add('featureitem-side');
      }
      if (allItems[currentIndex + 1]) {
        allItems[currentIndex + 1].classList.add('featureitem-side');
      }
    }

    function slide(animate = true) {
      if (animate && isTransitioning) return;

      if (animate) {
        isTransitioning = true;
        track.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
      } else {
        track.style.transition = 'none';
      }

      const translateX = -currentIndex * itemWidth;
      track.style.transform = `translateX(${translateX}px)`;

      updateItemStates();

      if (animate) {
        setTimeout(() => {
          // Handle infinite loop jumps
          track.style.transition = 'none';

          // If we're at or past the end clones, jump to the beginning of real items
          if (currentIndex >= originalLength * 2) {
            currentIndex = originalLength;
            track.style.transform = `translateX(-${currentIndex *
              itemWidth}px)`;
          }
          // If we're at or before the beginning clones, jump to the end of real items
          else if (currentIndex < originalLength) {
            currentIndex = originalLength * 2 - 1;
            track.style.transform = `translateX(-${currentIndex *
              itemWidth}px)`;
          }

          updateItemStates();
          isTransitioning = false;
        }, 600);
      } else {
        updateItemStates();
      }
    }

    function next() {
      if (isTransitioning) return;
      currentIndex++;
      slide();
    }

    function prev() {
      if (isTransitioning) return;
      currentIndex--;
      slide();
    }

    const startAuto = () => (autoplay = setInterval(next, 3000));
    const stopAuto = () => clearInterval(autoplay);

    // Event listeners
    const nextBtn = block.querySelector('.featureitem-next');
    const prevBtn = block.querySelector('.featureitem-prev');

    if (nextBtn)
      nextBtn.onclick = () => {
        stopAuto();
        next();
        startAuto();
      };
    if (prevBtn)
      prevBtn.onclick = () => {
        stopAuto();
        prev();
        startAuto();
      };

    block.onmouseenter = stopAuto;
    block.onmouseleave = startAuto;

    // Touch support
    let startX = 0;
    block.ontouchstart = (e) => {
      startX = e.touches[0].clientX;
      stopAuto();
    };
    block.ontouchend = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
      startAuto();
    };

    // Initialize
    slide(false);
    startAuto();
  }, 100);
}

export default function decorate(block) {
  // EDS block structure: each row becomes a featureitem item
  const rows = [...block.children];

  // Clear existing content
  block.innerHTML = '';

  // Create featureitem structure
  const featureitemContainer = document.createElement('div');
  featureitemContainer.className = 'featureitem-container';

  // Navigation buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'featureitem-nav featureitem-prev';
  prevButton.innerHTML = '<span>‹</span>';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.type = 'button';

  const nextButton = document.createElement('button');
  nextButton.className = 'featureitem-nav featureitem-next';
  nextButton.innerHTML = '<span>›</span>';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.type = 'button';

  // Feature item track
  const featureitemTrack = document.createElement('div');
  featureitemTrack.className = 'featureitem-track';

  // Process each row from the document
  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (cols.length < 2) return; // Skip malformed rows

    const featureitemItem = document.createElement('div');
    featureitemItem.className = 'featureitem-item';

    // Image column (first column)
    const imageDiv = cols[0];
    const featureitemImage = document.createElement('div');
    featureitemImage.className = 'featureitem-image';

    // Handle different image formats (picture, img)
    const picture = imageDiv.querySelector('picture');
    const img = imageDiv.querySelector('img');

    if (picture) {
      featureitemImage.appendChild(picture);
    } else if (img) {
      featureitemImage.appendChild(img);
    }

    // Content column (second column)
    const contentDiv = cols[1];
    const featureitemContent = document.createElement('div');
    featureitemContent.className = 'featureitem-content';

    // Extract title and subtitle from content
    const title = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    const paragraphs = [...contentDiv.querySelectorAll('p')];

    if (title) {
      const featureitemTitle = document.createElement('h3');
      featureitemTitle.className = 'featureitem-title';
      featureitemTitle.textContent = title.textContent;
      featureitemContent.appendChild(featureitemTitle);
    }

    // Use first paragraph as subtitle if exists
    if (paragraphs.length > 0) {
      const featureitemSubtitle = document.createElement('p');
      featureitemSubtitle.className = 'featureitem-subtitle';
      featureitemSubtitle.textContent = paragraphs[0].textContent;
      featureitemContent.appendChild(featureitemSubtitle);
    }

    // Category tag
    const categoryTag = document.createElement('span');
    categoryTag.className = 'featureitem-category';
    categoryTag.textContent = 'Featured';

    // Assemble featureitem item
    featureitemItem.appendChild(categoryTag);
    featureitemItem.appendChild(featureitemImage);
    featureitemItem.appendChild(featureitemContent);

    // Add click handler with proper data attributes
    featureitemItem.addEventListener('click', () => {
      // Check for link in original content
      const link = contentDiv.querySelector('a');
      if (link && link.href) {
        window.location.href = link.href;
      } else {
        // Dispatch custom event for tracking
        const event = new CustomEvent('featureitem-click', {
          detail: { index, title: title?.textContent, item: featureitemItem },
        });
        block.dispatchEvent(event);
      }
    });

    // Add accessibility attributes
    featureitemItem.setAttribute('role', 'article');
    featureitemItem.setAttribute('tabindex', '0');
    featureitemItem.setAttribute(
      'aria-label',
      `Feature item ${index + 1}: ${title?.textContent || 'Featured content'}`,
    );

    // Keyboard navigation
    featureitemItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        featureitemItem.click();
      }
    });

    featureitemTrack.appendChild(featureitemItem);
  });

  // Assemble featureitem
  featureitemContainer.appendChild(prevButton);
  featureitemContainer.appendChild(featureitemTrack);
  featureitemContainer.appendChild(nextButton);

  block.appendChild(featureitemContainer);
  block.classList.add('featureitem-decorated');

  // Initialize featureitem functionality
  requestAnimationFrame(() => {
    initializeFeatureItem(block);
  });
}
