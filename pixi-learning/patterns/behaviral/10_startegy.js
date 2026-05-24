// Strategy Pattern
// Behavioral
// Win calculation strategy — Regular, Bonus, FreeSpins — same interface, alag logic!

// Simple matlab

// Strategy = algorithm ko swap karo runtime pe. Same interface, alag implementation

// Strategy Interface (by convention)
class WinStrategy {
  calculate(symbols, bet) {
    throw new Error('Implement calculate()!');
  }
}

// Alag alag strategies
class NormalWinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier;
    }, 0);
  }
}

class BonusWinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier * 3; // 3x!
    }, 0);
  }
}

class FreeSpinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier * 5; // 5x!
    }, 0);
  }
}

// Context — strategy use karta hai
class GameRound {
  #strategy;

  constructor(strategy) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy; // Runtime swap!
  }

  calculateWin(symbols, bet) {
    return this.#strategy.calculate(symbols, bet);
  }
}

const round = new GameRound(new NormalWinStrategy());
round.calculateWin(symbols, 10); // Normal

round.setStrategy(new BonusWinStrategy());
round.calculateWin(symbols, 10); // 3x win!

round.setStrategy(new FreeSpinStrategy());
round.calculateWin(symbols, 10); // 5x win!
// gaming_company tip: Bonus round shuru hua toh strategy swap karo — code change nahi hota!