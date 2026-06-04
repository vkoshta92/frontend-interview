// Spin button click, symbol hover, drag — sab PixiJS interaction se!
// Interactive enable karo
sprite.interactive = true;
sprite.cursor = 'pointer'; // CSS cursor

// Click events
sprite.on('click', (event) => {
  console.log('Clicked!', event.data.global);
});

sprite.on('pointerdown', (e) => { /* press */ });
sprite.on('pointerup',   (e) => { /* release */ });
sprite.on('pointermove', (e) => { /* move */ });

// Hover effects
sprite.on('pointerover', () => {
  sprite.tint = 0xCCCCCC; // Darken on hover
  sprite.scale.set(1.05); // Scale up
});
sprite.on('pointerout', () => {
  sprite.tint = 0xFFFFFF; // Reset
  sprite.scale.set(1);
});

// Drag & Drop — bet slider
let dragging = false;
let dragOffset = { x: 0, y: 0 };

handle.on('pointerdown', (e) => {
  dragging = true;
  const pos = e.data.getLocalPosition(handle.parent);
  dragOffset.x = handle.x - pos.x;
});

app.stage.on('pointermove', (e) => {
  if (!dragging) return;
  const pos = e.data.getLocalPosition(app.stage);
  handle.x = Math.max(0,
    Math.min(pos.x + dragOffset.x, 500)
  );
  updateBet(handle.x / 500 * 100);
});

app.stage.on('pointerup', () => {
  dragging = false;
});

// Button with states
class Button extends PIXI.Container {
  constructor(normalTex, hoverTex, pressedTex) {
    super();
    this.interactive = true;
    this.cursor = 'pointer';
    this.sprite = new PIXI.Sprite(normalTex);
    this.addChild(this.sprite);

    this.on('pointerover',  () =>
      this.sprite.texture = hoverTex);
    this.on('pointerout',   () =>
      this.sprite.texture = normalTex);
    this.on('pointerdown',  () =>
      this.sprite.texture = pressedTex);
    this.on('pointerup',    () =>
      this.sprite.texture = hoverTex);
  }

  disable() {
    this.interactive = false;
    this.alpha = 0.5;
  }
  enable() {
    this.interactive = true;
    this.alpha = 1;
  }
}
// gaming_company tip: app.stage.interactive = true zaroori hai global events ke liye!