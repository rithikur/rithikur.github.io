// Footer — live clock, email copy, footer parallax via CoreEngine
import { triggerHaptic } from './Audio';
import { CoreEngine } from '../engine/CoreEngine';

function copyToClipboard(): void {
  const el = document.createElement('textarea');
  el.value = 'rithikur@gmail.com';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  const txt = document.getElementById('email-text');
  if (txt) {
    const orig = txt.textContent ?? '';
    txt.textContent = 'COPIED!';
    triggerHaptic(15);
    setTimeout(() => { txt.textContent = orig; }, 2000);
  }
}

export function initFooter(): void {
  // Email copy buttons
  const copyTrig = document.getElementById('copy-email-trigger');
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyTrig) copyTrig.onclick = copyToClipboard;
  if (copyBtn) copyBtn.onclick = (e) => { e.preventDefault(); copyToClipboard(); };

  // Live clock
  function updateClock(): void {
    const ltf = document.getElementById('live-time-footer');
    if (ltf) {
      ltf.textContent = new Date().toLocaleTimeString('en-IN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Footer name parallax via CoreEngine
  const parallaxName = document.getElementById('parallax-name');
  const contactSection = document.getElementById('contact');
  
  if (parallaxName && contactSection) {
    CoreEngine.subscribe(() => {
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If footer is visible
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate progress from 0 (just appeared) to 1 (fully visible)
        const progress = 1 - (rect.top / windowHeight);
        const maxScroll = Math.min(Math.max(progress, 0), 1.5);
        
        // Map 0 -> 1.5 progress to 15% -> -35% translate
        const xPercent = 15 - (maxScroll * 50);
        parallaxName.style.transform = `translateX(${xPercent}%)`;
      }
    });
  }

  // Reveal-fade scroll animations via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll<HTMLElement>('.reveal-fade').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
