// Encapsulation (private)
// Important
// Game balance private rakhna chahiye — koi bhi seedha change na kar sake!

// Simple matlab

// Encapsulation = data chhupaao aur sirf methods se access do. # se private variable banta hai.

class GameBalance {
  // Private variable — # se start
  #balance = 0;
  #betAmount = 1;
  #history = [];

  constructor(startBalance) {
    this.#balance = startBalance;
  }

  // Public methods se hi access
  getBalance() {
    return this.#balance;
  }

  placeBet(amount) {
    if (amount > this.#balance) {
      console.log('Insufficient balance!');
      return false;
    }
    if (amount < 0) {
      console.log('Invalid bet!');
      return false;
    }
    this.#balance -= amount;
    this.#betAmount = amount;
    this.#history.push({ type: 'bet', amount });
    return true;
  }

  addWin(amount) {
    this.#balance += amount;
    this.#history.push({ type: 'win', amount });
  }

  getHistory() {
    return [...this.#history]; // Copy return karo
  }
}

const wallet = new GameBalance(1000);

// Sahi tarika
wallet.placeBet(50);
console.log(wallet.getBalance()); // 950

// Galat tarika — private access nahi hoga!
// wallet.#balance = 99999; // ERROR!