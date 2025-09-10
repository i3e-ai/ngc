export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  block.append(footer);
}
