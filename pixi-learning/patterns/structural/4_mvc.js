// MVC Pattern
// Structural
// Game logic (Model), PixiJS display (View), Input handling (Controller) — sab alag rakho!

// Simple matlab

// MVC = Model (data), View (display), Controller (logic). Sab alag — easy to change!

// MODEL — Game data only
class SlotModel {
  #reelData = [];
  #balance = 1000;
  #bet = 10;
  #winAmount = 0;

  spin() {
    this.#reelData = this.#generateResults();
    this.#balance -= this.#bet;
    this.#winAmount = this.#calculateWin();
    this.#balance += this.#winAmount;
    return this.getState();
  }

  getState() {
    return {
      reels: this.#reelData,
      balance: this.#balance,
      win: this.#winAmount,
      bet: this.#bet
    };
  }

  #generateResults() { /* reel symbols */ }
  #calculateWin() { /* win logic */ }
}

// VIEW — PixiJS display only
class SlotView {
  constructor(app) {
    this.app = app;
    this.reelSprites = [];
    this.balanceText = new PIXI.Text('$1000');
  }

  updateBalance(amount) {
    this.balanceText.text = `$${amount}`;
  }

  showWin(amount) {
    this.winText.text = `WIN: $${amount}!`;
    this.playWinAnimation();
  }

  spinReels(results, onComplete) {
    // Reel spin animation
    this.animateReels(results, onComplete);
  }
}

// CONTROLLER — connects Model & View
class SlotController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupListeners();
  }

  setupListeners() {
    this.view.spinBtn.on('click', () => this.onSpin());
  }

  onSpin() {
    const state = this.model.spin();
    this.view.spinReels(state.reels, () => {
      this.view.updateBalance(state.balance);
      if (state.win > 0) this.view.showWin(state.win);
    });
  }
}

// Bootstrap
const model = new SlotModel();
const view  = new SlotView(app);
const ctrl  = new SlotController(model, view);
// gaming_company tip: MVC se game logic aur display bilkul alag hoti hai — senior developers yahi dekhte hain!



