/* eslint-disable no-trailing-spaces */
export default function decorate(block) {
  const navItems = [...block.children];

  // Create only the menu container, not the hamburger button
  const menu = document.createElement('ul');
  menu.className = 'nav-menu';
  menu.id = 'navigation-menu'; // ID for header to target

  navItems.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.querySelector('div:nth-child(2)').textContent; // URL column
    link.textContent = item.querySelector('div:nth-child(1)').textContent; // Text column

    link.addEventListener('click', () => {
      menu.classList.remove('active');
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.remove('active');
      }
    });
    li.appendChild(link);
    menu.appendChild(li);
  });

  block.replaceWith(menu);
}
