export default function decorate(block) {
  block.classList.add('press-release');

  [...block.children].slice(1).forEach((row) => {
    row.classList.add('press-release-item');

    const [titleCell, infoCell, linkCell] = [...row.children];

    titleCell.classList.add('press-release-title');
    infoCell.classList.add('press-release-info');

    const link = linkCell.querySelector('a');
    if (link) {
      link.classList.add('press-release-button');
      link.textContent = 'Download';
    }
  });
}
