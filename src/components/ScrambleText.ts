// Hacker Text Decrypt Effect
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function initScrambleText(): void {
  const elements = document.querySelectorAll<HTMLElement>('.scramble-text');
  
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        if (!el.hasAttribute('data-scrambled')) {
          el.setAttribute('data-scrambled', 'true');
          // Fix width to prevent jitter
          el.style.minWidth = `${el.offsetWidth}px`;
          el.style.display = 'inline-block';
          scrambleText(el);
        }
      }
    });
  }, { threshold: 0.5 });

  elements.forEach(el => observer.observe(el));
}

function scrambleText(element: HTMLElement) {
  const originalText = element.getAttribute('data-text') || element.innerText;
  element.setAttribute('data-text', originalText);
  let iterations = 0;
  
  const interval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((letter, index) => {
        if (index < iterations) {
          return originalText[index];
        }
        if (letter === ' ') return ' '; // Preserve spaces
        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      })
      .join('');
    
    if (iterations >= originalText.length) {
      clearInterval(interval);
    }
    
    iterations += 1 / 3; // Speed of reveal
  }, 30);
}
