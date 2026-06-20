// Cursor.ts — Custom cursor with spring physics and hover expand
import { CoreEngine } from '../engine/CoreEngine';

export function initCustomCursor(): void {
  // Only on pointer/mouse devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.innerHTML = `<div id="cursor-dot"></div><div id="cursor-ring"></div>`;
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;
  let isHovering = false;
  let isClicking = false;

  window.addEventListener('pointermove', (e: PointerEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('pointerdown', () => { isClicking = true; }, { passive: true });
  window.addEventListener('pointerup', () => { isClicking = false; }, { passive: true });

  // Detect hover on interactive elements
  const hoverSelectors = 'a, button, .haptic-target, [class*="hover"], input, textarea, label, .magnetic, .nav-link, .social-icon';
  document.addEventListener('pointerover', (e: PointerEvent) => {
    const target = e.target as Element;
    isHovering = !!target.closest(hoverSelectors);
  }, { passive: true });

  const dot = document.getElementById('cursor-dot')!;
  const ring = document.getElementById('cursor-ring')!;

  CoreEngine.subscribe(() => {
    // Dot follows instantly
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;

    // Ring follows with spring lag
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    // States
    if (isClicking) {
      ring.classList.add('cursor-clicking');
      ring.classList.remove('cursor-hovering');
    } else if (isHovering) {
      ring.classList.add('cursor-hovering');
      ring.classList.remove('cursor-clicking');
    } else {
      ring.classList.remove('cursor-hovering', 'cursor-clicking');
    }
  });
}
