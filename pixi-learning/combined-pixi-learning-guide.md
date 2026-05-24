# PixiJS & Game Development Combined Guide

This guide combines the content from the three HTML files in `pixi-learning`:
- `design_patterns_game_dev.html`
- `oops_js_game_guide.html`
- `pixi_advanced_guide.html`

Each section includes the concept, the gaming_company game development context, simple explanation, code example, and tip.

---

## 1. Design Patterns for Game Development

### 1. Singleton Pattern
- Category: Creational
- gaming_company: GameConfig, AudioManager, ScoreManager — sirf ek instance hona chahiye!
- Simple: Singleton = poore app mein sirf ek object. Baar baar `new` mat banao — same instance lo.

```js
class GameManager {
  static #instance = null;

  #score = 0;
  #level = 1;
  #isRunning = false;

  constructor() {
    if (GameManager.#instance) {
      return GameManager.#instance;
    }
    GameManager.#instance = this;
  }

  static getInstance() {
    if (!GameManager.#instance) {
      new GameManager();
    }
    return GameManager.#instance;
  }

  addScore(points) { this.#score += points; }
  getScore() { return this.#score; }
}

// Kahin bhi use karo — same instance milega!
const gm1 = GameManager.getInstance();
const gm2 = GameManager.getInstance();

gm1.addScore(100);
console.log(gm2.getScore()); // 100 — same!
console.log(gm1 === gm2);    // true
```

**Tip:** AudioManager, AssetManager — gaming_company mein sab Singleton hote hain!

### 2. Factory Pattern
- Category: Creational
- gaming_company: Symbol banana — `cherry`, `seven`, `wild` — Factory decide karti hai kaunsa banaye!
- Simple: Factory = object banane ka kaam ek jagah centralize karo. Caller ko details nahi pata honi chahiye.

```js
class SymbolFactory {
  static CONFIGS = {
    cherry:  { value: 5,    color: 0xFF0000, rare: false },
    orange:  { value: 10,   color: 0xFF8800, rare: false },
    seven:   { value: 100,  color: 0xFF0000, rare: true  },
    bar:     { value: 25,   color: 0xFFD700, rare: false },
    wild:    { value: 0,    color: 0xFFFFFF, rare: true  },
    scatter: { value: 0,    color: 0x00FFFF, rare: true  },
  };

  static create(type, x, y) {
    const config = this.CONFIGS[type];
    if (!config) throw new Error(`Unknown: ${type}`);

    switch(type) {
      case 'wild':    return new WildSymbol(x, y, config);
      case 'scatter': return new ScatterSymbol(x,y,config);
      default:        return new RegularSymbol(x,y,config);
    }
  }

  static createRandom(x, y) {
    const types = Object.keys(this.CONFIGS);
    const type = types[
      Math.floor(Math.random() * types.length)
    ];
    return this.create(type, x, y);
  }
}

const cherry  = SymbolFactory.create('cherry', 0, 0);
const wild    = SymbolFactory.create('wild', 100, 0);
const random  = SymbolFactory.createRandom(200, 0);
```

**Tip:** Naya symbol type add karna ho toh sirf Factory mein add karo!

### 3. Object Pool Pattern
- Category: Creational
- gaming_company: Slot mein bahut particles, symbols hain — har baar `new` banana slow hai. Pool se reuse karo!
- Simple: Pool = objects pre-banao, use karo, wapas karo. Memory aur performance dono better.

```js
class ObjectPool {
  #pool = [];
  #active = new Set();
  #factory;
  #maxSize;

  constructor(factory, initialSize = 20, maxSize = 100) {
    this.#factory = factory;
    this.#maxSize = maxSize;

    for (let i = 0; i < initialSize; i++) {
      this.#pool.push(this.#factory());
    }
  }

  acquire() {
    let obj = this.#pool.pop();

    if (!obj && this.#active.size < this.#maxSize) {
      obj = this.#factory();
    }

    if (obj) {
      this.#active.add(obj);
      obj.onAcquire?.();
    }
    return obj;
  }

  release(obj) {
    if (!this.#active.has(obj)) return;
    this.#active.delete(obj);
    obj.onRelease?.();
    this.#pool.push(obj);
  }

  get activeCount() { return this.#active.size; }
  get poolSize()    { return this.#pool.length;  }
}

const coinPool = new ObjectPool(
  () => new CoinParticle(),
  50, 200
);

function emitCoins(x, y, count) {
  for (let i = 0; i < count; i++) {
    const coin = coinPool.acquire();
    coin.x = x; coin.y = y;
    coin.launch();
    setTimeout(() => coinPool.release(coin), 2000);
  }
}
```

**Tip:** gaming_company mein particles, symbols sab pool se aate hain — memory optimize!

### 4. MVC Pattern
- Category: Structural
- gaming_company: Game logic (Model), PixiJS display (View), Input handling (Controller) — sab alag rakho!
- Simple: MVC = Model (data), View (display), Controller (logic). Sab alag — easy to change!

