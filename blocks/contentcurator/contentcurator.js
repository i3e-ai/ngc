function initializeFeatureItem(block) {
  const track = block.querySelector('.featureitem-track');
  const originalItems = [...track.querySelectorAll('.featureitem-item')];
  
  if (!originalItems.length) return;

  let translateX = 0;
  let autoplay;
  let itemWidth;
  
  // Wait for layout completion
  setTimeout(() => {
    // Calculate item width including gap
    const computedStyle = window.getComputedStyle(track);
    const gap = parseInt(computedStyle.gap, 10) || 32;
    itemWidth = originalItems[0].offsetWidth + gap;
    
    // Clone items multiple times for smooth infinite effect
    const cloneCount = 4; // Create enough clones for seamless loop
    for (let i = 0; i < cloneCount;i+=1) {
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }
    
    const allItems = [...track.querySelectorAll('.featureitem-item')];
    
    function updateFocusStates() {
      // Calculate which item should be in center based on current position
      const centerPosition = Math.abs(translateX) + (window.innerWidth / 2);
      const centerItemIndex = Math.floor(centerPosition / itemWidth) % originalItems.length;
      
      allItems.forEach((item, index) => {
        item.classList.remove('featureitem-center', 'featureitem-side');
        
        const itemIndex = index % originalItems.length;
        if (itemIndex === centerItemIndex) {
          item.classList.add('featureitem-center');
        } else if (
          itemIndex === (centerItemIndex - 1 + originalItems.length) % originalItems.length ||
          itemIndex === (centerItemIndex + 1) % originalItems.length
        ) {
          item.classList.add('featureitem-side');
        }
      });
    }
    
    function slide() {
      // Move left (negative direction) for right-to-left flow
      translateX -= 1; // Simple pixel-by-pixel movement
      
      // Apply transform
      track.style.transform = `translateX(${translateX}px)`;
      
      // Reset when we've moved one full set of original items
      const resetPoint = -(originalItems.length * itemWidth);
      if (translateX <= resetPoint) {
        translateX = 0;
      }
      
      updateFocusStates();
    }
    
    function startAutoplay() {
      autoplay = setInterval(slide, 30); // Smooth 33fps
    }
    
    function stopAutoplay() {
      clearInterval(autoplay);
    }
    
    // Hover controls
    block.addEventListener('mouseenter', stopAutoplay);
    block.addEventListener('mouseleave', startAutoplay);
    
    // Touch controls for mobile
    block.addEventListener('touchstart', stopAutoplay);
    block.addEventListener('touchend', startAutoplay);
    
    // Initialize
    track.style.transform = `translateX(0px)`;
    updateFocusStates();
    startAutoplay();
    
  }, 100);
}

export default function decorate(block) {
  // EDS block structure: each row becomes a feature item
  const rows = [...block.children];
  
  // Clear existing content
  block.innerHTML = '';
  
  // Create feature item structure without navigation buttons
  const featureitemContainer = document.createElement('div');
  featureitemContainer.className = 'featureitem-container';
  
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
    
    // Assemble feature item
    featureitemItem.appendChild(categoryTag);
    featureitemItem.appendChild(featureitemImage);
    featureitemItem.appendChild(featureitemContent);
    
    // Add click handler
    featureitemItem.addEventListener('click', () => {
      // Check for link in original content
      const link = contentDiv.querySelector('a');
      if (link && link.href) {
        window.location.href = link.href;
      } else {
        // Dispatch custom event for tracking
        const event = new CustomEvent('featureitem-click', {
          detail: { index, title: title?.textContent, item: featureitemItem }
        });
        block.dispatchEvent(event);
      }
    });
    
    // Add accessibility attributes
    featureitemItem.setAttribute('role', 'article');
    featureitemItem.setAttribute('tabindex', '0');
    featureitemItem.setAttribute('aria-label', `Feature item ${index + 1}: ${title?.textContent || 'Featured content'}`);
    
    // Keyboard navigation
    featureitemItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        featureitemItem.click();
      }
    });
    
    featureitemTrack.appendChild(featureitemItem);
  });
  
  // Assemble feature item container (no buttons)
  featureitemContainer.appendChild(featureitemTrack);
  
  block.appendChild(featureitemContainer);
  block.classList.add('featureitem-decorated');
  
  // Initialize feature item functionality
  requestAnimationFrame(() => {
    initializeFeatureItem(block);
  });
}