// Win multiplier — 2x, 3x, 5x — balance grow karta hai! gaming_company games mein hota hai!
class MultiplierSystem {
  constructor(app) {
    this.app = app;
    this.currentMultiplier = 1;
    this.maxMultiplier = 10;
    this.trail = []; // Multiplier history
  }

  // Multiplier set karo
  setMultiplier(value) {
    const prev = this.currentMultiplier;
    this.currentMultiplier = Math.min(
      value, this.maxMultiplier
    );
    this.trail.push(this.currentMultiplier);

    // Animate change
    if (this.currentMultiplier > prev) {
      this.animateIncrease();
    }
  }

  // Win pe multiplier apply karo
  applyToWin(baseWin) {
    const total = baseWin * this.currentMultiplier;
    this.showMultiplierText(
      this.currentMultiplier, baseWin, total
    );
    return total;
  }

  // Cascade multiplier — har cascade pe badhta hai
  incrementForCascade(cascadeCount) {
    const multipliers = [1, 2, 3, 5, 8, 10];
    const index = Math.min(
      cascadeCount, multipliers.length - 1
    );
    this.setMultiplier(multipliers[index]);
  }

  async showMultiplierText(mult, base, total) {
    const style = new PIXI.TextStyle({
      fontSize: 64,
      fontWeight: 'bold',
      fill: ['#FFD700', '#FF8C00'],
      stroke: '#000000',
      strokeThickness: 6,
    });

    const text = new PIXI.Text(`x${mult}`, style);
    text.anchor.set(0.5);
    text.x = 640; text.y = 360;
    text.scale.set(0);
    this.app.stage.addChild(text);

    // Scale up animation
    await new Promise(resolve => {
      new Tween(
        text, { scaleX: 1.5, scaleY: 1.5 }, 0.3,
        resolve
      );
    });

    // Show win amount
    const winText = new PIXI.Text(
      `$${base} × ${mult} = $${total}`,
      { fontSize: 32, fill: '#FFFFFF' }
    );
    winText.anchor.set(0.5);
    winText.x = 640; winText.y = 440;
    this.app.stage.addChild(winText);

    await this.wait(1500);
    app.stage.removeChild(text);
    app.stage.removeChild(winText);
  }

  // Multiplier display bar
  createMultiplierBar() {
    const bar = new PIXI.Container();
    const levels = [1, 2, 3, 5, 8, 10];

    levels.forEach((mult, i) => {
      const bg = new PIXI.Graphics();
      bg.beginFill(i < this.currentIndex
        ? 0xFFD700 : 0x333333);
      bg.drawRoundedRect(i*60, 0, 55, 40, 5);
      bg.endFill();

      const txt = new PIXI.Text(`x${mult}`, {
        fontSize: 18, fill: '#FFFFFF'
      });
      txt.anchor.set(0.5);
      txt.x = i*60 + 27; txt.y = 20;

      bar.addChild(bg, txt);
    });

    return bar;
  }
}
// gaming_company tip: Cascade + Multiplier combo = most exciting feature! Har cascade pe multiplier badho!