```js
class SlotModel {
  #reelData = [];
  #balance = 1000;
  #bet = 10;
  #winAmount = 0;

  spin() {
    this.#reelData = this.#generateResults();
    this.#balance -= this.#bet;
    this.#winAmount = this.#calculateWin();
    this.#balance += this.#winAmount;
    return this.getState();
  }

  getState() {
    return {
      reels: this.#reelData,
      balance: this.#balance,
      win: this.#winAmount,
      bet: this.#bet
    };
  }

  #generateResults() { /* reel symbols */ }
  #calculateWin() { /* win logic */ }
}

class SlotView {
  constructor(app) {
    this.app = app;
    this.reelSprites = [];
    this.balanceText = new PIXI.Text('$1000');
  }

  updateBalance(amount) {
    this.balanceText.text = `$${amount}`;
  }

  showWin(amount) {
    this.winText.text = `WIN: $${amount}!`;
    this.playWinAnimation();
  }

  spinReels(results, onComplete) {
    this.animateReels(results, onComplete);
  }
}

class SlotController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupListeners();
  }

  setupListeners() {
    this.view.spinBtn.on('click', () => this.onSpin());
  }

  onSpin() {
    const state = this.model.spin();
    this.view.spinReels(state.reels, () => {
      this.view.updateBalance(state.balance);
      if (state.win > 0) this.view.showWin(state.win);
    });
  }
}

const model = new SlotModel();
const view  = new SlotView(app);
const ctrl  = new SlotController(model, view);
```

**Tip:** MVC se game logic aur display bilkul alag hoti hai — senior developers yahi dekhte hain!

### 5. MVVM Pattern
- Category: Structural
- gaming_company: ViewModel automatically View update karta hai — balance change hote hi UI change!
- Simple: MVVM = Model + ViewModel (reactive) + View. ViewModel data change pe auto View update karta hai.

```js
class GameModel {
  balance = 1000;
  bet = 10;
  lastWin = 0;
}

class GameViewModel {
  #model;
  #listeners = new Map();

  constructor(model) {
    this.#model = model;
  }

  get balance() { return this.#model.balance; }
  get bet()     { return this.#model.bet;     }
  get lastWin() { return this.#model.lastWin; }

  observe(property, callback) {
    if (!this.#listeners.has(property)) {
      this.#listeners.set(property, []);
    }
    this.#listeners.get(property).push(callback);
  }

  #notify(property) {
    this.#listeners.get(property)?.forEach(
      cb => cb(this.#model[property])
    );
  }

  placeBet(amount) {
    this.#model.bet = amount;
    this.#notify('bet');
  }

  updateBalance(amount) {
    this.#model.balance = amount;
    this.#notify('balance');
  }
}

class GameView {
  constructor(viewModel) {
    this.vm = viewModel;

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

vm.updateBalance(500);
```

**Tip:** MVVM modern pattern hai — React jaisa feel aata hai. gaming_company mein impress karoge!

### 6. Component Pattern
- Category: Structural
- gaming_company: ReelComponent, WinLineComponent, BalanceComponent — har cheez alag reusable component!
- Simple: Component = self-contained, reusable piece. Apna data + display + logic khud manage karta hai.

```js
class Component {
  constructor(container) {
    this.container = container;
    this.children = [];
  }

  addChild(component) {
    this.children.push(component);
    this.container.addChild(component.container);
  }

  update(delta) {
    this.children.forEach(c => c.update(delta));
  }

  destroy() {
    this.children.forEach(c => c.destroy());
    this.container.destroy();
  }
}

class BalanceComponent extends Component {
  #amount = 0;

  constructor(x, y) {
    super(new PIXI.Container());
    this.container.x = x;
    this.container.y = y;

    this.bg = new PIXI.Graphics();
    this.text = new PIXI.Text('$0');
    this.container.addChild(this.bg, this.text);
    this.render();
  }

  set amount(val) {
    this.#amount = val;
    this.render();
  }

  render() {
    this.bg.clear()
      .beginFill(0x000000, 0.7)
      .drawRoundedRect(0, 0, 200, 60, 10)
      .endFill();
    this.text.text = `Balance: $${this.#amount}`;
  }
}

class ReelComponent extends Component {
  constructor(id, x) {
    super(new PIXI.Container());
    this.id = id;
    this.container.x = x;
    this.symbols = [];
    this.spinning = false;
  }

  startSpin() { this.spinning = true; }
  stopSpin(result) {
    this.spinning = false;
    this.showResult(result);
  }

  update(delta) {
    if (this.spinning) this.scrollSymbols(delta);
    super.update(delta);
  }
}

const balance = new BalanceComponent(10, 10);
const reels = Array(5).fill(null)
  .map((_, i) => new ReelComponent(i, i * 160));

balance.amount = 1000;
```

**Tip:** Component pattern se har cheez independent hai — easy to test, easy to change!

### 7. State Machine Pattern
- Category: Behavioral
- gaming_company: IDLE → SPINNING → EVALUATING → WIN/LOSE → IDLE — slot game ka flow!
- Simple: State Machine = game kaun si state mein hai track karo. Invalid transitions rok do.

```js
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
    return this;
  }

  is(state) { return this.#current === state; }
}

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
```

**Tip:** State machine se invalid actions automatically block hote hain — clean code!

### 8. Event Bus Pattern
- Category: Behavioral
- gaming_company: Reel ne spin khatam kiya — EventBus se WinChecker, AudioManager, UIManager sab ko pata chala!
- Simple: Event Bus = central messaging. Koi bhi event emit karo, koi bhi sun sakta hai. Direct dependency nahi.

```js
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
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const unsub = this.on(event, (...args) => {
      callback(...args);
      unsub();
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

const EVENTS = {
  SPIN_START:    'spin:start',
  SPIN_COMPLETE: 'spin:complete',
  WIN:           'game:win',
  BALANCE_UPDATE:'ui:balance',
  SOUND_PLAY:    'audio:play',
};

class ReelManager {
  onAllReelsStopped(results) {
    bus.emit(EVENTS.SPIN_COMPLETE, { results });
  }
}

bus.on(EVENTS.SPIN_COMPLETE, ({ results }) => {
  const wins = checkWinLines(results);
  if (wins.length) bus.emit(EVENTS.WIN, { wins });
});

bus.on(EVENTS.WIN, ({ wins }) => {
  bus.emit(EVENTS.SOUND_PLAY, { sound: 'win' });
});

bus.on(EVENTS.BALANCE_UPDATE, ({ amount }) => {
  balanceText.text = `$${amount}`;
});
```

**Tip:** Event Bus se components directly connected nahi hain — easy to add/remove features!

### 9. Observer Pattern
- Category: Behavioral
- gaming_company: Balance change hua — sab UI elements automatically update ho gaye!
- Simple: Observer = subject apne observers ko notify karta hai jab data change ho. Event Bus ka smaller version.

```js
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
    observer(this.#value);
    return () => this.#observers.delete(observer);
  }

  #notify(newVal, oldVal) {
    this.#observers.forEach(obs => obs(newVal, oldVal));
  }
}

