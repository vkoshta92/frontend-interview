// State Machine
// Medium
// gaming_company mein kyun zaroori hai

// Game ka flow control — IDLE, SPIN, WIN, BONUS states!

// Concept

// State machine = game ki current state track karo. Ek state se doosri state mein transition.
// Game State Machine
const STATES = {
  IDLE: 'IDLE',       // Spin button wait
  SPINNING: 'SPINNING', // Reels ghoom rahi hain
  STOPPING: 'STOPPING',  // Reels ruk rahi hain
  WIN: 'WIN',          // Win animation
  BONUS: 'BONUS',      // Bonus round
  FREE_SPIN: 'FREE_SPIN' // Free spins
};

class GameStateMachine {
  constructor() {
    this.state = STATES.IDLE;
    this.listeners = {};
  }

  // State change karo
  transition(newState) {
    const oldState = this.state;
    this.state = newState;

    console.log(`${oldState} → ${newState}`);

    // Listeners notify karo
    this.emit(newState, oldState);
  }

  // State check karo
  is(state) {
    return this.state === state;
  }

  // Event system
  on(state, callback) {
    if (!this.listeners[state]) {
      this.listeners[state] = [];
    }
    this.listeners[state].push(callback);
  }

  emit(state, oldState) {
    (this.listeners[state] || [])
      .forEach(cb => cb(oldState));
  }
}

// Use karo
const game = new GameStateMachine();

game.on(STATES.WIN, () => {
  showWinAnimation();
  updateBalance();
});

// Spin button click
spinBtn.on('click', () => {
  if (game.is(STATES.IDLE)) {
    game.transition(STATES.SPINNING);
    startAllReels();
  }
});
// Tip: gaming_company ke games mein yahi pattern hoga — pehle yeh samjho!