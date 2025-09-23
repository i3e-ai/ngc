export default function decorate(block) {
  block.classList.add('press-release');

  [...block.children].slice(1).forEach((row) => {
    row.classList.add('press-release__item');

    const [titleCell, infoCell, linkCell] = [...row.children];

    titleCell.classList.add('press-release__title');
    infoCell.classList.add('press-release__info');

    const link = linkCell.querySelector('a');
    if (link) {
      link.classList.add('press-release__button');
      link.textContent = 'Download';
    }
  });
}