const balance  = new Observable(1000);
const winAmount = new Observable(0);
const isSpinning = new Observable(false);

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

balance.value = 900;
winAmount.value = 500;
isSpinning.value = true;
```

**Tip:** Observable + Observer = reactive programming. React hooks isi idea pe hain!

### 10. Strategy Pattern
- Category: Behavioral
- gaming_company: Win calculation strategy — Regular, Bonus, FreeSpins — same interface, alag logic!
- Simple: Strategy = algorithm ko swap karo runtime pe. Same interface, alag implementation.

```js
class WinStrategy {
  calculate(symbols, bet) {
    throw new Error('Implement calculate()!');
  }
}

class NormalWinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier;
    }, 0);
  }
}

class BonusWinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier * 3;
    }, 0);
  }
}

class FreeSpinStrategy extends WinStrategy {
  calculate(symbols, bet) {
    const lines = checkWinLines(symbols);
    return lines.reduce((total, line) => {
      return total + bet * line.multiplier * 5;
    }, 0);
  }
}

class GameRound {
  #strategy;

  constructor(strategy) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  calculateWin(symbols, bet) {
    return this.#strategy.calculate(symbols, bet);
  }
}

const round = new GameRound(new NormalWinStrategy());
round.calculateWin(symbols, 10);
round.setStrategy(new BonusWinStrategy());
round.calculateWin(symbols, 10);
round.setStrategy(new FreeSpinStrategy());
round.calculateWin(symbols, 10);
```

**Tip:** Bonus round shuru hua toh strategy swap karo — code change nahi hota!

### 11. Command Pattern
- Category: Behavioral
- gaming_company: Spin, Bet change, Auto-spin — sab commands hain. Undo/redo easy ho jaata hai!
- Simple: Command = action ko object mein wrap karo. Execute, undo, queue, log — sab possible!

```js
class Command {
  execute() { throw new Error('execute() implement!'); }
  undo()    { throw new Error('undo() implement!'); }
}

class PlaceBetCommand extends Command {
  #wallet; #amount; #previousBet;

  constructor(wallet, amount) {
    super();
    this.#wallet = wallet;
    this.#amount = amount;
  }

  execute() {
    this.#previousBet = this.#wallet.bet;
    this.#wallet.bet = this.#amount;
    console.log(`Bet placed: $${this.#amount}`);
  }

  undo() {
    this.#wallet.bet = this.#previousBet;
    console.log(`Bet restored: $${this.#previousBet}`);
  }
}

class SpinCommand extends Command {
  #game; #result;

  constructor(game) {
    super();
    this.#game = game;
  }

  execute() {
    this.#result = this.#game.spin();
    return this.#result;
  }

  undo() {
    this.#game.reverseLastSpin(this.#result);
  }
}

class CommandInvoker {
  #history = [];
  #redoStack = [];

  execute(command) {
    command.execute();
    this.#history.push(command);
    this.#redoStack = [];
  }

  undo() {
    const cmd = this.#history.pop();
    if (cmd) {
      cmd.undo();
      this.#redoStack.push(cmd);
    }
  }

  redo() {
    const cmd = this.#redoStack.pop();
    if (cmd) {
      cmd.execute();
      this.#history.push(cmd);
    }
  }
}

const invoker = new CommandInvoker();
invoker.execute(new PlaceBetCommand(wallet, 50));
invoker.execute(new SpinCommand(game));
invoker.undo();
```

**Tip:** Auto-spin feature mein commands queue hote hain — Command pattern perfect hai!

### 12. ECS — Entity Component System
- Category: Game Specific
- gaming_company: Modern game architecture — Unity bhi ECS use karta hai! Performance best hoti hai!
- Simple: ECS = Entity (ID only) + Component (data only) + System (logic only). Sab alag!

```js
class Entity {
  static #nextId = 0;
  id = Entity.#nextId++;
}

class PositionComponent {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
}

class VelocityComponent {
  constructor(vx = 0, vy = 0) { this.vx = vx; this.vy = vy; }
}

class RenderComponent {
  constructor(texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.visible = true;
  }
}

class SymbolComponent {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.highlighted = false;
  }
}

class World {
  #entities = new Map();
  #components = new Map();

  createEntity() {
    const entity = new Entity();
    this.#entities.set(entity.id, entity);
    return entity;
  }

