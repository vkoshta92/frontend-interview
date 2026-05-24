// Abstract Pattern
// Advanced
// Base game class banao jise extend karna zaroori ho — direct use nahi ho!

// Simple matlab

// JS mein abstract class nahi hai — but pattern se implement kar sakte hain. Error throw karo!
// Abstract class pattern in JS
class AbstractGame {
  constructor(config) {
    // Direct instantiation rok do
    if (new.target === AbstractGame) {
      throw new Error(
        'AbstractGame directly use nahi kar sakte!'
      );
    }
    this.config = config;
    this.isRunning = false;
  }

  // Abstract methods — override zaroori hai
  initialize() {
    throw new Error('initialize() implement karo!');
  }

  onSpin() {
    throw new Error('onSpin() implement karo!');
  }

  calculateWin() {
    throw new Error('calculateWin() implement karo!');
  }

  // Concrete method — sab use kar sakte hain
  start() {
    this.initialize();
    this.isRunning = true;
    console.log('Game started!');
  }

  stop() {
    this.isRunning = false;
  }
}

// Concrete class — implement karo
class SlotGame extends AbstractGame {
  constructor(config) {
    super(config);
    this.reels = [];
  }

  initialize() {
    // Abstract method implement kiya!
    this.reels = Array(5).fill(null).map(
      (_, i) => new Reel(i)
    );
    console.log('Slot game initialized!');
  }

  onSpin() {
    this.reels.forEach(r => r.startSpin());
  }

  calculateWin() {
    return checkWinLines(this.reels);
  }
}

const game = new SlotGame({ bet: 10 });
game.start(); // Works!

// const base = new AbstractGame({}); // ERROR!