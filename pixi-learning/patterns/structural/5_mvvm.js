// MVVM Pattern
// Structural
// ViewModel automatically View update karta hai — balance change hote hi UI change!

// Simple matlab

// MVVM = Model + ViewModel (reactive) + View. ViewModel data change pe auto View update karta hai.

// MODEL
class GameModel {
  balance = 1000;
  bet = 10;
  lastWin = 0;
}

// VIEWMODEL — reactive layer
class GameViewModel {
  #model;
  #listeners = new Map();

  constructor(model) {
    this.#model = model;
  }

  // Reactive getter
  get balance() { return this.#model.balance; }
  get bet()     { return this.#model.bet;     }
  get lastWin() { return this.#model.lastWin; }

  // Observe changes
  observe(property, callback) {
    if (!this.#listeners.has(property)) {
      this.#listeners.set(property, []);
    }
    this.#listeners.get(property).push(callback);
  }

  // Notify observers
  #notify(property) {
    this.#listeners.get(property)?.forEach(
      cb => cb(this.#model[property])
    );
  }

  // Actions
  placeBet(amount) {
    this.#model.bet = amount;
    this.#notify('bet');
  }

  updateBalance(amount) {
    this.#model.balance = amount;
    this.#notify('balance'); // Auto UI update!
  }
}

// VIEW — observes ViewModel
class GameView {
  constructor(viewModel) {
    this.vm = viewModel;

    // Bind — auto update hoga!
    this.vm.observe('balance', (val) => {
      this.balanceText.text = `$${val}`;
    });

    this.vm.observe('bet', (val) => {
      this.betText.text = `Bet: $${val}`;
    });
  }
}

const model = new GameModel();
const vm    = new GameViewModel(model);
const view  = new GameView(vm);

// Balance change karo — View auto update!
vm.updateBalance(500); // balanceText bhi update!
// gaming_company tip: MVVM modern pattern hai — React jaisa feel aata hai. gaming_company mein impress karoge!