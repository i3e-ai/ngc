export default function decorate(block) {
  const [authorCell, quoteCell] = block.querySelector(":scope > div").children;
  const authorEl = authorCell.querySelector("h2");
  const quoteEl = quoteCell.querySelector("h3");
  const blockquote = document.createElement("blockquote");
  const quoteP = document.createElement("p");
  const cite = document.createElement("cite");

  quoteP.textContent = quoteEl.textContent;
  cite.textContent = authorEl.textContent;

  blockquote.append(quoteP);
  block.innerHTML = "";
  block.append(blockquote, cite);
}
