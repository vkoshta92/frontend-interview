// Balance, Win amount, 'SPIN' button text — sab Text ya BitmapText!
// Regular Text (flexible but slow)
const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fontWeight: 'bold',
  fill: ['#FFD700', '#FF8C00'], // Gradient!
  stroke: '#000000',
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowDistance: 3,
  wordWrap: true,
  wordWrapWidth: 400,
});

const balanceText = new PIXI.Text('$1000', style);
balanceText.x = 50;
balanceText.y = 20;
app.stage.addChild(balanceText);

// Update text
balanceText.text = '$950';

// BitmapText (FAST — use for changing numbers!)
// Pehle font define karo
PIXI.BitmapFont.from('GameFont', {
  fontFamily: 'Arial',
  fontSize: 48,
  fill: 0xFFD700,
  stroke: 0x000000,
  strokeThickness: 3,
}, { chars: PIXI.BitmapFont.NUMERIC });

const winText = new PIXI.BitmapText('0', {
  fontName: 'GameFont',
  fontSize: 48,
});
winText.anchor.set(0.5);

// Number counter animation
let current = 0;
const target = 1000;
app.ticker.add(() => {
  if (current < target) {
    current = Math.min(current + 50, target);
    winText.text = current.toString();
  }
});
// ZVKY tip: BitmapText use karo win counter ke liye — Regular Text slow hota hai baar baar update mein!