  addComponent(entityId, component) {
    const type = component.constructor.name;
    if (!this.#components.has(type)) {
      this.#components.set(type, new Map());
    }
    this.#components.get(type).set(entityId, component);
  }

  getComponent(entityId, ComponentClass) {
    return this.#components
      .get(ComponentClass.name)
      ?.get(entityId);
  }

  query(...ComponentClasses) {
    const firstMap = this.#components
      .get(ComponentClasses[0].name);
    if (!firstMap) return [];

    return [...firstMap.keys()].filter(id =>
      ComponentClasses.every(C =>
        this.#components.get(C.name)?.has(id)
      )
    );
  }
}

class MovementSystem {
  update(world, delta) {
    const entities = world.query(
      PositionComponent, VelocityComponent
    );

    entities.forEach(id => {
      const pos = world.getComponent(id, PositionComponent);
      const vel = world.getComponent(id, VelocityComponent);
      pos.x += vel.vx * delta;
      pos.y += vel.vy * delta;
    });
  }
}

class RenderSystem {
  update(world) {
    const entities = world.query(
      PositionComponent, RenderComponent
    );
    entities.forEach(id => {
      const pos = world.getComponent(id, PositionComponent);
      const ren = world.getComponent(id, RenderComponent);
      ren.sprite.x = pos.x;
      ren.sprite.y = pos.y;
    });
  }
}

const world = new World();
const symbol = world.createEntity();

world.addComponent(symbol.id, new PositionComponent(100, 200));
world.addComponent(symbol.id, new VelocityComponent(0, 5));
world.addComponent(symbol.id, new RenderComponent(texture));
world.addComponent(symbol.id, new SymbolComponent('cherry', 5));

const systems = [new MovementSystem(), new RenderSystem()];
app.ticker.add(delta => systems.forEach(s => s.update(world, delta)));
```

**Tip:** ECS advanced hai — gaming_company mein yeh jaante ho toh senior level pe samjhenge!

### 13. Scene Manager
- Category: Game Specific
- gaming_company: LoadingScene → MenuScene → GameScene → WinScene — scenes manage karna!
- Simple: Scene Manager = alag alag game screens manage karo. Ek baar ek scene active.

```js
class Scene {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
  }

  onEnter(data) {}
  onExit()  {}
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

sm.goto('loading');
```

**Tip:** Scene Manager se loading, menu, game sab cleanly manage hota hai!

### 14. Asset Manager
- Category: Game Specific
- gaming_company: Textures, sounds, fonts — sab ek jagah se manage karo. Cache bhi ho!
- Simple: Asset Manager = sabhi game resources load, cache, aur provide karo. Singleton pattern use karta hai.

```js
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
    if (this.#cache.has(key)) {
      return this.#cache.get(key);
    }

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

const assets = AssetManager.getInstance();

await assets.loadBundle({
  cherry:  'symbols/cherry.png',
  seven:   'symbols/seven.png',
  winSfx:  'audio/win.mp3',
  config:  'data/paytable.json',
}, (progress) => {
  loadingBar.value = progress * 100;
});

const cherry = assets.get('cherry');
```

**Tip:** Asset Manager se game ek baar load karta hai — speed best hoti hai!

### 15. Full gaming_company Game Architecture
- Category: gaming_company Level
- gaming_company: Yeh sab patterns ek saath — real gaming_company level slot game structure!
- Simple: Sab patterns combine karo — yahi production level game architecture hai!

```js
// gaming_company PRODUCTION ARCHITECTURE
// ================================

// 1. SINGLETON — Global managers
const eventBus    = EventBus.getInstance();
const assetMgr    = AssetManager.getInstance();
const sceneMgr    = SceneManager.getInstance(app);

// 2. FACTORY — Symbol creation
const symbol = SymbolFactory.create('cherry', 0, 0);

// 3. OBJECT POOL — Performance
const particlePool = new ObjectPool(
  () => new Particle(), 100
);

// 4. STATE MACHINE — Game flow
const gameState = new StateMachine();
gameState
  .on('SPINNING', startReels)
  .on('WIN',      showWinScreen)
  .on('IDLE',     enableSpinButton);

// 5. EVENT BUS — Decoupled comms
eventBus.on('reel:stopped', onReelStopped);
eventBus.on('win:calculated', onWinResult);
eventBus.on('balance:changed', updateBalanceUI);

// 6. MVVM — Reactive UI
const vm = new GameViewModel(new GameModel());
vm.observe('balance', val => balanceUI.update(val));
vm.observe('bet',     val => betUI.update(val));

// 7. STRATEGY — Win calculation
const strategies = {
  normal:    new NormalWinStrategy(),
  bonus:     new BonusWinStrategy(),
  freeSpin:  new FreeSpinStrategy(),
};
let currentStrategy = strategies.normal;

// 8. COMMAND — Actions with history
const invoker = new CommandInvoker();

// 9. OBSERVER — Reactive data
const balance = new Observable(1000);
balance.subscribe(v => vm.updateBalance(v));

// 10. COMPONENTS — UI pieces
const reelComponents = Array(5).fill(null)
  .map((_, i) => new ReelComponent(i, i*160));

// GAME LOOP — ties it all together
app.ticker.add((delta) => {
  reelComponents.forEach(r => r.update(delta));
  particlePool.update(delta);
});

