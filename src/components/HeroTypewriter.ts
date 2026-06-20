// HeroTypewriter.ts — Rotating role typewriter in the hero subtitle
const roles = [
  'Crafting Full Stack Web Apps.',
  'Designing 3D worlds in Blender.',
  'Mastering Systems Programming.',
  'Learning. Building. Shipping.',
  'Turning ideas into real products.',
];

export function initHeroTypewriter(): void {
  const el = document.getElementById('hero-typewriter') as HTMLElement;
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function type(): void {
    if (paused) return;

    const current = roles[roleIdx];

    if (!deleting) {
      // Typing forward
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        // Pause at end
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 55);
    } else {
      // Deleting
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 28);
    }
  }

  type();
}
