// Scroll Effects — handles marquees, progress bar, section tracker using CoreEngine
import { CoreEngine } from './CoreEngine';
import { soundEnabled, getScrollAudio } from '../components/Audio';

export function initScrollEffects(): void {
  // Cache DOM refs
  const pb = document.getElementById('progress-bar');
  const sp = document.getElementById('scroll-percent');
  const pathEl = document.getElementById('os-path');
  const labelEl = document.getElementById('section-label');
  
  const marqueeL = document.getElementById('marquee-l');
  const marqueeR = document.getElementById('marquee-r');

  // Cache section offsets
  const sectionIds = ['home', 'about', 'stack', 'vibe', 'contact'];
  let sectionTops: Array<{ id: string; top: number }> = [];

  function cacheSections() {
    sectionTops = sectionIds.map(id => ({
      id,
      top: document.getElementById(id)?.offsetTop ?? Infinity,
    }));
  }
  cacheSections();
  window.addEventListener('resize', cacheSections, { passive: true });

  // Marquee state
  let marqueeL_X = 0;
  let marqueeR_X = -25;
  let targetSpeedMultiplier = 1;
  let currentSpeedMultiplier = 1;

  CoreEngine.subscribe((_time, deltaTime) => {
    // Velocity from CoreEngine
    const v = Math.abs(CoreEngine.scrollVelocity);

    // 1. Audio Modulation
    if (soundEnabled) {
      const { scrollOsc, scrollGain, audioCtx } = getScrollAudio();
      if (scrollOsc && scrollGain && audioCtx) {
        scrollOsc.frequency.setTargetAtTime(40 + v * 0.5, audioCtx.currentTime, 0.1);
        scrollGain.gain.setTargetAtTime(Math.min(v * 0.002, 0.05), audioCtx.currentTime, 0.1);
      }
    }

    // 2. Marquee Speed & Movement
    targetSpeedMultiplier = 1 + Math.min(v * 0.05, 3);
    currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.1;

    if (marqueeL && marqueeR) {
      // Base speed: much slower, around 0.3 base units per frame
      const moveAmt = (0.3 * currentSpeedMultiplier * deltaTime) / 16.66;
      
      marqueeL_X -= moveAmt * 0.1; // adjust to percentage
      marqueeR_X += moveAmt * 0.1;

      // Wrap around (assuming 25% is the repetition boundary based on the original GSAP xPercent: -25)
      if (marqueeL_X <= -25) marqueeL_X += 25;
      if (marqueeR_X >= 0) marqueeR_X -= 25;

      marqueeL.style.transform = `translate3d(${marqueeL_X}%, 0, 0)`;
      marqueeR.style.transform = `translate3d(${marqueeR_X}%, 0, 0)`;
    }

    // 3. Scroll Progress
    if (CoreEngine.scrollLimit > 0) {
      const pct = Math.min(1, Math.max(0, CoreEngine.scrollY / CoreEngine.scrollLimit));
      
      if (pb) pb.style.height = `${pct * 100}%`;
      if (sp) sp.innerText = `${Math.round(pct * 100)}% SCROLLED`;
    }

    // 4. Section Tracker
    const scrollPos = CoreEngine.scrollY + 200;
    let activeId = sectionIds[0];
    for (const s of sectionTops) {
      if (scrollPos >= s.top) activeId = s.id;
    }
    if (pathEl) pathEl.innerText = `ROOT/${activeId.toUpperCase()}`;
    if (labelEl) labelEl.textContent = activeId.charAt(0).toUpperCase() + activeId.slice(1);
  });
}