// SPIN FLOW:
// SpinBtn click
//   → Command pattern (SpinCommand.execute)
//   → StateMachine.transition('SPINNING')
//   → EventBus.emit('spin:start')
//   → ReelComponents start spinning
//   → All reels stop → EventBus.emit('reel:stopped')
//   → WinStrategy.calculate(results, bet)
//   → balance.value += winAmount (Observable)
//   → StateMachine.transition('WIN' or 'IDLE')
//   → SceneManager shows win screen if big win

console.log('gaming_company Level Architecture Ready!');
```

**Tip:** Yeh pattern jaano aur Day 1 se senior developer ki tarah baat karo!

---

## 2. OOP Concepts in JavaScript for Game Development

### 1. Class & Object
- Tag: Basic
- Game: Har game element ek object hota hai — Symbol, Reel, Button sab class se bante hain!
- Simple: Class = blueprint. Object = us blueprint se bana real item.

```js
class Symbol {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.x = 0;
    this.y = 0;
  }

  display() {
    console.log(`${this.name} at (${this.x}, ${this.y})`);
  }
}

const cherry = new Symbol('cherry', 5);
const seven  = new Symbol('seven', 100);
const wild   = new Symbol('wild', 0);

cherry.x = 100;
cherry.display();
seven.display();

console.log(cherry === seven); // false
```

**Tip:** gaming_company mein har slot symbol ek Symbol object hoga!

### 2. Constructor
- Tag: Basic
- Game: Game shuru hone pe objects initialize karne ke liye constructor use hota hai!
- Simple: Constructor = class ka pehla method jo object banate waqt automatically chalta hai.

```js
class Reel {
  constructor(id, symbolCount, speed) {
    this.id = id;
    this.symbolCount = symbolCount;
    this.speed = speed;
    this.isSpinning = false;
    this.symbols = [];
    this.currentPosition = 0;

    this.initialize();
  }

  initialize() {
    console.log(`Reel ${this.id} ready!`);
    for (let i = 0; i < this.symbolCount; i++) {
      this.symbols.push(getRandomSymbol());
    }
  }
}

const reel1 = new Reel(1, 20, 50);
const reel2 = new Reel(2, 20, 60);
const reel3 = new Reel(3, 20, 55);

console.log(reel1.id);    // 1
console.log(reel2.speed); // 60
```

**Tip:** Default values constructor mein set karo — baad mein change kar sakte ho!

### 3. Inheritance (extends)
- Tag: Important
- Game: BaseGame class banao — SlotGame aur PokerGame usse inherit karein!
- Simple: Inheritance = child class parent ki sab properties aur methods le leti hai. Code reuse hota hai!

```js
class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.alpha = 1;
  }

  show() { this.visible = true; }
  hide() { this.visible = false; }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Symbol extends GameObject {
  constructor(x, y, name, value) {
    super(x, y);
    this.name = name;
    this.value = value;
  }

  highlight() {
    this.alpha = 0.5;
  }
}

class Button extends GameObject {
  constructor(x, y, label) {
    super(x, y);
    this.label = label;
    this.enabled = true;
  }

  click() {
    if (this.enabled) {
      console.log(`${this.label} clicked!`);
    }
  }
}

const cherry = new Symbol(100, 200, 'cherry', 5);
cherry.moveTo(150, 200);
cherry.highlight();

const spinBtn = new Button(400, 500, 'SPIN');
spinBtn.click();
```

**Tip:** `extends` keyword se inheritance hoti hai — `super()` parent constructor call karta hai!

### 4. Encapsulation (private)
- Tag: Important
- Game: Game balance private rakhna chahiye — koi bhi seedha change na kar sake!
- Simple: Encapsulation = data chhupaao aur sirf methods se access do. `#` se private variable banta hai.

```js
class GameBalance {
  #balance = 0;
  #betAmount = 1;
  #history = [];

  constructor(startBalance) {
    this.#balance = startBalance;
  }

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
    return [...this.#history];
  }
}

const wallet = new GameBalance(1000);

wallet.placeBet(50);
console.log(wallet.getBalance()); // 950
```

**Tip:** `#` private field JS mein — balance hack proof ho jaata hai!

### 5. Polymorphism
- Tag: Advanced
- Game: Alag alag symbols ka win calculation alag hota hai — same method, alag behavior!
- Simple: Polymorphism = same method naam, alag alag behavior. Har class apna implementation deti hai.

```js
class BaseSymbol {
  constructor(name) {
    this.name = name;
  }

  calculateWin(bet, matchCount) {
    return 0;
  }

  toString() {
    return this.name;
  }
}

class RegularSymbol extends BaseSymbol {
  constructor(name, multipliers) {
    super(name);
    this.multipliers = multipliers;
  }

  calculateWin(bet, matchCount) {
    return bet * this.multipliers[matchCount];
  }
}

class WildSymbol extends BaseSymbol {
  constructor() {
    super('WILD');
  }

  calculateWin(bet, matchCount) {
    return bet * matchCount * 2;
  }
}

class ScatterSymbol extends BaseSymbol {
  constructor() {
    super('SCATTER');
  }

  calculateWin(bet, matchCount) {
    if (matchCount >= 3) return bet * 10;
    return 0;
  }
}

const symbols = [
  new RegularSymbol('cherry', [0,0,5,20,100]),
  new WildSymbol(),
  new ScatterSymbol()
];

symbols.forEach(sym => {
  console.log(sym.calculateWin(10, 3));
});
```

**Tip:** gaming_company mein har symbol type ka win calculation alag hoga — yahi polymorphism hai!

