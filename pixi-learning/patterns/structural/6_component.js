// Component Pattern
// Structural
// ReelComponent, WinLineComponent, BalanceComponent — har cheez alag reusable component!

// Simple matlab

// Component = self-contained, reusable piece. Apna data + display + logic khud manage karta hai.

// Base Component
class Component {
  constructor(container) {
    this.container = container;
    this.children = [];
  }

  addChild(component) {
    this.children.push(component);
    this.container.addChild(component.container);
  }

  update(delta) {
    this.children.forEach(c => c.update(delta));
  }

  destroy() {
    this.children.forEach(c => c.destroy());
    this.container.destroy();
  }
}

// Balance Component — standalone
class BalanceComponent extends Component {
  #amount = 0;

  constructor(x, y) {
    super(new PIXI.Container());
    this.container.x = x;
    this.container.y = y;

    this.bg = new PIXI.Graphics();
    this.text = new PIXI.Text('$0');
    this.container.addChild(this.bg, this.text);
    this.render();
  }

  set amount(val) {
    this.#amount = val;
    this.render(); // Auto redraw!
  }

  render() {
    this.bg.clear()
      .beginFill(0x000000, 0.7)
      .drawRoundedRect(0, 0, 200, 60, 10)
      .endFill();
    this.text.text = `Balance: $${this.#amount}`;
  }
}

// Reel Component
class ReelComponent extends Component {
  constructor(id, x) {
    super(new PIXI.Container());
    this.id = id;
    this.container.x = x;
    this.symbols = [];
    this.spinning = false;
  }

  startSpin() { this.spinning = true; }
  stopSpin(result) {
    this.spinning = false;
    this.showResult(result);
  }

  update(delta) {
    if (this.spinning) this.scrollSymbols(delta);
    super.update(delta);
  }
}

// Game assembles components
const balance = new BalanceComponent(10, 10);
const reels = Array(5).fill(null)
  .map((_, i) => new ReelComponent(i, i * 160));

balance.amount = 1000; // Auto renders!
// gaming_company tip: Component pattern se har cheez independent hai — easy to test, easy to change!