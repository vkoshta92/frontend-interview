// Class & Object
// Basic
// Har game element ek object hota hai — Symbol, Reel, Button sab class se bante hain!
// Simple matlab
// Class = blueprint. Object = us blueprint se bana real item.
// Class = Symbol ka blueprint
class Symbol {
  constructor(name, value) {
    this.name = name;    // 'cherry', 'seven'
    this.value = value;  // win multiplier
    this.x = 0;
    this.y = 0;
  }

  display() {
    console.log(`${this.name} at (${this.x}, ${this.y})`);
  }
}

// Objects banao — same class se alag alag
const cherry = new Symbol('cherry', 5);
const seven  = new Symbol('seven', 100);
const wild   = new Symbol('wild', 0);

cherry.x = 100;
cherry.display(); // cherry at (100, 0)
seven.display();  // seven at (0, 0)

// Har symbol alag object hai!
console.log(cherry === seven); // false