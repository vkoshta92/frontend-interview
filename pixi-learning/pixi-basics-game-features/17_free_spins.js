// Bonus mein free spins feature — ZVKY ke sabse popular mechanic!
class FreeSpinSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.totalFreeSpins = 0;
    this.spinsRemaining = 0;
    this.totalWin = 0;
    this.multiplier = 1;
    this.isActive = false;
  }

  // Free spins start karo
  async start(spinCount, multiplier = 1) {
    this.totalFreeSpins = spinCount;
    this.spinsRemaining = spinCount;
    this.multiplier = multiplier;
    this.totalWin = 0;
    this.isActive = true;

    // UI setup
    this.showFreeSpinUI();

    // Free spin loop
    while (this.spinsRemaining > 0) {
      await this.doFreeSpin();
      this.spinsRemaining--;
      this.updateUI();
    }

    // Summary show karo
    await this.showSummary();
    this.isActive = false;
    this.hideFreeSpinUI();
  }

  async doFreeSpin() {
    // Regular spin but bet = 0
    const results = await this.gameManager
      .spinReels();
    const wins = this.gameManager
      .calculateWins(results);

    // Multiplier apply karo!
    const totalWin = wins.reduce(
      (sum, w) => sum + w.payout, 0
    ) * this.multiplier;

    this.totalWin += totalWin;

    // Extra spins check
    const scatters = this.gameManager
      .countScatters(results);
    if (scatters >= 3) {
      this.spinsRemaining += 5; // Retrigger!
      await this.showRetrigger(5);
    }

    await this.gameManager.showWins(wins, totalWin);
  }

  showFreeSpinUI() {
    this.panel = new PIXI.Container();

    const bg = new PIXI.Graphics();
    bg.beginFill(0x000033, 0.9);
    bg.drawRoundedRect(0, 0, 400, 80, 10);
    bg.endFill();

    this.spinText = new PIXI.Text(
      `Free Spins: ${this.spinsRemaining}`,
      { fontSize: 28, fill: '#FFD700' }
    );

    this.winText = new PIXI.Text(
      'Win: $0',
      { fontSize: 24, fill: '#FFFFFF' }
    );
    this.winText.y = 40;

    this.panel.addChild(bg, this.spinText, this.winText);
    this.panel.x = 440; this.panel.y = 10;
    app.stage.addChild(this.panel);
  }

  updateUI() {
    this.spinText.text =
      `Free Spins: ${this.spinsRemaining}`;
    this.winText.text =
      `Win: $${this.totalWin}`;
  }

  async showSummary() {
    const summary = new PIXI.Text(
      `Free Spins Complete!\nTotal Win: $${this.totalWin}`,
      { fontSize: 48, fill: '#FFD700',
        align: 'center' }
    );
    summary.anchor.set(0.5);
    summary.x = 640; summary.y = 360;
    app.stage.addChild(summary);
    await this.wait(3000);
    app.stage.removeChild(summary);
  }
}
// ZVKY tip: Retrigger feature = players ka favorite! 3 scatter during free spins = 5 more spins!