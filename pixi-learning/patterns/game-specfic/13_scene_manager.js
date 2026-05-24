// Scene Manager
// Game Specific
// LoadingScene → MenuScene → GameScene → WinScene — scenes manage karna!

// Simple matlab

// Scene Manager = alag alag game screens manage karo. Ek baar ek scene active.

class Scene {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
  }

  onEnter(data) {} // Scene shuru
  onExit()  {}     // Scene khatam
  update(delta) {}
}

class SceneManager {
  static #instance = null;
  #scenes = new Map();
  #current = null;
  #app;

  constructor(app) {
    this.#app = app;
    this.#app.ticker.add(d => this.update(d));
  }

  static getInstance(app) {
    if (!SceneManager.#instance) {
      SceneManager.#instance = new SceneManager(app);
    }
    return SceneManager.#instance;
  }

  register(name, scene) {
    this.#scenes.set(name, scene);
  }

  async goto(name, data = {}) {
    const next = this.#scenes.get(name);
    if (!next) throw new Error(`Scene not found: ${name}`);

    if (this.#current) {
      this.#current.onExit();
      this.#app.stage.removeChild(this.#current.container);
    }

    this.#current = next;
    this.#app.stage.addChild(next.container);
    await next.onEnter(data);
  }

  update(delta) {
    this.#current?.update(delta);
  }
}

// Scenes
class LoadingScene extends Scene {
  async onEnter() {
    this.bar = new ProgressBar(this.container);
    await AssetManager.loadAll((p) => {
      this.bar.progress = p;
    });
    SceneManager.getInstance().goto('menu');
  }
}

class GameScene extends Scene {
  onEnter({ bet }) {
    this.game = new SlotGame(bet);
  }
  update(delta) { this.game.update(delta); }
}

const sm = SceneManager.getInstance(app);
sm.register('loading', new LoadingScene(app));
sm.register('menu',    new MenuScene(app));
sm.register('game',    new GameScene(app));

sm.goto('loading'); // Start!
// gaming_company tip: Scene Manager se loading, menu, game sab cleanly manage hota hai!