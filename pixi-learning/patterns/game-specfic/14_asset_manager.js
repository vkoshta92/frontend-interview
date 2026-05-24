// Asset Manager
// Game Specific
// Textures, sounds, fonts — sab ek jagah se manage karo. Cache bhi ho!

// Simple matlab

// Asset Manager = sabhi game resources load, cache, aur provide karo. Singleton pattern use karta hai.

class AssetManager {
  static #instance = null;
  #cache = new Map();
  #loading = new Map();

  static getInstance() {
    if (!AssetManager.#instance) {
      AssetManager.#instance = new AssetManager();
    }
    return AssetManager.#instance;
  }

  async load(key, url, onProgress) {
    // Cache mein hai toh return karo
    if (this.#cache.has(key)) {
      return this.#cache.get(key);
    }

    // Already load ho raha hai
    if (this.#loading.has(key)) {
      return this.#loading.get(key);
    }

    const promise = this.#doLoad(key, url, onProgress);
    this.#loading.set(key, promise);

    const asset = await promise;
    this.#loading.delete(key);
    this.#cache.set(key, asset);
    return asset;
  }

  async #doLoad(key, url, onProgress) {
    if (url.endsWith('.png') || url.endsWith('.jpg')) {
      return await PIXI.Assets.load(url);
    }
    if (url.endsWith('.mp3') || url.endsWith('.ogg')) {
      return new Howl({ src: [url] });
    }
    if (url.endsWith('.json')) {
      const r = await fetch(url);
      return r.json();
    }
  }

  async loadBundle(manifest, onProgress) {
    const keys = Object.keys(manifest);
    let loaded = 0;

    await Promise.all(keys.map(async (key) => {
      await this.load(key, manifest[key]);
      loaded++;
      onProgress?.(loaded / keys.length);
    }));
  }

  get(key) { return this.#cache.get(key); }
  has(key) { return this.#cache.has(key); }
  clear()  { this.#cache.clear(); }
}

// Use karo
const assets = AssetManager.getInstance();

await assets.loadBundle({
  cherry:  'symbols/cherry.png',
  seven:   'symbols/seven.png',
  winSfx:  'audio/win.mp3',
  config:  'data/paytable.json',
}, (progress) => {
  loadingBar.value = progress * 100;
});

const cherry = assets.get('cherry'); // Cache se!
// gaming_company tip: Asset Manager se game ek baar load karta hai — speed best hoti hai!