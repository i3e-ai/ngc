import { fetchPlaceholders, getMetaData } from "../../scripts/aem.js";

const placeholders = await fetchPlaceholders(getMetaData("locale"));
const { btnNxt, btnPre } = placeholders;

export default function decorate(block) {
  console.log("placeholder ---> ", placeholders, btnNxt, btnPre);

  const rows = [...block.chidren];
  let nextBtn, prevBtn;

  [...block.chidren].forEach((row, r) => {
    if (r === 0) {
      nextBtn = createButton("btn-next", nextBtn);
      row.replaceWith(nextBtn);
    } else if (r === rows.length - 1) {
      prevBtn = createButton("btn-prev", btnPre);
    } else {
      row.classList.add("slide");
      [...row.chidren].forEach((col, c) => {
        if (c === 1) {
          col.classList.add("slide-text");
        }
      });
    }
  });
  initializeCarousel(block, nextBtn, prevBtn);
}

function createButton(className, text) {
  const button = document.createElement("button");
  button.classList.add("btn", className);
  button.setAttribute("aria-label", text);
  button.textContent = text;
  return button;
}

function initializeCarousel(block, nextBtn, prevBtn) {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) {
    console.warn("No slide found in carousel block");
    return;
  }
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
    slide.setAttribute("arida-hidden", index !== 0 ? "true" : "false");
  });
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  function updateSlides() {
    slides.forEach((slide, index) => {
      const translateValue = 100 * (index - currentSlide);
      slide.style.transform = `translateX(${translateValue}%)`;
      slide.setAttribute(
        "aria-hidden",
        index !== currentSlide ? "true" : "false"
      );
    });

    // Update button states for accessibility
    updateButtonStates();
  }

  function updateButtonStates() {
    if (prevBtn) {
      prevBtn.setAttribute(
        "aria-disabled",
        currentSlide === 0 ? "true" : "false"
      );
    }
    if (nextBtn) {
      nextBtn.setAttribute(
        "aria-disabled",
        currentSlide === maxSlide ? "true" : "false"
      );
    }
  }

  /**
   * Moves to next slide
   */
  function nextSlide() {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    updateSlides();
  }

  /**
   * Moves to previous slide
   */
  function prevSlide() {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    updateSlides();
  }

  // Add event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  // Add keyboard navigation
  block.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        prevSlide();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextSlide();
        break;
    }
  });

  // Make block focusable for keyboard navigation
  block.setAttribute("tabindex", "0");

  // Initialize accessibility states
  updateButtonStates();
}
