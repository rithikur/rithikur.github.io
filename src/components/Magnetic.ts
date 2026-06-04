// Magnetic Elements — Elements pull towards cursor via CoreEngine
import { CoreEngine } from '../engine/CoreEngine';

export function initMagneticElements(): void {
  const elements = document.querySelectorAll<HTMLElement>('.magnetic');
  if (!elements.length) return;

  // Track the current mapped X/Y for each element to lerp it back
  const state = Array.from(elements).map(el => ({
    el,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isHovered: false
  }));
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('pointermove', (e: PointerEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  state.forEach(item => {
    item.el.addEventListener('pointerenter', () => { item.isHovered = true; }, { passive: true });
    item.el.addEventListener('pointerleave', () => { 
      item.isHovered = false; 
      item.targetX = 0;
      item.targetY = 0;
    }, { passive: true });
  });

  CoreEngine.subscribe(() => {
    if (window.innerWidth <= 768) return;

    state.forEach(item => {
      if (item.isHovered) {
        const rect = item.el.getBoundingClientRect();
        // Calculate distance from center of element to mouse
        const relX = mouseX - (rect.left + rect.width / 2);
        const relY = mouseY - (rect.top + rect.height / 2);
        
        // Magnet strength (pull 30% of the distance)
        item.targetX = relX * 0.3;
        item.targetY = relY * 0.3;
      }

      // Smooth lerp
      item.currentX += (item.targetX - item.currentX) * 0.15;
      item.currentY += (item.targetY - item.currentY) * 0.15;

      item.el.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0)`;
    });

    // Global mouse tracking variables for CSS spotlights and grid
    document.documentElement.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
    document.documentElement.style.setProperty('--mouse-x-px', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y-px', `${mouseY}px`);
  });
}
