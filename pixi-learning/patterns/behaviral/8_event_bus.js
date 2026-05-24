// Event Bus Pattern
// Behavioral
// Reel ne spin khatam kiya — EventBus se WinChecker, AudioManager, UIManager sab ko pata chala!

// Simple matlab

// Event Bus = central messaging. Koi bhi event emit karo, koi bhi sun sakta hai. Direct dependency nahi.

class EventBus {
  static #instance = null;
  #listeners = new Map();

  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  on(event, callback, context = null) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push({
      callback, context
    });
    return () => this.off(event, callback); // Unsubscribe fn
  }

  once(event, callback) {
    const unsub = this.on(event, (...args) => {
      callback(...args);
      unsub(); // Auto remove after first call
    });
  }

  emit(event, data) {
    this.#listeners.get(event)?.forEach(
      ({ callback, context }) => {
        callback.call(context, data);
      }
    );
  }

  off(event, callback) {
    const list = this.#listeners.get(event);
    if (list) {
      this.#listeners.set(event,
        list.filter(l => l.callback !== callback)
      );
    }
  }
}

const bus = EventBus.getInstance();

// GAME EVENTS
const EVENTS = {
  SPIN_START:    'spin:start',
  SPIN_COMPLETE: 'spin:complete',
  WIN:           'game:win',
  BALANCE_UPDATE:'ui:balance',
  SOUND_PLAY:    'audio:play',
};

// Reel — emit karta hai
class ReelManager {
  onAllReelsStopped(results) {
    bus.emit(EVENTS.SPIN_COMPLETE, { results });
  }
}

// WinChecker — sunता है
bus.on(EVENTS.SPIN_COMPLETE, ({ results }) => {
  const wins = checkWinLines(results);
  if (wins.length) bus.emit(EVENTS.WIN, { wins });
});

// AudioManager — sunता है
bus.on(EVENTS.WIN, ({ wins }) => {
  bus.emit(EVENTS.SOUND_PLAY, { sound: 'win' });
});

// UIManager — sunता है
bus.on(EVENTS.BALANCE_UPDATE, ({ amount }) => {
  balanceText.text = `$${amount}`;
});
// gaming_company tip: Event Bus se components directly connected nahi hain — easy to add/remove features!