// Observer Pattern
// Behavioral
// Balance change hua — sab UI elements automatically update ho gaye!

// Simple matlab

// Observer = subject apne observers ko notify karta hai jab data change ho. Event Bus ka smaller version.


// Observable — data class
class Observable {
  #observers = new Set();
  #value;

  constructor(initialValue) {
    this.#value = initialValue;
  }

  get value() { return this.#value; }

  set value(newVal) {
    if (newVal === this.#value) return;
    const old = this.#value;
    this.#value = newVal;
    this.#notify(newVal, old);
  }

  subscribe(observer) {
    this.#observers.add(observer);
    observer(this.#value); // Immediate call
    return () => this.#observers.delete(observer);
  }

  #notify(newVal, oldVal) {
    this.#observers.forEach(obs => obs(newVal, oldVal));
  }
}

// Game state as observables
const balance  = new Observable(1000);
const winAmount = new Observable(0);
const isSpinning = new Observable(false);

// UI subscribes — auto update!
balance.subscribe((val) => {
  balanceText.text = `$${val}`;
  if (val <= 0) showOutOfMoneyScreen();
});

winAmount.subscribe((val) => {
  winText.visible = val > 0;
  winText.text = `WIN: $${val}!`;
});

isSpinning.subscribe((spinning) => {
  spinButton.interactive = !spinning;
  spinButton.alpha = spinning ? 0.5 : 1;
});

// Change karo — sab auto update!
balance.value = 900;     // balanceText updates!
winAmount.value = 500;   // winText shows!
isSpinning.value = true; // button disabled!
// gaming_company tip: Observable + Observer = reactive programming. React hooks isi idea pe hain!