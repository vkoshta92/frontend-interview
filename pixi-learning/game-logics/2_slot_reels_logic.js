// Slot Reel Logic
// Advanced
// gaming_company mein kyun zaroori hai

// gaming_company ka core kaam — slot reels banana aur spin karna!

// Concept

// Reel = vertical strip of symbols. Spin = symbols upar se neeche scroll karte hain, phir stop hote hain.

// Slot Reel — Basic Structure
class Reel {
  constructor(app, symbols, x) {
    this.container = new PIXI.Container();
    this.container.x = x;
    this.symbols = [];
    this.position = 0;
    this.speed = 0;
    this.isSpinning = false;

    // 5 symbols per reel
    for (let i = 0; i < 5; i++) {
      const symbol = new PIXI.Sprite(
        getRandomTexture(symbols)
      );
      symbol.y = i * 150; // 150px per symbol
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }

    app.stage.addChild(this.container);
  }

  // Spin shuru karo
  startSpin() {
    this.isSpinning = true;
    this.speed = 50; // pixels per frame
  }

  // Har frame update
  update() {
    if (!this.isSpinning) return;

    this.position += this.speed;

    // Symbols scroll karo
    this.symbols.forEach((symbol, i) => {
      symbol.y = (
        (this.position + i * 150) % (5 * 150)
      );
    });
  }

  // Stop karo target position pe
  stopAt(targetSymbol) {
    this.isSpinning = false;
    // Smooth stop logic yahan aayega
  }
}
// Tip: Har reel independent hoti hai — gaming_company mein 5 reels hogi usually!