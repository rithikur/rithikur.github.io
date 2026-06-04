// Mobile Menu — slide-down overlay with toggle/close logic
import { triggerHaptic } from './Audio';

export function initMobileMenu(): void {
  const mToggle = document.getElementById('menu-toggle');
  const mClose = document.getElementById('menu-close');
  const mMenu = document.getElementById('mobile-menu');

  if (mToggle && mMenu) {
    mToggle.onclick = () => {
      mMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      triggerHaptic(15);
    };
  }

  if (mClose && mMenu) {
    mClose.onclick = () => {
      mMenu.classList.remove('open');
      document.body.style.overflow = '';
      triggerHaptic(15);
    };
  }

  // Fix: Remove scroll lock if device is rotated or resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mMenu?.classList.contains('open')) {
      mMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }, { passive: true });
}
