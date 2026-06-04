// Command Palette — ⌘K / Ctrl+K fuzzy search palette
interface Command {
  title: string;
  action: () => void;
}

export function initCommandPalette(): void {
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdModal = document.getElementById('cmd-modal');
  const cmdInput = document.getElementById('cmd-input') as HTMLInputElement | null;
  const cmdList = document.getElementById('cmd-list');

  if (!cmdPalette || !cmdModal || !cmdInput || !cmdList) return;

  const smoothScroll = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  const setTheme = (colorHex: string) => {
    document.documentElement.style.setProperty('--color-volt', colorHex);
  };

  const commands: Command[] = [
    { title: 'Theme: Volt Green', action: () => setTheme('#ccff00') },
    { title: 'Theme: Cyber Blue', action: () => setTheme('#00f0ff') },
    { title: 'Theme: Neon Purple', action: () => setTheme('#b026ff') },
    { title: 'Theme: Magma Orange', action: () => setTheme('#ff4d00') },
    { title: 'Jump to /home', action: () => smoothScroll('#home') },
    { title: 'Jump to /about', action: () => smoothScroll('#about') },
    { title: 'Jump to /tech-stack', action: () => smoothScroll('#stack') },
    { title: 'Jump to /vibe', action: () => smoothScroll('#vibe') },
    { title: 'Jump to /contact', action: () => smoothScroll('#contact') },
    { title: 'Action: Copy Email', action: () => (document.getElementById('copy-email-btn') as HTMLAnchorElement | null)?.click() },
  ];

  function renderCmd(filter = ''): void {
    cmdList!.innerHTML = '';
    commands
      .filter(c => c.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach((cmd, i) => {
        const el = document.createElement('div');
        el.className = `p-3 rounded cursor-pointer transition-colors flex justify-between items-center mb-1 ${
          i === 0 ? 'bg-white/10 text-white border border-white/20' : 'hover:bg-white/5'
        }`;
        el.innerHTML = `<span>${cmd.title}</span> <span class="text-white/20 text-[10px]">⏎</span>`;
        el.onclick = () => { cmd.action(); closeCmd(); };
        cmdList!.appendChild(el);
      });
  }

  function openCmd(): void {
    cmdPalette!.classList.remove('hidden');
    // Allow reflow
    void cmdPalette!.offsetWidth;
    
    cmdPalette!.style.opacity = '1';
    cmdModal!.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => { cmdInput!.focus(); renderCmd(); }, 100);
  }

  function closeCmd(): void {
    cmdPalette!.style.opacity = '0';
    cmdModal!.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      cmdPalette!.classList.add('hidden');
      document.body.style.overflow = '';
      if (cmdInput) cmdInput.value = '';
    }, 300);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPalette!.classList.contains('hidden')) openCmd(); else closeCmd();
    }
    if (e.key === 'Escape' && !cmdPalette!.classList.contains('hidden')) closeCmd();
  });

  cmdInput.addEventListener('input', (e) => renderCmd((e.target as HTMLInputElement).value));
}
