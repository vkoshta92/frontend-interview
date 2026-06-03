// Wild ek jagah stuck rehta hai free spins mein — re-spin hota hai!
class StickyWildSystem {
  constructor() {
    this.stickyPositions = new Map(); // col_row => sprite
    this.freeSpinsLeft = 0;
  }

  // Sticky wild add karo
  addStickyWild(col, row, sprite) {
    const key = `${col}_${row}`;

    if (!this.stickyPositions.has(key)) {
      // Sticky marker lagao
      const marker = new PIXI.Graphics();
      marker.lineStyle(3, 0xFFD700);
      marker.drawRect(-5, -5, 140, 140);
      sprite.addChild(marker);

      // Lock icon
      const lock = new PIXI.Text('🔒', {
        fontSize: 20
      });
      lock.x = 5; lock.y = 5;
      sprite.addChild(lock);

      this.stickyPositions.set(key, {
        sprite, col, row
      });
    }
  }

  // Spin karo — sticky positions preserve karo
  spinWithSticky(reelManager) {
    return new Promise(resolve => {
      reelManager.spin((results) => {
        // Sticky positions pe override karo
        this.stickyPositions.forEach(
          (data, key) => {
            results[data.col][data.row] = 'wild';
          }
        );

        // Naye wilds check karo
        results.forEach((reel, col) => {
          reel.forEach((sym, row) => {
            if (sym === 'wild') {
              this.addStickyWild(
                col, row,
                getSymbolSprite(col, row)
              );
            }
          });
        });

        // Agar naya sticky mila — ek aur spin!
        const prevCount = this.stickyPositions.size;
        if (this.stickyPositions.size > prevCount) {
          this.freeSpinsLeft++;
        }

        resolve(results);
      });
    });
  }

  // Game khatam check karo
  isGameOver() {
    return this.freeSpinsLeft <= 0 &&
      this.stickyPositions.size === 0;
  }

  // Reset karo
  reset() {
    this.stickyPositions.forEach(data => {
      data.sprite.removeChildren();
    });
    this.stickyPositions.clear();
    this.freeSpinsLeft = 0;
  }
}
// ZVKY tip: Sticky Wild = popular bonus feature. ZVKY ke premium games mein yeh zaroor hoga!