// Terminal Simulator — typewriter effect triggered by IntersectionObserver
const terminalOutput = [
  '> system.init',
  '> academy.foundation... OK',
  '> IT_UNDERGRAD... ACTIVE',
  '> full_stack... DETECTED',
];

export function initTerminal(): void {
  let lineIdx = 0;
  let charIdx = 0;

  function typeLine(): void {
    const term = document.getElementById('terminal-text');
    if (!term) return;
    if (lineIdx < terminalOutput.length) {
      const line = terminalOutput[lineIdx];
      if (charIdx < line.length) {
        term.innerHTML += line.charAt(charIdx);
        charIdx++;
        setTimeout(typeLine, 20);
      } else {
        term.innerHTML += '<br>';
        charIdx = 0;
        lineIdx++;
        setTimeout(typeLine, 400);
      }
    }
  }

  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeLine();
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(aboutSection);
}
