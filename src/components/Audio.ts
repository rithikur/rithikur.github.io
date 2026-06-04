// Audio Engine — dynamic oscillator that reacts to sound toggle

let audioCtx: AudioContext | null = null;
let scrollOsc: OscillatorNode | null = null;
let scrollGain: GainNode | null = null;
export let soundEnabled = false;

export function playHoverSound(freq = 800): void {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (_) {}
}

export function getScrollAudio() {
  return { audioCtx, scrollOsc, scrollGain };
}

export function initAudio(): void {
  const audioBtn = document.getElementById('audio-toggle') as HTMLButtonElement | null;
  if (!audioBtn) return;

  audioBtn.onclick = () => {
    if (!soundEnabled) {
      try {
        const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
        audioCtx = new AC();
        scrollOsc = audioCtx.createOscillator();
        scrollGain = audioCtx.createGain();
        scrollOsc.type = 'triangle';
        scrollOsc.frequency.setValueAtTime(40, audioCtx.currentTime);
        scrollGain.gain.setValueAtTime(0, audioCtx.currentTime);
        scrollOsc.connect(scrollGain);
        scrollGain.connect(audioCtx.destination);
        scrollOsc.start();
        soundEnabled = true;
        audioBtn.innerHTML = `<span class="w-1.5 h-1.5 bg-volt rounded-full animate-pulse" id="audio-indicator"></span> SOUND: ON`;
        playHoverSound(600);
      } catch (_) {}
    } else {
      scrollOsc?.stop();
      audioCtx?.close();
      soundEnabled = false;
      audioCtx = null;
      scrollOsc = null;
      scrollGain = null;
      audioBtn.innerHTML = `<span class="w-1.5 h-1.5 bg-gray-600 rounded-full" id="audio-indicator"></span> SOUND: OFF`;
    }
    triggerHaptic(15);
  };
}

export function triggerHaptic(pattern: number | number[] = 15): void {
  if (window.navigator?.vibrate) {
    try { window.navigator.vibrate(pattern); } catch (_) {}
  }
}

// Add interaction listeners for haptics and hover sounds since Cursor was removed
export function initInteractionSounds(): void {
  document.querySelectorAll<HTMLElement>('a, button, .group, .haptic-target').forEach(el => {
    el.addEventListener('pointerenter', () => {
      playHoverSound(800);
    }, { passive: true });
    el.addEventListener('click', () => triggerHaptic(15));
  });
}
