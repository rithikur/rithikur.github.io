// BIOS Boot Preloader — animates boot messages then fades out via native JS/CSS
import { CoreEngine } from '../engine/CoreEngine';

const bootMessages = [
  'Initializing Hardware Interface...',
  'CPU: Rithik_Architecture... OK',
  'Checking Memory... OK',
  'Injecting CoreEngine... DONE',
  'Starting Render Loop...',
  '[SYSTEM READY]',
];

export function initBootLoader(): void {
  const bootScreen = document.getElementById('boot-screen');
  const bootLog = document.getElementById('boot-log');
  let bootIndex = 0;

  function bootStep() {
    if (!bootScreen || !bootLog) { 
      CoreEngine.init(); 
      triggerReveal();
      return; 
    }
    
    if (bootIndex < bootMessages.length) {
      const p = document.createElement('div');
      p.textContent = `> ${bootMessages[bootIndex]}`;
      bootLog.appendChild(p);
      bootIndex++;
      setTimeout(bootStep, Math.random() * 100 + 30);
    } else {
      setTimeout(() => {
        // Native CSS transition out
        bootScreen.style.transition = 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.8s ease';
        bootScreen.style.transform = 'translateY(-100%)';
        bootScreen.style.opacity = '0';
        
        setTimeout(() => {
          bootScreen.remove();
          CoreEngine.init();
          triggerReveal();
        }, 800);
      }, 300);
    }
  }

  function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(60px)';
      (el as HTMLElement).style.transition = `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
      
      // Trigger reflow
      void (el as HTMLElement).offsetWidth;
      
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'translateY(0)';
    });
  }

  // Module scripts are deferred, so the DOM is guaranteed to be ready.
  bootStep();
}
