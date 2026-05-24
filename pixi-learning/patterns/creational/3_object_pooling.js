// Object Pool Pattern
// Creational
// Slot mein bahut particles, symbols hain — har baar new banana slow hai. Pool se reuse karo!

// Simple matlab

// Pool = objects pre-banao, use karo, wapas karo. Memory aur performance dono better.

class ObjectPool {
  #pool = [];
  #active = new Set();
  #factory;
  #maxSize;

  constructor(factory, initialSize = 20, maxSize = 100) {
    this.#factory = factory;
    this.#maxSize = maxSize;

    // Pre-create objects
    for (let i = 0; i < initialSize; i++) {
      this.#pool.push(this.#factory());
    }
  }

  acquire() {
    let obj = this.#pool.pop();

    if (!obj && this.#active.size < this.#maxSize) {
      obj = this.#factory(); // Pool khali — naya banao
    }

    if (obj) {
      this.#active.add(obj);
      obj.onAcquire?.(); // Reset hook
    }
    return obj;
  }

  release(obj) {
    if (!this.#active.has(obj)) return;
    this.#active.delete(obj);
    obj.onRelease?.(); // Cleanup hook
    this.#pool.push(obj);
  }

  get activeCount() { return this.#active.size; }
  get poolSize()    { return this.#pool.length;  }
}

// Coin particles ke liye pool
const coinPool = new ObjectPool(
  () => new CoinParticle(),
  50, 200
);

// Win pe coins emit karo
function emitCoins(x, y, count) {
  for (let i = 0; i < count; i++) {
    const coin = coinPool.acquire();
    coin.x = x; coin.y = y;
    coin.launch();
    setTimeout(() => coinPool.release(coin), 2000);
  }
}