// Static Methods & Properties
// Important
// Game config, constants, utility functions — sab static hote hain!

// Simple matlab

// Static = object banaye bina directly class se call kar sakte hain. Shared data ke liye.

class GameConfig {
  // Static properties — sab shared karte hain
  static MIN_BET = 1;
  static MAX_BET = 100;
  static REELS = 5;
  static ROWS = 3;
  static RTP = 96.5; // Return to player %

  // Static method — object banana nahi padta
  static isValidBet(amount) {
    return amount >= this.MIN_BET &&
           amount <= this.MAX_BET;
  }

  static formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }
}

class MathUtils {
  // Utility functions — static perfect hai
  static randomInt(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    );
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, t) {
    return start + (end - start) * t;
  }
}

// Static use karo — new nahi karna!
console.log(GameConfig.REELS);    // 5
console.log(GameConfig.isValidBet(50)); // true
console.log(GameConfig.isValidBet(500)); // false
console.log(GameConfig.formatCurrency(95.5)); // $95.50

const rand = MathUtils.randomInt(1, 10);
const clamped = MathUtils.clamp(150, 0, 100); // 100