// Ticker & Game Loop
// Easy
// gaming_company mein kyun zaroori hai

// Har game ka heartbeat — gaming_company mein sab kuch Ticker se chalta hai!

// Concept

// PixiJS Ticker har frame callback call karta hai — yahan game state update hoti hai.

// PixiJS Ticker — Game Loop
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e
});

// Delta time — frame rate independent movement
app.ticker.add((delta) => {
  // delta = time since last frame

  // Reels update karo
  reels.forEach(reel => reel.update(delta));

  // Animations update karo
  animationManager.update(delta);

  // Particles update karo
  particleSystem.update(delta);
});

// FPS control — gaming_company standard 60fps
app.ticker.maxFPS = 60;

// Ticker pause karo (game pause)
app.ticker.stop();

// Ticker resume karo
app.ticker.start();

// Specific speed
app.ticker.speed = 0.5; // Slow motion!
// Tip: Delta time use karo — different devices pe same speed milega!