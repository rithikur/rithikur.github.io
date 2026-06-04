// Core Engine — Unified rAF loop and Scroll observer (No GSAP, No Lenis)

export type FrameCallback = (time: number, deltaTime: number) => void;

class Engine {
  private subscribers: Set<FrameCallback> = new Set();
  private lastTime: number = 0;
  private rafId: number = 0;
  private running: boolean = false;

  // Scroll State
  public scrollY: number = 0;
  public scrollVelocity: number = 0;
  public scrollLimit: number = 0;
  private lastScrollY: number = 0;

  constructor() {
    this.updateScrollState = this.updateScrollState.bind(this);
    this.loop = this.loop.bind(this);
  }

  public init() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    
    // Initial scroll state
    this.updateScrollState();
    
    // Listen to native scroll
    window.addEventListener('scroll', this.updateScrollState, { passive: true });
    window.addEventListener('resize', this.updateScrollState, { passive: true });

    this.rafId = requestAnimationFrame(this.loop);
  }

  public subscribe(cb: FrameCallback) {
    this.subscribers.add(cb);
  }

  public unsubscribe(cb: FrameCallback) {
    this.subscribers.delete(cb);
  }

  private updateScrollState() {
    this.scrollY = window.scrollY;
    this.scrollLimit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  private loop(time: number) {
    if (!this.running) return;

    const deltaTime = Math.min(time - this.lastTime, 100); // cap delta at 100ms
    this.lastTime = time;

    // Calculate velocity (pixels per frame)
    this.scrollVelocity = this.scrollY - this.lastScrollY;
    this.lastScrollY = this.scrollY;

    // Execute all subscriptions
    for (const cb of this.subscribers) {
      cb(time, deltaTime);
    }

    this.rafId = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.updateScrollState);
    window.removeEventListener('resize', this.updateScrollState);
  }
}

export const CoreEngine = new Engine();
