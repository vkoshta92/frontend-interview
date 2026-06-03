// 3+ scatter = bonus trigger! ZVKY ke games mein yeh most exciting part hai!
class ScatterSystem {
  constructor(app) {
    this.app = app;
    this.SCATTER_SYMBOL = 'scatter';
    this.MIN_SCATTERS = 3;
  }

  // Scatter count karo (any position)
  countScatters(grid) {
    let count = 0;
    const positions = [];

    grid.forEach((reel, col) => {
      reel.forEach((sym, row) => {
        if (sym === this.SCATTER_SYMBOL) {
          count++;
          positions.push({ col, row });
        }
      });
    });

    return { count, positions };
  }

  // Bonus trigger karo
  async triggerBonus(positions) {
    // Scatter symbols animate karo
    await this.animateScatters(positions);

    // Screen flash
    await this.flashScreen();

    // Bonus announcement
    await this.showBonusAnnouncement();

    // Bonus game start
    return this.startBonusGame();
  }

  async animateScatters(positions) {
    const animations = positions.map(({col, row}) => {
      const sym = getSymbolAt(col, row);
      return new Promise(resolve => {
        let scale = 1;
        let growing = true;
        const pulse = this.app.ticker.add((delta) => {
          scale += (growing ? 0.05 : -0.05) * delta;
          if (scale >= 1.3) growing = false;
          if (scale <= 1) growing = true;
          sym.scale.set(scale);
        });
        setTimeout(() => {
          this.app.ticker.remove(pulse);
          sym.scale.set(1);
          resolve();
        }, 2000);
      });
    });
    await Promise.all(animations);
  }

  async flashScreen() {
    const flash = new PIXI.Graphics();
    flash.beginFill(0xFFFFFF);
    flash.drawRect(0, 0, 1280, 720);
    flash.endFill();
    flash.alpha = 0;
    this.app.stage.addChild(flash);

    return new Promise(resolve => {
      const tween = new Tween(
        flash, { alpha: 0.8 }, 0.2,
        () => {
          new Tween(flash, { alpha: 0 }, 0.3,
            () => {
              this.app.stage.removeChild(flash);
              resolve();
            }
          );
        }
      );
    });
  }

  async showBonusAnnouncement() {
    const text = new PIXI.Text('BONUS GAME!', {
      fontSize: 80, fontWeight: 'bold',
      fill: '#FFD700', stroke: '#000',
      strokeThickness: 8,
    });
    text.anchor.set(0.5);
    text.x = 640; text.y = -100; // Start above
    this.app.stage.addChild(text);

    await new Promise(resolve => {
      new Tween(text, { y: 360 }, 0.5, resolve);
    });
    await this.wait(1500);
    await new Promise(resolve => {
      new Tween(text, { y: 900 }, 0.3, () => {
        this.app.stage.removeChild(text);
        resolve();
      });
    });
  }
}
// ZVKY tip: Scatter anywhere win deta hai — reel position matter nahi karta!