// State Machine Pattern
// Behavioral
// IDLE → SPINNING → EVALUATING → WIN/LOSE → IDLE — slot game ka flow!

// Simple matlab

// State Machine = game kaun si state mein hai track karo. Invalid transitions rok do.

const STATE = {
  IDLE:        'IDLE',
  SPINNING:    'SPINNING',
  EVALUATING:  'EVALUATING',
  WIN:         'WIN',
  LOSE:        'LOSE',
  BONUS:       'BONUS',
  FREE_SPINS:  'FREE_SPINS',
};

const TRANSITIONS = {
  [STATE.IDLE]:       [STATE.SPINNING],
  [STATE.SPINNING]:   [STATE.EVALUATING],
  [STATE.EVALUATING]: [STATE.WIN, STATE.LOSE, STATE.BONUS],
  [STATE.WIN]:        [STATE.IDLE, STATE.FREE_SPINS],
  [STATE.LOSE]:       [STATE.IDLE],
  [STATE.BONUS]:      [STATE.IDLE],
  [STATE.FREE_SPINS]: [STATE.SPINNING, STATE.IDLE],
};

class StateMachine {
  #current = STATE.IDLE;
  #handlers = {};
  #history = [];

  get state() { return this.#current; }

  transition(next) {
    const allowed = TRANSITIONS[this.#current] || [];
    if (!allowed.includes(next)) {
      console.error(
        `Invalid: ${this.#current} → ${next}`
      );
      return false;
    }

    const prev = this.#current;
    this.#current = next;
    this.#history.push({ from: prev, to: next });

    this.#handlers[next]?.forEach(fn => fn(prev));
    return true;
  }

  on(state, handler) {
    if (!this.#handlers[state]) {
      this.#handlers[state] = [];
    }
    this.#handlers[state].push(handler);
    return this; // Chaining!
  }

  is(state) { return this.#current === state; }
}

// Use karo
const sm = new StateMachine();

sm.on(STATE.SPINNING, () => {
    reels.forEach(r => r.startSpin());
  })
  .on(STATE.WIN, (from) => {
    showWinAnimation();
    playWinSound();
  })
  .on(STATE.IDLE, () => {
    spinButton.enable();
  });

spinButton.on('click', () => {
  if (sm.is(STATE.IDLE)) {
    sm.transition(STATE.SPINNING);
  }
});
// gaming_company tip: State machine se invalid actions automatically block hote hain — clean code!