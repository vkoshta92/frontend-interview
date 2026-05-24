// Getter & Setter
// Important
// Balance update hone pe automatically UI update ho — getter/setter se possible!

// Simple matlab

// Getter = property read karne pe auto function chale. Setter = property set karne pe auto function.

class PlayerWallet {
  #_balance = 0;
  #_bet = 1;

  constructor(balance) {
    this.#_balance = balance;
  }

  // Getter — balance read karne pe chalta hai
  get balance() {
    return this.#_balance;
  }

  // Setter — balance set karne pe chalta hai
  set balance(value) {
    if (value < 0) {
      console.error('Balance negative nahi ho sakta!');
      return;
    }
    this.#_balance = value;
    this.updateUI(); // Auto UI update!
  }

  get bet() {
    return this.#_bet;
  }

  set bet(value) {
    // Validation automatic!
    if (value < 1) value = 1;
    if (value > this.#_balance) {
      value = this.#_balance;
    }
    this.#_bet = value;
    console.log(`Bet set to: ${value}`);
  }

  // Computed getter — koi storage nahi!
  get canSpin() {
    return this.#_balance >= this.#_bet;
  }

  updateUI() {
    // UI automatically update hogi!
    balanceText.text = `Balance: $${this.#_balance}`;
  }
}

const wallet = new PlayerWallet(1000);

// Getter use — function nahi lagana
console.log(wallet.balance); // 1000

// Setter use — validation automatic!
wallet.balance = 500;  // updateUI() auto chala!
wallet.balance = -100; // Error! Blocked!
wallet.bet = 50;       // Validated automatically

console.log(wallet.canSpin); // true