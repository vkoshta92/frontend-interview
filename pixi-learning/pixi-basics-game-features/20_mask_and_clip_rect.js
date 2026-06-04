// Symbols reels ke bahar nahi dikhne chahiye — Mask se clip karo!
// Method 1: Graphics Mask
const reelMask = new PIXI.Graphics();
reelMask.beginFill(0xFFFFFF);
reelMask.drawRect(
  0, 0,    // x, y
  140,     // width
  3 * 140  // height (3 rows)
);
reelMask.endFill();

reelContainer.addChild(reelMask);
reelContainer.mask = reelMask;

// Method 2: Sprite Mask
const maskSprite = new PIXI.Sprite(
  PIXI.Texture.from('reel_mask.png')
);
reelContainer.mask = maskSprite;

// Method 3: Circular Mask
const circleMask = new PIXI.Graphics();
circleMask.beginFill(0xFFFFFF);
circleMask.drawCircle(100, 100, 100);
circleMask.endFill();
symbol.mask = circleMask;

// Dynamic mask — Reveal animation
const revealMask = new PIXI.Graphics();
revealContainer.mask = revealMask;

let revealWidth = 0;
app.ticker.add((delta) => {
  if (revealWidth < 800) {
    revealWidth += 10 * delta;
    revealMask.clear();
    revealMask.beginFill(0xFFFFFF);
    revealMask.drawRect(0, 0, revealWidth, 600);
    revealMask.endFill();
  }
});

// Mask remove karo
reelContainer.mask = null;

// ScrollRect alternative
const bounds = new PIXI.Rectangle(0, 0, 140, 420);
sprite.filterArea = bounds; // Filter sirf yahan apply
// gaming_company tip: Mask = performance heavy. Possible ho toh filterArea use karo ya culling!