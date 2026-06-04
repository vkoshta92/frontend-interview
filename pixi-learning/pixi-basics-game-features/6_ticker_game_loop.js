// 0 FPS game loop — sab animations, physics yahan update hote hain!
// Basic ticker
app.ticker.add((delta) => {
  // delta = multiplier for frame-rate independence
  // delta = 1 at 60fps, 2 at 30fps
  sprite.x += 5 * delta; // Speed same on all devices
});

// Named ticker (remove karna easy)
const updateReels = (delta) => {
  reels.forEach(reel => reel.update(delta));
};
app.ticker.add(updateReels);
app.ticker.remove(updateReels); // Remove

// FPS control
app.ticker.maxFPS = 60;    // Cap at 60
app.ticker.minFPS = 10;    // Minimum
console.log(app.ticker.FPS); // Current FPS

// One-time callback
app.ticker.addOnce((delta) => {
  console.log('Runs once!');
});

// Custom ticker (separate from app)
const myTicker = new PIXI.Ticker();
myTicker.add((delta) => {
  // Independent loop
});
myTicker.start();

// Elapsed time get karo
const elapsed = app.ticker.elapsedMS; // milliseconds

// Speed factor (slow motion, fast forward)
app.ticker.speed = 0.5; // Half speed!
app.ticker.speed = 2.0; // Double speed!

// FPS display
const fpsText = new PIXI.Text('');
app.ticker.add(() => {
  fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
});
// gaming_company tip: delta use karo movement mein — 60fps aur 30fps pe same speed milegi!