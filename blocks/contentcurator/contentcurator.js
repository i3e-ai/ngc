export default function decorate(block) {
  const rows = [...block.children];
  const curatorContainer = document.createElement("div");

  curatorContainer.classList.add("content-curator");
  const featuredSection = document.createElement("div");
  featuredSection.classList.add("featured-content");

  rows.forEach((row, index) => {
    const columns = [...row.children];
    if (columns.length >= 2) {
      const featuredItem = document.createElement("article");
      featuredItem.classList.add("featured-item");

      const imageColumn = columns[0];
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("featured-image");

      const picture = imageColumn.querySelector("picture");
      const img = imageColumn.querySelector("img");

      if (picture) {
        imageContainer.appendChild(picture.cloneNode(true));
      } else if (img) {
        imageContainer.appendChild(img.cloneNode(true));
      }

      const contentColumn = columns[1];
      const contentContainer = document.createElement("div");
      contentContainer.classList.add("featured-content-text");
      const h3 = contentColumn.querySelector("h3");
      const h4 = contentColumn.querySelector("h4");

      if (h3) {
        const title = document.createElement("h2");
        title.classList.add("featured-title");
        title.textContent = h3.textContent;
        contentContainer.appendChild(title);
      }
      if (h4) {
        const subtitle = document.createElement("p");
        subtitle.classList.add("featured-subtitle");
        subtitle.textContent = h4.textContent;
        contentContainer.appendChild(subtitle);
      }
      const categoryTag = document.createElement("span");
      categoryTag.classList.add("category-tag");
      categoryTag.textContent = "Featured";
      featuredItem.appendChild(categoryTag);
      featuredItem.appendChild(imageContainer);
      featuredItem.appendChild(contentContainer);
      featuredItem.addEventListener("click", () => {
        handleItemClick(featuredItem, index);
      });
      featuredItem.addEventListener("mouseenter", () => {
        featuredItem.classList.add("hovered");
      });
      featuredItem.addEventListener("mouseleave", () => {
        featuredItem.classList.remove("hovered");
      });
      featuredSection.appendChild(featuredItem);
    }
  });
  if (rows.length > 1) {
    //const navControls = createNavigationControls();
    //curatorContainer.appendChild(navControls);
  }
  curatorContainer.appendChild(featuredSection);
  block.innerHTML = "";
  block.appendChild(curatorContainer);
  initializeInteractivity(block);
}

function initializeInteractivity(block) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  const featuredItems = block.querySelectorAll(".featured-item");

  featuredItems.forEach(item => {
    observer.observe(item);
  });

  block.addEventListener("keydown", e => {
    const focusedItem = document.activeElement;
    if (focusedItem && focusedItem.classList.contains("featured-item")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        focusedItem.click();
      }
    }
  });

  featuredItems.forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Featured article ${index + 1}`);
  });
}
