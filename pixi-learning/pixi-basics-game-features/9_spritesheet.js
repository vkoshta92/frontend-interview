// Symbol idle animations, reel blur — spritesheet se frame-by-frame animation!
// Spritesheet load karo
const sheet = await PIXI.Assets.load(
  'symbols.json' // Texture packer export
);

// Single texture use karo
const cherryTex = sheet.textures['cherry.png'];
const cherry = new PIXI.Sprite(cherryTex);

// Animated Sprite
const frames = [
  sheet.textures['coin_0001.png'],
  sheet.textures['coin_0002.png'],
  sheet.textures['coin_0003.png'],
  sheet.textures['coin_0004.png'],
];

const coinAnim = new PIXI.AnimatedSprite(frames);
coinAnim.x = 300;
coinAnim.y = 200;
coinAnim.anchor.set(0.5);
coinAnim.animationSpeed = 0.15; // frames per tick
coinAnim.loop = true;
coinAnim.play();
app.stage.addChild(coinAnim);

// Control
coinAnim.stop();
coinAnim.play();
coinAnim.gotoAndStop(2); // Frame 2 pe ruko
coinAnim.gotoAndPlay(0); // Frame 0 se play karo

// Events
coinAnim.onComplete = () => {
  console.log('Animation done!');
};
coinAnim.onFrameChange = (frame) => {
  if (frame === 5) playSound('ding');
};

// From spritesheet animation
const explosion = PIXI.AnimatedSprite
  .fromFrames(['explosion_0', 'explosion_1',
               'explosion_2', 'explosion_3']);
explosion.animationSpeed = 0.2;
explosion.loop = false;
explosion.play();
// ZVKY tip: Spritesheet = bahut textures ek file mein — loading fast hoti hai! Texture Packer use karo!