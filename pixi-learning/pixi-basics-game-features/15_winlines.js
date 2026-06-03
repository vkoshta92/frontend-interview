// Kaunsi line win hui — draw karo aur highlight karo!
class WinLineSystem {
  constructor(app, gridContainer) {
    this.app = app;
    this.lineContainer = new PIXI.Container();
    gridContainer.addChild(this.lineContainer);

    // 20 standard win lines define karo
    this.WIN_LINES = [
      [[0,1],[1,1],[2,1],[3,1],[4,1]], // Middle
      [[0,0],[1,0],[2,0],[3,0],[4,0]], // Top
      [[0,2],[1,2],[2,2],[3,2],[4,2]], // Bottom
      [[0,0],[1,1],[2,2],[3,1],[4,0]], // V shape
      [[0,2],[1,1],[2,0],[3,1],[4,2]], // ^ shape
      [[0,0],[1,0],[2,1],[3,2],[4,2]], // Diagonal
      // ... more lines
    ];

    this.LINE_COLORS = [
      0xFF0000, 0x00FF00, 0x0000FF,
      0xFFFF00, 0xFF00FF, 0x00FFFF,
    ];

    this.CELL_W = 150;
    this.CELL_H = 140;
  }

  // Wins calculate karo
  checkWins(grid, bet) {
    const wins = [];

    this.WIN_LINES.forEach((line, lineIndex) => {
      const symbols = line.map(([col, row]) =>
        grid[col][row]
      );

      const first = symbols[0];
      let count = 1;

      for (let i = 1; i < 5; i++) {
        if (symbols[i] === first ||
            symbols[i] === 'wild' ||
            first === 'wild') {
          count++;
        } else break;
      }

      if (count >= 3) {
        const payout = this.getMultiplier(
          first, count
        ) * bet;
        wins.push({ lineIndex, line, count, payout });
      }
    });

    return wins;
  }

  // Win lines draw karo
  async showWins(wins) {
    for (const win of wins) {
      await this.drawLine(win);
      await this.wait(300);
    }
  }

  async drawLine({ line, lineIndex, payout }) {
    const g = new PIXI.Graphics();
    const color = this.LINE_COLORS[
      lineIndex % this.LINE_COLORS.length
    ];

    g.lineStyle(5, color, 0.8);

    line.forEach(([col, row], i) => {
      const x = col * this.CELL_W + this.CELL_W / 2;
      const y = row * this.CELL_H + this.CELL_H / 2;
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);

      // Symbol highlight
      this.highlightSymbol(col, row, color);
    });

    this.lineContainer.addChild(g);

    // Payout text
    const text = new PIXI.BitmapText(
      `+$${payout}`, { fontName: 'WinFont', fontSize: 32 }
    );
    this.lineContainer.addChild(text);

    await this.wait(600);
    this.lineContainer.removeChild(g);
  }

  highlightSymbol(col, row, color) {
    const sym = getSymbolAt(col, row);
    sym.tint = color;
    setTimeout(() => sym.tint = 0xFFFFFF, 600);
  }

  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}
// ZVKY tip: Win lines ek ek dikhao — sab ek saath show mat karo. Players enjoy karte hain sequence mein!