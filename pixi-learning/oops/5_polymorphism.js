// Polymorphism
// Advanced
// Alag alag symbols ka win calculation alag hota hai — same method, alag behavior!

// Simple matlab

// Polymorphism = same method naam, alag alag behavior. Har class apna implementation deti hai.

// Base symbol class
class BaseSymbol {
  constructor(name) {
    this.name = name;
  }

  // Base method
  calculateWin(bet, matchCount) {
    return 0; // Default — no win
  }

  toString() {
    return this.name;
  }
}

// Alag alag symbols — alag win logic
class RegularSymbol extends BaseSymbol {
  constructor(name, multipliers) {
    super(name);
    this.multipliers = multipliers; // [0,0,5,20,100]
  }

  calculateWin(bet, matchCount) {
    // Same method naam — alag logic!
    return bet * this.multipliers[matchCount];
  }
}

class WildSymbol extends BaseSymbol {
  constructor() {
    super('WILD');
  }

  calculateWin(bet, matchCount) {
    // Wild = double multiplier!
    return bet * matchCount * 2;
  }
}

class ScatterSymbol extends BaseSymbol {
  constructor() {
    super('SCATTER');
  }

  calculateWin(bet, matchCount) {
    // Scatter = total bet pe win!
    if (matchCount >= 3) return bet * 10;
    return 0;
  }
}

// Same method — alag behavior!
const symbols = [
  new RegularSymbol('cherry', [0,0,5,20,100]),
  new WildSymbol(),
  new ScatterSymbol()
];

symbols.forEach(sym => {
  // Polymorphism! Same call — alag result
  console.log(sym.calculateWin(10, 3));
  // cherry: 50, wild: 60, scatter: 100
});