### 6. Static Methods & Properties
- Tag: Important
- Game: Game config, constants, utility functions — sab static hote hain!
- Simple: Static = object banaye bina directly class se call kar sakte hain. Shared data ke liye.

```js
class GameConfig {
  static MIN_BET = 1;
  static MAX_BET = 100;
  static REELS = 5;
  static ROWS = 3;
  static RTP = 96.5;

  static isValidBet(amount) {
    return amount >= this.MIN_BET &&
           amount <= this.MAX_BET;
  }

  static formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }
}

class MathUtils {
  static randomInt(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    );
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, t) {
    return start + (end - start) * t;
  }
}

console.log(GameConfig.REELS);    // 5
console.log(GameConfig.isValidBet(50)); // true
console.log(GameConfig.isValidBet(500)); // false
console.log(GameConfig.formatCurrency(95.5)); // $95.50

const rand = MathUtils.randomInt(1, 10);
const clamped = MathUtils.clamp(150, 0, 100);
```

**Tip:** Constants aur utility functions ko hamesha static banao!

### 7. Method Override
- Tag: Advanced
- Game: Parent ka method override karke apna behavior add karo — `super()` se parent bhi chala sakte ho!
- Simple: Override = child class mein parent ka same method naam use karo — apna logic daalo.

```js
class BaseAnimation {
  constructor(target) {
    this.target = target;
    this.duration = 1;
    this.elapsed = 0;
  }

  update(delta) {
    this.elapsed += delta / 60;
    console.log('Base update running');
  }

  isComplete() {
    return this.elapsed >= this.duration;
  }
}

class WinAnimation extends BaseAnimation {
  constructor(target, winAmount) {
    super(target);
    this.winAmount = winAmount;
    this.duration = 2;
    this.scale = 1;
  }

  update(delta) {
    super.update(delta);

    const progress = this.elapsed / this.duration;
    this.scale = 1 + Math.sin(progress * Math.PI) * 0.3;
    this.target.scale.set(this.scale);
  }
}

class SpinAnimation extends BaseAnimation {
  constructor(target) {
    super(target);
    this.rotation = 0;
  }

  update(delta) {
    super.update(delta);
    this.rotation += 0.1 * delta;
    this.target.rotation = this.rotation;
  }
}

const winAnim = new WinAnimation(symbol, 500);
const spinAnim = new SpinAnimation(reel);

winAnim.update(1);
spinAnim.update(1);
```

**Tip:** `super.update()` parent ko bhi chala — phir apna logic add karo!

### 8. Abstract Pattern
- Tag: Advanced
- Game: Base game class banao jise extend karna zaroori ho — direct use nahi ho!
- Simple: JS mein abstract class nahi hai — but pattern se implement kar sakte hain. Error throw karo!

```js
class AbstractGame {
  constructor(config) {
    if (new.target === AbstractGame) {
      throw new Error(
        'AbstractGame directly use nahi kar sakte!'
      );
    }
    this.config = config;
    this.isRunning = false;
  }

  initialize() {
    throw new Error('initialize() implement karo!');
  }

  onSpin() {
    throw new Error('onSpin() implement karo!');
  }

  calculateWin() {
    throw new Error('calculateWin() implement karo!');
  }

  start() {
    this.initialize();
    this.isRunning = true;
    console.log('Game started!');
  }

  stop() {
    this.isRunning = false;
  }
}

class SlotGame extends AbstractGame {
  constructor(config) {
    super(config);
    this.reels = [];
  }

  initialize() {
    this.reels = Array(5).fill(null).map(
      (_, i) => new Reel(i)
    );
    console.log('Slot game initialized!');
  }

  onSpin() {
    this.reels.forEach(r => r.startSpin());
  }

  calculateWin() {
    return checkWinLines(this.reels);
  }
}

const game = new SlotGame({ bet: 10 });
game.start();
```

**Tip:** `new.target` check karo — abstract pattern implement karne ka best tarika!

### 9. Getter & Setter
- Tag: Important
- Game: Balance update hone pe automatically UI update ho — getter/setter se possible!
- Simple: Getter = property read karne pe auto function chale. Setter = property set karne pe auto function.

```js
class PlayerWallet {
  #_balance = 0;
  #_bet = 1;

  constructor(balance) {
    this.#_balance = balance;
  }

  get balance() {
    return this.#_balance;
  }

  set balance(value) {
    if (value < 0) {
      console.error('Balance negative nahi ho sakta!');
      return;
    }
    this.#_balance = value;
    this.updateUI();
  }

  get bet() {
    return this.#_bet;
  }

  set bet(value) {
    if (value < 1) value = 1;
    if (value > this.#_balance) {
      value = this.#_balance;
    }
    this.#_bet = value;
    console.log(`Bet set to: ${value}`);
  }

  get canSpin() {
    return this.#_balance >= this.#_bet;
  }

  updateUI() {
    balanceText.text = `Balance: $${this.#_balance}`;
  }
}

const wallet = new PlayerWallet(1000);

console.log(wallet.balance);
wallet.balance = 500;
wallet.balance = -100;
wallet.bet = 50;

console.log(wallet.canSpin);
```

**Tip:** Getter/Setter se property change pe auto kaam hota hai — UI sync easy!

### 10. Complete Game Example
- Tag: gaming_company Level
- Game: Sab concepts ek saath — real gaming_company level slot game structure!
- Simple: Yeh pattern gaming_company mein exactly use hoga — isko samjho aur yaad rakho!

```js
class GameObject {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.visible = true;
  }
  show() { this.visible = true; }
  hide() { this.visible = false; }
}

