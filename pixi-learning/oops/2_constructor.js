// Constructor
// Basic
// Game shuru hone pe objects initialize karne ke liye constructor use hota hai!

// Simple matlab

// Constructor = class ka pehla method jo object banate waqt automatically chalta hai.

class Reel {
  constructor(id, symbolCount, speed) {
    // Yeh sab automatically set hota hai
    // jab new Reel() likhte hain
    this.id = id;
    this.symbolCount = symbolCount;
    this.speed = speed;
    this.isSpinning = false;
    this.symbols = [];
    this.currentPosition = 0;

    // Constructor mein kaam bhi kar sakte hain
    this.initialize();
  }

  initialize() {
    console.log(`Reel ${this.id} ready!`);
    // Symbols populate karo
    for (let i = 0; i < this.symbolCount; i++) {
      this.symbols.push(getRandomSymbol());
    }
  }
}

// Constructor automatically chalta hai
const reel1 = new Reel(1, 20, 50);
const reel2 = new Reel(2, 20, 60);
const reel3 = new Reel(3, 20, 55);

// Har reel apni values ke saath ready!
console.log(reel1.id);    // 1
console.log(reel2.speed); // 60