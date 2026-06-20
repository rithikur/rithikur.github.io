// main.ts — App bootstrap: imports all modules and initialises them in order
import './style.css';

import {
  createIcons,
  Terminal, Folder, ScanLine, Menu,
  Code2, Zap, Box, Layers,
  Wrench, Cpu, Globe,
  Mail, GitBranch, ExternalLink,
  Download
} from 'lucide';

// Core Engine replaces GSAP/Lenis
import { initScrollEffects } from './engine/ScrollEffects';

// Components
import { initAudio, initInteractionSounds } from './components/Audio';
import { initBootLoader } from './components/BootLoader';
import { initCommandPalette } from './components/CommandPalette';
import { initMobileMenu } from './components/MobileMenu';
import { initNavigation } from './components/Navigation';
import { initTerminal } from './components/Terminal';
import { initFooter } from './components/Footer';
import { initMagneticElements } from './components/Magnetic';
import { initScrambleText } from './components/ScrambleText';
import { initCustomCursor } from './components/Cursor';
import { initHeroTypewriter } from './components/HeroTypewriter';

// Lucide icons — replace <i data-lucide="..."> elements with the named set
createIcons({ icons: {
  Terminal, Folder, ScanLine, Menu,
  Code2, Zap, Box, Layers,
  Wrench, Cpu, Globe,
  Mail, GitBranch, ExternalLink,
  Download
} });

// 1. Audio engine
initAudio();
initInteractionSounds();

// 2. Boot preloader — starts CoreEngine when done
initBootLoader();

// 3. Command palette
initCommandPalette();

// 4. Mobile menu
initMobileMenu();

// 6. Navigation smooth scroll + debug toggle
initNavigation();

// 7. Scroll-driven animations (marquee, progress bar, section labels)
initScrollEffects();

// 8. Terminal typewriter & Scramble text
initTerminal();
initScrambleText();

// 9. Footer & Magnetic UI
initMagneticElements();
initFooter();

// 10. Custom cursor
initCustomCursor();

// 11. Hero rotating typewriter
initHeroTypewriter();
