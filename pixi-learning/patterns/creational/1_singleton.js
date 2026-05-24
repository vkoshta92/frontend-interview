// Singleton Pattern
// Creational
// GameConfig, AudioManager, ScoreManager — sirf ek instance hona chahiye!

// Simple matlab

// Singleton = poore app mein sirf ek object. Baar baar new mat banao — same instance lo.
class GameManager {
  static #instance = null;

  #score = 0;
  #level = 1;
  #isRunning = false;

  constructor() {
    if (GameManager.#instance) {
      return GameManager.#instance;
    }
    GameManager.#instance = this;
  }

  static getInstance() {
    if (!GameManager.#instance) {
      new GameManager();
    }
    return GameManager.#instance;
  }

  addScore(points) { this.#score += points; }
  getScore() { return this.#score; }
}

// Kahin bhi use karo — same instance milega!
const gm1 = GameManager.getInstance();
const gm2 = GameManager.getInstance();

gm1.addScore(100);
console.log(gm2.getScore()); // 100 — same!
console.log(gm1 === gm2);    // true