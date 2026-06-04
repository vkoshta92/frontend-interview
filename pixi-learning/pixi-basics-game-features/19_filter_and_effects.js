// Glow, blur, color matrix — premium visual effects gaming_company games mein!
// npm install @pixi/filter-glow
// npm install @pixi/filter-blur
// npm install @pixi/filter-color-matrix

// Glow Filter — Win symbols pe
import { GlowFilter } from '@pixi/filter-glow';

const glow = new GlowFilter({
  distance: 15,
  outerStrength: 2,
  innerStrength: 1,
  color: 0xFFD700,
  quality: 0.5,
});
symbol.filters = [glow];

// Animate glow pulse
app.ticker.add((delta) => {
  glow.outerStrength =
    2 + Math.sin(Date.now() / 200) * 1.5;
});

// Blur Filter — Reel spinning blur
const blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blurY = 20; // Vertical blur
blurFilter.blurX = 0;
reelContainer.filters = [blurFilter];

// Remove blur when stopped
reelContainer.filters = [];

// Color Matrix — Symbol highlight
const colorMatrix = new PIXI.filters.ColorMatrixFilter();
colorMatrix.brightness(1.5); // Brighten
colorMatrix.saturate(0.5);   // Desaturate
colorMatrix.night(0.5);      // Night mode
colorMatrix.sepia(false);    // Sepia

// Multiple filters combine karo
symbol.filters = [glow, colorMatrix];

// Displacement — Water/heat effect
const displacementSprite = new PIXI.Sprite(
  PIXI.Texture.from('displacement.png')
);
displacementSprite.texture.baseTexture.wrapMode =
  PIXI.WRAP_MODES.REPEAT;
const displacement =
  new PIXI.filters.DisplacementFilter(
    displacementSprite, 20
  );
app.stage.addChild(displacementSprite);
app.stage.filters = [displacement];

// Animate displacement
app.ticker.add((delta) => {
  displacementSprite.x += 1 * delta;
  displacementSprite.y += 0.5 * delta;
});

// Remove all filters
symbol.filters = null;
// gaming_company tip: BlurFilter on spinning reel = realistic slot feel! Remove karo jab reel ruke!