class Symbol extends GameObject {
  static TYPES = {
    CHERRY: { name:'cherry', vals:[0,0,5,20,100] },
    SEVEN:  { name:'seven',  vals:[0,0,50,200,1000] },
    WILD:   { name:'wild',   vals:[0,0,0,0,0] }
  };

  #_highlighted = false;

  constructor(x, y, type) {
    super(x, y);
    this.type = type;
    this.name = type.name;
  }

  get highlighted() {
    return this.#_highlighted;
  }

  set highlighted(val) {
    this.#_highlighted = val;
    this.alpha = val ? 1 : 0.3;
  }

  calculateWin(bet, count) {
    return bet * this.type.vals[count];
  }
}

class WildSymbol extends Symbol {
  constructor(x, y) {
    super(x, y, Symbol.TYPES.WILD);
  }

  calculateWin(bet, count) {
    return bet * count * 3;
  }
}

class Reel extends GameObject {
  #symbols = [];
  #isSpinning = false;

  constructor(id, x) {
    super(x, 0);
    this.id = id;
    this.speed = 0;
  }

  get isSpinning() { return this.#isSpinning; }

  startSpin() {
    this.#isSpinning = true;
    this.speed = 50;
  }

  stopSpin() {
    this.#isSpinning = false;
    this.speed = 0;
  }

  update(delta) {
    if (!this.#isSpinning) return;
  }
}

const reels = Array(5).fill(null)
  .map((_, i) => new Reel(i, i * 150));

const wild = new WildSymbol(0, 0);
console.log(wild.calculateWin(10, 3));
wild.highlighted = true;
```

**Tip:** Yeh gaming_company ka real pattern hai — practice karo aur Day 1 se impress karo!

---

## 3. PixiJS Advanced Learning Guide for gaming_company

### 1. Sprite Pool & Memory Management
- Level: Medium
- gaming_company: Slot games mein bahut sprites hoti hain — memory optimize karna zaroori hai!
- Concept: Sprites baar baar create/destroy karna slow hota hai. Pool mein pre-create karo aur reuse karo.

```js
class SpritePool {
  constructor(texture, size = 20) {
    this.pool = [];
    for (let i = 0; i < size; i++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.visible = false;
      this.pool.push(sprite);
    }
  }

  get() {
    const sprite = this.pool.find(s => !s.visible);
    if (sprite) {
      sprite.visible = true;
      return sprite;
    }
    return null;
  }

  release(sprite) {
    sprite.visible = false;
    sprite.x = 0;
    sprite.y = 0;
  }
}

const pool = new SpritePool(texture, 50);
const coin = pool.get();
pool.release(coin);
```

**Tip:** Slot games mein har symbol ek pool se aata hai — yahi gaming_company mein hoga!

### 2. Slot Reel Logic
- Level: Advanced
- gaming_company: gaming_company ka core kaam — slot reels banana aur spin karna!
- Concept: Reel = vertical strip of symbols. Spin = symbols upar se neeche scroll karte hain, phir stop hote hain.

```js
class Reel {
  constructor(app, symbols, x) {
    this.container = new PIXI.Container();
    this.container.x = x;
    this.symbols = [];
    this.position = 0;
    this.speed = 0;
    this.isSpinning = false;

    for (let i = 0; i < 5; i++) {
      const symbol = new PIXI.Sprite(
        getRandomTexture(symbols)
      );
      symbol.y = i * 150;
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }

    app.stage.addChild(this.container);
  }

  startSpin() {
    this.isSpinning = true;
    this.speed = 50;
  }

  update() {
    if (!this.isSpinning) return;

    this.position += this.speed;

    this.symbols.forEach((symbol, i) => {
      symbol.y = (
        (this.position + i * 150) % (5 * 150)
      );
    });
  }

  stopAt(targetSymbol) {
    this.isSpinning = false;
  }
}
```

**Tip:** Har reel independent hoti hai — gaming_company mein 5 reels hogi usually!

### 3. Ticker & Game Loop
- Level: Easy
- gaming_company: Har game ka heartbeat — gaming_company mein sab kuch Ticker se chalta hai!
- Concept: PixiJS Ticker har frame callback call karta hai — yahan game state update hoti hai.

```js
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e
});

app.ticker.add((delta) => {
  reels.forEach(reel => reel.update(delta));
  animationManager.update(delta);
  particleSystem.update(delta);
});

