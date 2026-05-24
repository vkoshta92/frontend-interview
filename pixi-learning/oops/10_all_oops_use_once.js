// Complete Game Example
// gaming_company Level
// Sab concepts ek saath — real gaming_company level slot game structure!

// Simple matlab

// Yeh pattern gaming_company mein exactly use hoga — isko samjho aur yaad rakho!

// gaming_company Level — Complete Slot Game OOP Structure

class GameObject {          // Base class
  constructor(x, y) {
    this.x = x; this.y = y;
    this.visible = true;
  }
  show() { this.visible = true; }
  hide() { this.visible = false; }
}

class Symbol extends GameObject {  // Inheritance
  static TYPES = {                  // Static
    CHERRY: { name:'cherry', vals:[0,0,5,20,100] },
    SEVEN:  { name:'seven',  vals:[0,0,50,200,1000] },
    WILD:   { name:'wild',   vals:[0,0,0,0,0] }
  };

  #_highlighted = false;            // Encapsulation

  constructor(x, y, type) {
    super(x, y);                    // Super call
    this.type = type;
    this.name = type.name;
  }

  get highlighted() {               // Getter
    return this.#_highlighted;
  }

  set highlighted(val) {            // Setter
    this.#_highlighted = val;
    this.alpha = val ? 1 : 0.3;    // Auto update
  }

  calculateWin(bet, count) {        // Override ready
    return bet * this.type.vals[count];
  }
}

class WildSymbol extends Symbol {   // Polymorphism
  constructor(x, y) {
    super(x, y, Symbol.TYPES.WILD);
  }

  calculateWin(bet, count) {        // Override!
    return bet * count * 3;         // Wild = 3x!
  }
}

class Reel extends GameObject {
  #symbols = [];
  #isSpinning = false;

  constructor(id, x) {
    super(x, 0);
    this.id = id;
    this.speed = 0;
  }

  get isSpinning() { return this.#isSpinning; }

  startSpin() {
    this.#isSpinning = true;
    this.speed = 50;
  }

  stopSpin() {
    this.#isSpinning = false;
    this.speed = 0;
  }

  update(delta) {
    if (!this.#isSpinning) return;
    // Scroll symbols...
  }
}

// Use karo!
const reels = Array(5).fill(null)
  .map((_, i) => new Reel(i, i * 150));

const wild = new WildSymbol(0, 0);
console.log(wild.calculateWin(10, 3)); // 90
wild.highlighted = true; // Setter!