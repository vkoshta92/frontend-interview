// Factory Pattern
// Creational
// Symbol banana — 'cherry', 'seven', 'wild' — Factory decide karti hai kaunsa banaye!

// Simple matlab

// Factory = object banane ka kaam ek jagah centralize karo. Caller ko details nahi pata honi chahiye.
class SymbolFactory {
  static CONFIGS = {
    cherry:  { value: 5,    color: 0xFF0000, rare: false },
    orange:  { value: 10,   color: 0xFF8800, rare: false },
    seven:   { value: 100,  color: 0xFF0000, rare: true  },
    bar:     { value: 25,   color: 0xFFD700, rare: false },
    wild:    { value: 0,    color: 0xFFFFFF, rare: true  },
    scatter: { value: 0,    color: 0x00FFFF, rare: true  },
  };

  static create(type, x, y) {
    const config = this.CONFIGS[type];
    if (!config) throw new Error(`Unknown: ${type}`);

    // Alag alag symbol types
    switch(type) {
      case 'wild':    return new WildSymbol(x, y, config);
      case 'scatter': return new ScatterSymbol(x,y,config);
      default:        return new RegularSymbol(x,y,config);
    }
  }

  static createRandom(x, y) {
    const types = Object.keys(this.CONFIGS);
    const type = types[
      Math.floor(Math.random() * types.length)
    ];
    return this.create(type, x, y);
  }
}

// Simple use — factory handle karti hai sab
const cherry  = SymbolFactory.create('cherry', 0, 0);
const wild    = SymbolFactory.create('wild', 100, 0);
const random  = SymbolFactory.createRandom(200, 0);