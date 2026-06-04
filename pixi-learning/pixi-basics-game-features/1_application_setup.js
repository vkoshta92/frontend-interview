// Har game ka pehla step — PIXI.Application banao!

// Basic PixiJS Application
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,      // HiDPI support
  antialias: true,        // Smooth edges
  powerPreference: 'high-performance',
});

// Canvas ko DOM mein add karo
document.getElementById('game').appendChild(
  app.view
);

// App properties
console.log(app.screen.width);   // 1280
console.log(app.screen.height);  // 720
console.log(app.renderer.type);  // WebGL=1, Canvas=2

// Resize handle karo
window.addEventListener('resize', () => {
  app.renderer.resize(
    window.innerWidth,
    window.innerHeight
  );
});

// Pause / Resume
app.ticker.stop();   // Pause
app.ticker.start();  // Resume

// Destroy
app.destroy(true, { children: true });
// gaming_company tip: autoDensity: true — Retina screens pe blurry nahi hoga!