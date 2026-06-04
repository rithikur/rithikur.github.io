import { triggerHaptic } from './Audio';

export function initNavigation(): void {
  // Smooth scroll for all nav and mobile links
  document.querySelectorAll<HTMLAnchorElement>('.nav-link, .mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = targetId ? document.querySelector(targetId) : null;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        const mMenu = document.getElementById('mobile-menu');
        if (mMenu?.classList.contains('open')) {
          mMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
      triggerHaptic(15);
    });
  });

  // Logo click — scroll to top
  const brandLogo = document.querySelector('.brand-logo') as HTMLElement | null;
  if (brandLogo) {
    brandLogo.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
