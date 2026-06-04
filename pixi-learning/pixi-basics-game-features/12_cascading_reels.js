// Win pe symbols gayab ho jaate hain — upar se naye girate hain. Popular mechanic!
class CascadeSystem {
  constructor(grid, symbolPool) {
    this.grid = grid; // 5x3 grid of symbols
    this.symbolPool = symbolPool;
    this.isAnimating = false;
  }

  // Step 1: Win wale symbols hatao
  async removeWinningSymbols(winPositions) {
    this.isAnimating = true;
    const removePromises = winPositions.map(
      ({col, row}) => {
        return this.animateRemove(
          this.grid[col][row]
        );
      }
    );
    await Promise.all(removePromises);

    // Grid se null karo
    winPositions.forEach(({col, row}) => {
      this.grid[col][row] = null;
    });
  }

  // Step 2: Remaining symbols neeche girao
  async dropSymbols() {
    const dropPromises = [];

    for (let col = 0; col < 5; col++) {
      for (let row = 2; row >= 0; row--) {
        if (this.grid[col][row] === null) {
          // Upar wale symbols dhundho
          for (let above = row-1; above >= 0; above--) {
            if (this.grid[col][above] !== null) {
              // Move this symbol down
              const sym = this.grid[col][above];
              this.grid[col][row] = sym;
              this.grid[col][above] = null;
              dropPromises.push(
                this.animateDrop(sym, row * 140)
              );
              break;
            }
          }
        }
      }
    }

    await Promise.all(dropPromises);
  }

  // Step 3: Top se naye symbols add karo
  async addNewSymbols() {
    const addPromises = [];

    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.grid[col][row] === null) {
          const newSym = this.symbolPool.acquire();
          newSym.y = -140; // Upar se start
          this.grid[col][row] = newSym;
          addPromises.push(
            this.animateDrop(newSym, row * 140)
          );
        }
      }
    }

    await Promise.all(addPromises);
  }

  // Cascade loop — jab tak win ho
  async doCascade() {
    let hasWin = true;

    while (hasWin) {
      const wins = this.checkWins(this.grid);
      hasWin = wins.length > 0;

      if (hasWin) {
        await this.removeWinningSymbols(wins);
        await this.dropSymbols();
        await this.addNewSymbols();
        this.addWinAmount(wins);
      }
    }

    this.isAnimating = false;
  }

  animateRemove(symbol) {
    return new Promise(resolve => {
      // Scale down + fade out
      const tween = new Tween(
        symbol, { alpha: 0, scaleX: 0, scaleY: 0 },
        0.3, resolve
      );
      activeTweens.push(tween);
    });
  }

  animateDrop(symbol, targetY) {
    return new Promise(resolve => {
      const tween = new Tween(
        symbol, { y: targetY }, 0.4, resolve
      );
      activeTweens.push(tween);
    });
  }
}
// gaming_company tip: Promise.all se sab animations parallel chalti hain — ek ek se zyada fast lagta hai!