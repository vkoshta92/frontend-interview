// Inheritance (extends)
// Important
// BaseGame class banao — SlotGame aur PokerGame usse inherit karein!

// Simple matlab

// Inheritance = child class parent ki sab properties aur methods le leti hai. Code reuse hota hai!

// Parent class — base game
class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.alpha = 1;
  }

  show() { this.visible = true; }
  hide() { this.visible = false; }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Child class — Symbol inherits GameObject
class Symbol extends GameObject {
  constructor(x, y, name, value) {
    super(x, y); // Parent constructor call
    this.name = name;
    this.value = value;
  }

  highlight() {
    this.alpha = 0.5; // Dim karo
    // Parent ki moveTo bhi use kar sakte hain!
  }
}

// Child class — Button inherits GameObject
class Button extends GameObject {
  constructor(x, y, label) {
    super(x, y);
    this.label = label;
    this.enabled = true;
  }

  click() {
    if (this.enabled) {
      console.log(`${this.label} clicked!`);
    }
  }
}

const cherry = new Symbol(100, 200, 'cherry', 5);
cherry.moveTo(150, 200); // Parent method!
cherry.highlight();       // Own method!

const spinBtn = new Button(400, 500, 'SPIN');
spinBtn.click(); // SPIN clicked!