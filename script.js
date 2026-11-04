'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

function setupFilters(buttonAttribute, itemSelector, matches, statusSelector, noun) {
  const buttons = document.querySelectorAll(`[${buttonAttribute}]`);
  const items = document.querySelectorAll(itemSelector);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute(buttonAttribute);
      buttons.forEach(other => {
        const selected = button === other;
        other.classList.toggle('active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      items.forEach(item => {
        item.hidden = value !== 'all' && !matches(item, value);
        if (!item.hidden) count++;
      });
      document.querySelector(statusSelector).textContent = `Showing ${count} ${noun}${count === 1 ? '' : 's'}.`;
    });
  });
}
setupFilters('data-pub-filter', '.publication', (item, value) => item.dataset.pubStatus === value, '#pub-filter-status', 'publication or manuscript');
setupFilters('data-project-filter', '.project-card', (item, value) => item.dataset.category.split(' ').includes(value), '#project-filter-status', 'project');

const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
let copyReset;
copyButton.addEventListener('click', async () => {
  clearTimeout(copyReset);
  try {
    await navigator.clipboard.writeText('ziaulbinbashar@gmail.com');
    copyButton.querySelector('span').textContent = 'Email copied';
    copyStatus.textContent = 'Ready to paste into your email app.';
  } catch {
    copyStatus.textContent = 'Select the email address above to copy it, or click it to write an email.';
  }
  copyReset = setTimeout(() => {
    copyButton.querySelector('span').textContent = 'Copy email address';
    copyStatus.textContent = '';
  }, 5000);
});
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