app.ticker.maxFPS = 60;
app.ticker.stop();
app.ticker.start();
app.ticker.speed = 0.5;
```

**Tip:** Delta time use karo — different devices pe same speed milega!

### 4. Tween Animations
- Level: Medium
- gaming_company: Win animations, symbol effects — sab tween se hota hai!
- Concept: Tween = smooth transition between two values. GSAP ya custom tween use hota hai.

```js
class Tween {
  constructor(target, props, duration, easing) {
    this.target = target;
    this.startProps = {};
    this.endProps = props;
    this.duration = duration;
    this.elapsed = 0;
    this.easing = easing || this.easeOut;
    this.done = false;

    Object.keys(props).forEach(key => {
      this.startProps[key] = target[key];
    });
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  update(delta) {
    if (this.done) return;
    this.elapsed += delta / 60;

    const progress = Math.min(
      this.elapsed / this.duration, 1
    );
    const eased = this.easing(progress);

    Object.keys(this.endProps).forEach(key => {
      const start = this.startProps[key];
      const end = this.endProps[key];
      this.target[key] = start + (end - start) * eased;
    });

    if (progress >= 1) this.done = true;
  }
}

const tween = new Tween(
  symbol,
  { y: symbol.y - 30, alpha: 0 },
  0.5
);
```

**Tip:** Win animation mein symbols bounce karte hain — yahi tween se hota hai!

### 5. Asset Loader
- Level: Easy
- gaming_company: Game start hone se pehle sab assets load karna zaroori hai!
- Concept: `PIXI.Assets` se textures, sounds, fonts preload karo — tabhi game smooth chalta hai.

```js
async function loadGameAssets() {
  await PIXI.Assets.init({
    manifest: {
      bundles: [
        {
          name: 'slot-symbols',
          assets: [
            { alias: 'cherry', src: 'cherry.png' },
            { alias: 'seven', src: 'seven.png' },
            { alias: 'bar', src: 'bar.png' },
            { alias: 'wild', src: 'wild.png' },
          ]
        },
        {
          name: 'ui',
          assets: [
            { alias: 'button', src: 'button.png' },
            { alias: 'frame', src: 'frame.png' },
          ]
        }
      ]
    }
  });

  const loadingBar = ...;
  const loadingText = ...;

  await PIXI.Assets.loadBundle(
    'slot-symbols',
    (progress) => {
      loadingBar.width = progress * 400;
      loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
    }
  );

  const cherry = PIXI.Texture.from('cherry');
}
```

**Tip:** Loading screen gaming_company ke har game mein hoti hai — progress bar zaroor dikhao!

### 6. Win Line Logic
- Level: Advanced
- gaming_company: Slot game ka core — kaunsi line win hui yeh calculate karna!
- Concept: Win lines = patterns on the grid. Check karo ki matching symbols kahan hain.

```js
const WIN_LINES = [
  [0,0, 1,0, 2,0, 3,0, 4,0],
  [0,1, 1,1, 2,1, 3,1, 4,1],
  [0,2, 1,2, 2,2, 3,2, 4,2],
  [0,0, 1,1, 2,2, 3,1, 4,0],
  [0,2, 1,1, 2,0, 3,1, 4,2],
];

function checkWins(grid, betPerLine) {
  const wins = [];

  WIN_LINES.forEach((line, lineIndex) => {
    const symbols = [];

    for (let i = 0; i < 5; i++) {
      const reel = line[i * 2];
      const row = line[i * 2 + 1];
      symbols.push(grid[reel][row]);
    }

    const firstSymbol = symbols[0];
    let matchCount = 1;

    for (let i = 1; i < 5; i++) {
      if (symbols[i] === firstSymbol ||
          symbols[i] === 'WILD') {
        matchCount++;
      } else break;
    }

    if (matchCount >= 3) {
      const multiplier = getMultiplier(
        firstSymbol, matchCount
      );
      wins.push({
        lineIndex,
        symbol: firstSymbol,
        count: matchCount,
        payout: betPerLine * multiplier
      });
    }
  });

  return wins;
}
```

**Tip:** WILD symbol sab ko replace karta hai — yeh logic zaroori hai!

### 7. State Machine
- Level: Medium
- gaming_company: Game ka flow control — IDLE, SPIN, WIN, BONUS states!
- Concept: State machine = game ki current state track karo. Ek state se doosri state mein transition.

```js
const STATES = {
  IDLE: 'IDLE',
  SPINNING: 'SPINNING',
  STOPPING: 'STOPPING',
  WIN: 'WIN',
  BONUS: 'BONUS',
  FREE_SPIN: 'FREE_SPIN'
};

class GameStateMachine {
  constructor() {
    this.state = STATES.IDLE;
    this.listeners = {};
  }

  transition(newState) {
    const oldState = this.state;
    this.state = newState;

    console.log(`${oldState} → ${newState}`);
    this.emit(newState, oldState);
  }

  is(state) {
    return this.state === state;
  }

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

const game = new GameStateMachine();

game.on(STATES.WIN, () => {
  showWinAnimation();
  updateBalance();
});

spinBtn.on('click', () => {
  if (game.is(STATES.IDLE)) {
    game.transition(STATES.SPINNING);
    startAllReels();
  }
});
```

**Tip:** gaming_company ke games mein yahi pattern hoga — pehle yeh samjho!

### 8. Particle Effects
- Level: Medium
- gaming_company: Win pe coins girte hain, confetti — sab particles se hota hai!
- Concept: Particles = bahut saare chhote sprites jo physics follow karte hain.

```js
class ParticleSystem {
  constructor(app, texture) {
    this.app = app;
    this.texture = texture;
    this.particles = [];
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);
  }

  emit(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Sprite(this.texture);
      particle.x = x;
      particle.y = y;
      particle.scale.set(Math.random() * 0.5 + 0.3);
      particle.vx = (Math.random() - 0.5) * 10;
      particle.vy = (Math.random() - 1) * 15;
      particle.gravity = 0.5;
      particle.life = 1.0;
      particle.decay = Math.random() * 0.02 + 0.01;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += p.gravity * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.life -= p.decay * delta;
      p.alpha = p.life;

      if (p.life <= 0) {
        this.container.removeChild(p);
        this.particles.splice(i, 1);
      }
    }
  }
}

const coins = new ParticleSystem(app, coinTexture);
coins.emit(640, 360, 50);
```

**Tip:** Big Win pe zyada particles — Small Win pe kam!
