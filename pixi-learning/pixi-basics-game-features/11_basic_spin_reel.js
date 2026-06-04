// Slot game ka core — reels ghoomna aur rukna!
class Reel {
  constructor(app, index, symbols) {
    this.index = index;
    this.container = new PIXI.Container();
    this.container.x = index * 160 + 80;
    this.container.y = 50;

    // Mask lagao — symbols bahar nahi dikhenge
    const mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawRect(0, 0, 140, 420); // 3 rows visible
    mask.endFill();
    this.container.addChild(mask);
    this.container.mask = mask;

    this.symbolHeight = 140;
    this.symbols = [];
    this.position = 0;
    this.speed = 0;
    this.targetPos = 0;
    this.spinning = false;

    // Create symbol sprites
    for (let i = 0; i < 6; i++) {
      const sym = new PIXI.Sprite(
        PIXI.Texture.from(symbols[i % symbols.length])
      );
      sym.width = sym.height = 130;
      sym.x = 5;
      sym.y = i * this.symbolHeight;
      this.container.addChild(sym);
      this.symbols.push(sym);
    }

    app.stage.addChild(this.container);
  }

  startSpin() {
    this.spinning = true;
    this.speed = 40;
  }

  stopAt(result) {
    this.spinning = false;
    this.targetPos = result * this.symbolHeight;
  }

  update(delta) {
    if (this.spinning) {
      this.position += this.speed * delta;
    } else {
      // Ease to target
      const diff = this.targetPos - this.position;
      if (Math.abs(diff) < 1) {
        this.position = this.targetPos;
      } else {
        this.position += diff * 0.15 * delta;
      }
    }

    // Update symbol positions (loop)
    const total = this.symbols.length * this.symbolHeight;
    this.symbols.forEach((sym, i) => {
      let y = (i * this.symbolHeight - this.position) % total;
      if (y < -this.symbolHeight) y += total;
      sym.y = y;
    });
  }
}
// gaming_company tip: Mask lagana zaroori hai — warna symbols container ke bahar dikhenge!