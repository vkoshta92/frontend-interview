# 🚀 4 Saal Ka Complete Roadmap — Job Ready Guide (Hinglish)
> Junior se Lead tak — PixiJS Slot Game Developer

---

# 📅 YEAR 1 — Foundation (Junior)

---

## Y1.1 — JavaScript Core

### Variables & Scope
```js
// VAR — avoid karo!
var x = 10; // Function scoped, hoisted

// LET — use karo
let score = 0; // Block scoped, reassignable

// CONST — best practice
const MAX_REELS = 5; // Never changes

// Scope example:
function game() {
  let balance = 1000;
  if (true) {
    let bet = 10;
    console.log(balance); // ✅ Works
  }
  // console.log(bet); // ❌ Error!
}
```

### Functions
```js
// Regular function
function calculateWin(bet, multiplier) {
  return bet * multiplier;
}

// Arrow function
const calculateWin = (bet, mult) => bet * mult;

// Default parameters
function spin(bet = 10, lines = 20) {
  return bet * lines;
}

// Rest parameters
function logWins(...amounts) {
  return amounts.reduce((sum, a) => sum + a, 0);
}
logWins(10, 20, 50, 100); // 180
```

### Array Methods
```js
const symbols = ['🍒', '💎', '🃏', '🍋', '⭐'];

// MAP — transform karo
const doubled = symbols.map((s, i) => `${i}: ${s}`);

// FILTER — select karo
const specials = symbols.filter(s => s === '🃏' || s === '⭐');

// REDUCE — combine karo
const values = [10, 50, 100, 5, 20];
const total  = values.reduce((sum, v) => sum + v, 0); // 185

// FIND — pehla match
const wild = symbols.find(s => s === '🃏');

// INCLUDES — check karo
const hasWild = symbols.includes('🃏'); // true

// Chaining
const bigWins = [10, 5, 200, 50, 300]
  .filter(v => v >= 100)   // [200, 300]
  .map(v => v * 2)         // [400, 600]
  .reduce((s, v) => s + v, 0); // 1000
```

### Objects & Destructuring
```js
const player = {
  name:    'Vishnu',
  balance: 1000,
  bet:     10,
  spin() { this.balance -= this.bet; }
};

// Destructuring
const { name, balance, bet } = player;

// Rename
const { balance: coins } = player;

// Default value
const { bonus = 0 } = player;

// Spread
const newPlayer = { ...player, balance: 2000 };
```

### Async/Await
```js
async function doSpin() {
  try {
    const result = await serverAPI.spin({ bet: 10 });
    await animateReels(result.symbols);
    await showWins(result.wins);
    updateBalance(result.newBalance);
  } catch(err) {
    console.error('Spin failed:', err);
    showError();
  } finally {
    spinButton.enable(); // HAMESHA enable karo!
  }
}

// Parallel execution
async function spinAllReels() {
  // ❌ Sequential — slow (5 sec)
  for (const reel of reels) await reel.stop();

  // ✅ Parallel — fast (1 sec)
  await Promise.all(reels.map(r => r.stop()));
}
```

### Closures
```js
// Inner function outer variables access karta hai
function createSpinTracker() {
  let totalSpins = 0;
  let totalWin   = 0;

  return {
    onSpin(win) {
      totalSpins++;
      totalWin += win;
    },
    getStats() {
      return { spins: totalSpins, win: totalWin };
    }
  };
}

const tracker = createSpinTracker();
tracker.onSpin(50);
tracker.onSpin(100);
console.log(tracker.getStats()); // {spins:2, win:150}
```

---

## Y1.2 — PixiJS Basics

### Setup
```js
const app = new PIXI.Application({
  width:           800,
  height:          600,
  backgroundColor: 0x1a1a2e,
  resolution:      window.devicePixelRatio || 1,
  antialias:       true,
});
document.body.appendChild(app.view);

await PIXI.Assets.load('symbols.json');
```

### Sprites
```js
const cherry = PIXI.Sprite.from('cherry.png');
cherry.x      = 100;
cherry.y      = 200;
cherry.width  = 80;
cherry.height = 80;
cherry.anchor.set(0.5); // Center pe
cherry.alpha  = 1;       // 0=invisible, 1=visible
app.stage.addChild(cherry);
```

### Container (Scene Graph)
```js
// Container = group of sprites
const reelContainer = new PIXI.Container();
reelContainer.x = 100;
reelContainer.y = 50;

reelContainer.addChild(symbol1);
reelContainer.addChild(symbol2);

// Parent move = sab children move!
reelContainer.x = 200;

app.stage.addChild(reelContainer);
```

### Graphics
```js
const g = new PIXI.Graphics();

// Rectangle
g.beginFill(0xFF0000);
g.drawRect(0, 0, 100, 50);
g.endFill();

// Circle
g.beginFill(0x00FF00);
g.drawCircle(50, 50, 30);
g.endFill();

// Line
g.lineStyle(3, 0xFFD700, 1);
g.moveTo(0, 0);
g.lineTo(400, 0);

app.stage.addChild(g);
```

### Text
```js
const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize:   36,
  fill:       0xFFD700,
  fontWeight: 'bold',
});

const balanceText = new PIXI.Text('Balance: 1000', style);
app.stage.addChild(balanceText);

// Update
balanceText.text = `Balance: ${newBalance}`;
```

### Game Loop
```js
app.ticker.add((delta) => {
  // ❌ Wrong — frame rate dependent
  sprite.x += 5;

  // ✅ Correct — delta time
  sprite.x += 5 * delta;
});
```

---

## Y1.3 — Basic Reel

```js
const REEL_W   = 100;
const REEL_H   = 300;
const SYMBOL_H = 100;
const ROWS     = 3;

class SimpleReel {
  constructor(col, x) {
    this.col      = col;
    this.symbols  = [];
    this.spinning = false;
    this.speed    = 0;

    this.container = new PIXI.Container();
    this.container.x = x;

    // Mask — COMPULSORY!
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, REEL_W, REEL_H);
    mask.endFill();
    this.container.mask = mask;
    this.container.addChild(mask);

    this.createSymbols();
  }

  createSymbols() {
    const all = ['🍒','💎','7️⃣','🍋','⭐','🔔'];
    for (let r = 0; r < ROWS + 1; r++) {
      const text = new PIXI.Text(
        all[Math.floor(Math.random() * all.length)],
        { fontSize: 60 }
      );
      text.y = r * SYMBOL_H;
      this.container.addChild(text);
      this.symbols.push(text);
    }
  }

  async spin(targetSymbols) {
    this.spinning = true;

    // Phase 1: Speed up
    await gsap.to(this, { speed: 30, duration: 0.3, ease: 'power2.in' });

    // Phase 2: Minimum time
    await new Promise(r => setTimeout(r, 1000));

    // Phase 3: Stop
    await gsap.to(this, { speed: 0, duration: 0.5, ease: 'back.out' });

    this.updateSymbols(targetSymbols);
    this.spinning = false;
  }

  updateSymbols(targets) {
    targets.forEach((sym, r) => {
      this.symbols[r].text = sym;
    });
  }
}
```

---

# 📅 YEAR 2 — Intermediate (Mid Level)

---

## Y2.1 — OOPs Deep Dive

### Classes & Inheritance
```js
// Parent class
class Symbol {
  constructor(name, value) {
    this.name   = name;
    this.value  = value;
    this.sprite = null;
  }

  createSprite() {
    this.sprite = PIXI.Sprite.from(`${this.name}.png`);
    return this.sprite;
  }

  getValue() { return this.value; }
}

// Child class
class WildSymbol extends Symbol {
  constructor() {
    super('wild', 0);
    this.expandable = true;
  }

  getValue(lineLength) {
    return super.getValue() + lineLength * 10;
  }

  async expand() {
    await gsap.to(this.sprite, {
      height: 300, y: 0,
      duration: 0.4, ease: 'back.out'
    });
  }
}

class ScatterSymbol extends Symbol {
  constructor() {
    super('scatter', 0);
  }

  getFreeSpins(count) {
    const table = { 3: 10, 4: 15, 5: 20 };
    return table[count] || 0;
  }
}
```

### Design Patterns
```js
// 1. SINGLETON — ek hi instance
class SoundManager {
  static #instance = null;

  static getInstance() {
    if (!SoundManager.#instance) {
      SoundManager.#instance = new SoundManager();
    }
    return SoundManager.#instance;
  }

  play(sound) { this.sfx.play(sound); }
}

const sound = SoundManager.getInstance();

// 2. OBSERVER — Event system
class EventBus {
  constructor() { this.events = {}; }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(fn);
  }

  emit(event, data) {
    this.events[event]?.forEach(fn => fn(data));
  }

  off(event, fn) {
    this.events[event] = this.events[event]?.filter(f => f !== fn);
  }
}

const bus = new EventBus();
bus.on('win', data => showWinEffect(data));
bus.on('win', data => updateBalance(data));
bus.emit('win', { amount: 500 });

// 3. FACTORY
class SymbolFactory {
  static create(type) {
    switch(type) {
      case 'WILD':    return new WildSymbol();
      case 'SCATTER': return new ScatterSymbol();
      default:        return new Symbol(type, VALUES[type]);
    }
  }
}

// 4. OBJECT POOL
class Pool {
  constructor(factory, size = 50) {
    this.available = Array.from({ length: size }, factory);
    this.inUse     = new Set();
  }

  acquire() {
    const obj = this.available.pop() || this.factory();
    this.inUse.add(obj);
    obj.visible = true;
    return obj;
  }

  release(obj) {
    obj.visible = false;
    obj.alpha   = 1;
    obj.scale.set(1);
    obj.filters = null;
    obj.parent?.removeChild(obj);
    this.inUse.delete(obj);
    this.available.push(obj);
  }
}
```

---

## Y2.2 — All Slot Features

### State Machine (FSM)
```js
class SlotFSM {
  constructor() {
    this.state = 'IDLE';
    this.map   = {
      IDLE:          ['SPINNING'],
      SPINNING:      ['EVALUATING'],
      EVALUATING:    ['WIN_PRESENT','FREE_INTRO','BONUS','IDLE'],
      WIN_PRESENT:   ['IDLE','FREE_INTRO'],
      FREE_INTRO:    ['FREE_SPINNING'],
      FREE_SPINNING: ['EVALUATING'],
      FREE_OUTRO:    ['IDLE'],
      BONUS:         ['IDLE'],
    };
  }

  go(next) {
    if (!this.map[this.state]?.includes(next)) {
      console.error(`Invalid: ${this.state} → ${next}`);
      return false;
    }
    this.state = next;
    return true;
  }

  canSpin()      { return this.state === 'IDLE'; }
  canChangeBet() { return this.state === 'IDLE'; }
}
```

### Expanding Wild
```js
async function expandWild(col, wildRow) {
  const sprite = reels[col].symbols[wildRow];

  await gsap.to(sprite, {
    y: 0, height: REEL_H,
    duration: 0.4, ease: 'back.out(1.2)'
  });

  // Glow filter
  sprite.filters = [new GlowFilter({ color: 0xFF6600, outerStrength: 4 })];

  // Matrix update — poori column wild
  for (let r = 0; r < ROWS; r++) {
    symbolMatrix[col][r] = 'WILD';
  }
}
```

### Sticky Wild
```js
const stickyMatrix = Array(5).fill(null).map(() => Array(3).fill(false));

function applySticky(serverResult) {
  for (let c = 0; c < 5; c++)
    for (let r = 0; r < 3; r++)
      if (stickyMatrix[c][r]) serverResult[c][r] = 'WILD';
  return serverResult;
}

function onWildLand(col, row) {
  if (isFreeSpins) {
    stickyMatrix[col][row] = true;
    addGlowEffect(col, row);
  }
}

function clearStickies() {
  stickyMatrix.forEach(col => col.fill(false));
}
```

### Cascading Reels
```js
async function runCascade(matrix) {
  let count = 0, totalWin = 0;

  while (true) {
    const wins = evaluateWins(matrix);
    if (!wins.length) break;

    count++;
    const mult = Math.min(count, 5); // x1,x2,x3,x4,x5

    // Har step AWAIT karo — order zaroori!
    await Promise.all(wins.map(w => explodeSymbol(w)));
    await applyGravity(matrix);
    await fillFromTop(matrix);
    totalWin += calculateWinAmount(wins) * mult;
  }

  return totalWin;
}

async function applyGravity(matrix) {
  for (let col = 0; col < 5; col++) {
    let emptyRow = 2;
    for (let row = 2; row >= 0; row--) {
      if (matrix[col][row] !== null) {
        if (row !== emptyRow) {
          matrix[col][emptyRow] = matrix[col][row];
          matrix[col][row]      = null;
          const sprite = getSprite(col, row);
          await gsap.to(sprite, {
            y: emptyRow * SYMBOL_H,
            duration: 0.3, ease: 'bounce.out'
          });
        }
        emptyRow--;
      }
    }
  }
}
```

### Free Spins
```js
class FreeSpinsManager {
  constructor() {
    this.total      = 0;
    this.remaining  = 0;
    this.totalWin   = 0;
    this.active     = false;
    this.multiplier = 1;
  }

  trigger(count) {
    this.total     = count;
    this.remaining = count;
    this.totalWin  = 0;
    this.active    = true;
    showFreeSpinsIntro(count);
  }

  retrigger(more) {
    this.remaining += more;
    this.total     += more;
  }

  async playOne(server) {
    this.remaining--;
    const result = await server.freeSpin(); // Bet nahi kata!
    this.totalWin += result.win * this.multiplier;
    if (result.win > 0) this.multiplier = Math.min(this.multiplier + 1, 10);
    if (result.scatters >= 3) this.retrigger(result.scatters * 5);
    if (this.remaining === 0) await this.end();
    return result;
  }

  async end() {
    this.active = false;
    await showFreeSpinsSummary({ total: this.total, win: this.totalWin });
  }
}
```

### Bonus Game
```js
class PickEmBonus {
  constructor() {
    this.prizes   = [50, 100, 200, 500, 'COLLECT']
      .sort(() => Math.random() - 0.5);
    this.picks    = 3;
    this.totalWin = 0;
  }

  async pick(index) {
    const prize = this.prizes[index];
    await animateBoxOpen(index, prize);
    if (prize === 'COLLECT') { await this.end(); return; }
    this.totalWin += prize;
    this.picks--;
    if (this.picks === 0) await this.end();
  }

  async end() { await showTotal(this.totalWin); }
}
```

### Megaways
```js
function getMegaways() {
  const heights = Array(6).fill(0)
    .map(() => 2 + Math.floor(Math.random() * 6)); // 2-7

  const ways = heights.reduce((a, b) => a * b, 1);
  // Max: 7^6 = 117,649 ways!

  return { heights, ways };
}

function checkMegawaysWins(matrix, heights, bet) {
  const wins = [];
  const symbols = getAllUniqueSymbols();

  for (const target of symbols) {
    let waysCount = 1, length = 0;

    for (let col = 0; col < 6; col++) {
      const matches = matrix[col]
        .slice(0, heights[col])
        .filter(s => s === target || s === 'WILD').length;

      if (matches > 0) {
        waysCount *= matches;
        length++;
      } else break;
    }

    if (length >= 3) {
      wins.push({
        symbol: target, length, ways: waysCount,
        amount: getPayout(target, length) * waysCount * bet
      });
    }
  }

  return wins;
}
```

### Win Line Animation
```js
function animateWinLine(winLine) {
  const g      = new PIXI.Graphics();
  const points = winLine.map(({ col, row }) => ({
    x: col * REEL_W + REEL_W / 2,
    y: row * SYMBOL_H + SYMBOL_H / 2
  }));

  let progress = { t: 0 };
  gsap.to(progress, {
    t: 1, duration: 0.6,
    onUpdate: () => {
      g.clear();
      g.lineStyle(3, 0xFFD700, 1);
      g.moveTo(points[0].x, points[0].y);
      const idx = Math.floor(progress.t * (points.length - 1));
      points.slice(1, idx + 2).forEach(p => g.lineTo(p.x, p.y));
    }
  });

  // Symbols highlight
  winLine.forEach(({ col, row }) => {
    const sym = reels[col].symbols[row];
    gsap.to(sym.scale, { x: 1.2, y: 1.2, duration: 0.3, yoyo: true, repeat: 3 });
  });
}
```

---

## Y2.3 — Performance Optimization

### Draw Calls
```
Problem:
50 alag textures = 50 draw calls = LAG 💀

Solution:
1 Texture Atlas  = 1 draw call   = FAST ✅
```

```js
// Atlas load
await PIXI.Assets.load('symbols.json');

// Use — automatically atlas se
const cherry = PIXI.Sprite.from('cherry.png');
const wild   = PIXI.Sprite.from('wild.png');
// Ek hi draw call!

// ParticleContainer — 10,000 sprites = 1 draw call
const particles = new PIXI.ParticleContainer(10000, {
  vertices: true, uvs: true, alpha: true
});
```

### Object Pool (Detail)
```js
class ObjectPool {
  constructor(createFn, size = 50) {
    this.available = Array.from({ length: size }, createFn);
    this.inUse     = new Set();
  }

  acquire() {
    const obj = this.available.pop() || this.createFn();
    this.inUse.add(obj);
    obj.visible = true;
    return obj;
  }

  release(obj) {
    if (!this.inUse.has(obj)) return;
    obj.visible = false;
    obj.alpha   = 1;
    obj.scale.set(1);
    obj.filters = null;
    obj.parent?.removeChild(obj);
    this.inUse.delete(obj);
    this.available.push(obj);
  }
}

// Win coins
async function celebrateWin(amount, x, y) {
  const count = Math.min(Math.floor(amount / 10), 50);

  for (let i = 0; i < count; i++) {
    const coin = coinPool.acquire();
    coin.x = x; coin.y = y;
    app.stage.addChild(coin);

    gsap.to(coin, {
      x:        x + (Math.random() - 0.5) * 200,
      y:        y - Math.random() * 150,
      alpha:    0,
      duration: 1 + Math.random() * 0.5,
      onComplete: () => coinPool.release(coin), // Wapas pool mein!
    });
  }
}
```

### Memory Leak Fix
```js
// ✅ Always destroy properly
sprite.destroy({ children: true, texture: false });
// texture: false → shared atlas protect karo!

// Event listeners cleanup
button.off('pointerdown', handler);

// Game close pe
app.destroy(true, { children: true, texture: true });
PIXI.utils.clearTextureCache();
```

### Lazy Loading
```js
// Phase 1: Minimum assets — game jaldi dikhao
await PIXI.Assets.load(['base-symbols.json', 'ui.json']);
showGame();

// Phase 2: Background mein
PIXI.Assets.backgroundLoad(['free-spins-assets.json']);

// Phase 3: Jab zarurat ho
async function onFreeSpinsTriggered() {
  await PIXI.Assets.load('free-spins-assets.json');
  startFreeSpins();
}
```

---

# 📅 YEAR 3 — Senior Level

---

## Y3.1 — Complete Architecture (MVC)

```js
// MODEL — Data only
class GameModel {
  constructor() {
    this.balance   = 1000;
    this.bet       = 10;
    this.sessionId = null;
    this.freeSpins = 0;
  }

  updateBalance(newBalance) {
    this.balance = newBalance;
    EventBus.emit('balanceChanged', newBalance);
  }

  setBet(amount) {
    if (amount > this.balance) return false;
    this.bet = amount;
    EventBus.emit('betChanged', amount);
    return true;
  }
}

// VIEW — Visual only
class GameView {
  constructor(stage) {
    this.reelViews = [];
    this.uiView    = new UIView(stage);
    this.winView   = new WinView(stage);

    for (let i = 0; i < 5; i++) {
      const reel = new ReelView(i);
      this.reelViews.push(reel);
      stage.addChild(reel.container);
    }
  }

  async stopReels(symbols) {
    await Promise.all(
      this.reelViews.map((r, i) => r.stopOn(symbols[i]))
    );
  }
}

// CONTROLLER — Logic center
class GameController {
  constructor() {
    this.model  = new GameModel();
    this.view   = new GameView(app.stage);
    this.server = new ServerService();
    this.fsm    = new SlotFSM();
    this.sound  = SoundManager.getInstance();
    this.setupEvents();
  }

  setupEvents() {
    this.view.uiView.onSpinClick = () => this.spin();
  }

  async spin() {
    if (!this.fsm.canSpin()) return;
    this.fsm.go('SPINNING');

    try {
      this.sound.play('spin');
      this.view.reelViews.forEach(r => r.startSpinning());

      const result = await this.server.spin({
        bet:       this.model.bet,
        sessionId: this.model.sessionId,
      });

      await this.view.stopReels(result.symbols);
      this.fsm.go('EVALUATING');

      if (result.totalWin > 0) {
        await this.view.winView.show(result.wins);
        this.model.updateBalance(result.newBalance);
      }

      if (result.freeSpins)     this.fsm.go('FREE_INTRO');
      else if (result.bonus)    this.fsm.go('BONUS');
      else if (result.totalWin) this.fsm.go('WIN_PRESENT');
      else                      this.fsm.go('IDLE');

    } catch(err) {
      console.error(err);
      this.fsm.go('IDLE');
    } finally {
      // Hamesha spin button enable karo!
    }
  }
}
```

---

## Y3.2 — Custom GLSL Shaders

### Wave Effect
```js
const waveShader = `
  precision mediump float;
  uniform sampler2D uSampler;
  uniform float     uTime;
  varying vec2      vTextureCoord;

  void main() {
    vec2 uv  = vTextureCoord;
    uv.x    += sin(uv.y * 20.0 + uTime) * 0.01;
    gl_FragColor = texture2D(uSampler, uv);
  }
`;

const waveFilter = new PIXI.Filter(null, waveShader, { uTime: 0.0 });

app.ticker.add(() => {
  waveFilter.uniforms.uTime += 0.05;
});

// Win pe apply
winningSymbols.forEach(s => s.filters = [waveFilter]);

// Win khatam pe remove
setTimeout(() => {
  winningSymbols.forEach(s => s.filters = null);
}, 3000);
```

### Glow Filter
```js
import { GlowFilter } from '@pixi/filter-glow';

function addGlowToSymbol(sprite) {
  sprite.filters = [new GlowFilter({
    color:          0xFFAA00,
    outerStrength:  3,
    innerStrength:  1,
    distance:       15,
  })];
}

// Win pe glow
winSymbols.forEach(s => addGlowToSymbol(s));

// Sirf win symbols pe — baaki pe nahi!
// Har symbol pe filter = LAG
```

---

## Y3.3 — Sound System

```js
class SoundManager {
  static #instance = null;

  static getInstance() {
    if (!this.#instance) this.#instance = new SoundManager();
    return this.#instance;
  }

  constructor() {
    // Audio sprite — 1 file mein sab sounds = 1 HTTP request!
    this.sfx = new Howl({
      src: ['sfx.webm', 'sfx.mp3'],
      sprite: {
        spin:    [0,    500],
        stop:    [600,  300],
        win:     [1000, 800],
        bigWin:  [2000, 3000],
        scatter: [5100, 1200],
        bonus:   [6400, 2000],
      }
    });

    this.bgMusic  = new Howl({ src: ['bg.mp3'], loop: true, volume: 0.4 });
    this.unlocked = false;
  }

  // Mobile autoplay fix
  unlock() {
    if (this.unlocked) return;
    Howler.ctx?.resume();
    this.unlocked = true;
  }

  play(name)  { this.sfx.play(name); }
  mute()      { Howler.mute(true); }
  unmute()    { Howler.mute(false); }
  setVol(v)   { Howler.volume(v); }
  playMusic() { this.bgMusic.play(); }
  stopMusic() { this.bgMusic.stop(); }
}

// First touch pe unlock — IMPORTANT for mobile!
document.addEventListener('pointerdown',
  () => SoundManager.getInstance().unlock(),
  { once: true }
);
```

---

## Y3.4 — Responsive Design

```js
class ResponsiveManager {
  constructor(app) {
    this.app    = app;
    this.BASE_W = 1280;
    this.BASE_H = 720;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const sw    = window.innerWidth;
    const sh    = window.innerHeight;
    const scale = Math.min(sw / this.BASE_W, sh / this.BASE_H);

    this.app.renderer.resize(this.BASE_W * scale, this.BASE_H * scale);
    this.app.stage.scale.set(scale);

    // Portrait mode check (mobile)
    if (sw < sh) {
      reelContainer.y  = sh * 0.35;
      uiContainer.y    = sh * 0.05;
      spinButton.scale.set(1.3);
    }
  }
}
```

---

## Y3.5 — Spine Animations

```js
import { Spine } from 'pixi-spine';

// Load karo
await PIXI.Assets.load(['dragon.atlas', 'dragon.json']);
const dragonData = PIXI.Assets.get('dragon.json');

// Create karo
const dragon = new Spine(dragonData.spineData);

// Idle animation loop
dragon.state.setAnimation(0, 'idle', true);

// Win animation
function playWinAnim() {
  dragon.state.setAnimation(0, 'win', false);
  dragon.state.addAnimation(0, 'idle', true, 0); // Back to idle
}

// Position karo
dragon.x = 400; dragon.y = 300;
reelContainer.addChild(dragon);

// IMPORTANT: pixi-spine version must match PixiJS version!
```

---

# 📅 YEAR 4 — Lead Level

---

## Y4.1 — Complete Backend

```js
const express   = require('express');
const mongoose  = require('mongoose');
const app       = express();
app.use(express.json());

// Player Schema
const PlayerSchema = new mongoose.Schema({
  username:   String,
  balance:    { type: Number, default: 1000 },
  sessionId:  String,
  totalSpins: { type: Number, default: 0 },
  totalWin:   { type: Number, default: 0 },
});
const Player = mongoose.model('Player', PlayerSchema);

// Spin API
app.post('/api/spin', async (req, res) => {
  const { bet, sessionId } = req.body;

  try {
    // 1. Auth
    const player = await Player.findOne({ sessionId });
    if (!player) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Balance check
    if (player.balance < bet) {
      return res.status(400).json({ error: 'Low balance' });
    }

    // 3. SERVER RNG — KABHI CLIENT SIDE MAT KARO!
    const symbols = generateRNG();

    // 4. Win calculate
    const wins     = calculateAllWins(symbols, bet);
    const totalWin = wins.reduce((s, w) => s + w.amount, 0);

    // 5. DB update
    player.balance    -= bet;
    player.balance    += totalWin;
    player.totalSpins += 1;
    player.totalWin   += totalWin;
    await player.save();

    // 6. Response
    res.json({
      symbols,
      wins,
      totalWin,
      newBalance: player.balance,
      freeSpins:  checkFreeSpins(symbols),
      bonus:      checkBonus(symbols),
    });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Free Spin API — bet nahi kata!
app.post('/api/free-spin', async (req, res) => {
  const { sessionId, freeSpinId } = req.body;

  const freeSpin = await FreeSpinSession.findById(freeSpinId);
  if (!freeSpin || freeSpin.remaining <= 0) {
    return res.status(400).json({ error: 'No free spins' });
  }

  const symbols  = generateRNG();
  const wins     = calculateAllWins(symbols, freeSpin.bet);
  const totalWin = wins.reduce((s, w) => s + w.amount, 0);

  const player    = await Player.findOne({ sessionId });
  player.balance += totalWin;
  await player.save();

  freeSpin.remaining--;
  await freeSpin.save();

  res.json({
    symbols, wins, totalWin,
    newBalance: player.balance,
    remaining:  freeSpin.remaining
  });
});
```

### RNG Function
```js
function generateRNG() {
  const SYMBOL_WEIGHTS = [
    { symbol: 'CHERRY',  weight: 30 },
    { symbol: 'LEMON',   weight: 25 },
    { symbol: 'ORANGE',  weight: 20 },
    { symbol: 'GRAPE',   weight: 15 },
    { symbol: 'SEVEN',   weight: 5  },
    { symbol: 'WILD',    weight: 3  },
    { symbol: 'SCATTER', weight: 2  },
  ];

  const result = [];
  for (let col = 0; col < 5; col++) {
    const reel = [];
    for (let row = 0; row < 3; row++) {
      reel.push(weightedRandom(SYMBOL_WEIGHTS));
    }
    result.push(reel);
  }
  return result;
}

function weightedRandom(weights) {
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let rand    = Math.random() * total;

  for (const item of weights) {
    rand -= item.weight;
    if (rand <= 0) return item.symbol;
  }
}
```

---

## Y4.2 — WebGPU & PixiJS v8

```js
// v8 changes — yaad rakho!

// ❌ v7: Sync
const app = new PIXI.Application({...});

// ✅ v8: Async
const app = new PIXI.Application();
await app.init({
  preference:      'webgpu', // WebGPU try karo
  width:           800,
  height:          600,
  backgroundColor: 0x1a1a2e,
});

// ❌ v7: Loader
PIXI.Loader.shared.add('img', 'image.png').load(setup);

// ✅ v8: Assets
await PIXI.Assets.load('image.png');

// ❌ v7: Events
sprite.on('click', handler);

// ✅ v8: EventMode
sprite.eventMode = 'static';
sprite.on('pointerdown', handler);
```

---

## Y4.3 — Testing

```js
// Jest se unit tests

describe('Win Calculation', () => {
  test('3 cherries = win', () => {
    const line   = ['🍒', '🍒', '🍒', '🍋', '⭐'];
    const result = evaluateLine(line);
    expect(result.win).toBe(true);
    expect(result.count).toBe(3);
  });

  test('Wild replaces any symbol', () => {
    const line   = ['🍒', '🃏', '🍒', '🍋', '⭐'];
    const result = evaluateLine(line);
    expect(result.win).toBe(true);
  });

  test('No win with different symbols', () => {
    const line   = ['🍒', '💎', '🍋', '⭐', '🔔'];
    const result = evaluateLine(line);
    expect(result.win).toBe(false);
  });
});

describe('State Machine', () => {
  test('IDLE → SPINNING allowed', () => {
    const fsm = new SlotFSM();
    expect(fsm.go('SPINNING')).toBe(true);
    expect(fsm.state).toBe('SPINNING');
  });

  test('IDLE → WIN_PRESENT not allowed', () => {
    const fsm = new SlotFSM();
    expect(fsm.go('WIN_PRESENT')).toBe(false);
    expect(fsm.state).toBe('IDLE');
  });
});
```

---

## Y4.4 — Autoplay Feature

```js
class AutoPlay {
  constructor() {
    this.running      = false;
    this.spinsLeft    = 0;
    this.stopOnWin    = false;
    this.stopOnBonus  = true;
    this.lossLimit    = null;
    this.startBalance = 0;
  }

  start(spins, settings = {}) {
    this.running      = true;
    this.spinsLeft    = spins;
    this.startBalance = currentBalance;
    Object.assign(this, settings);
    this.runNext();
  }

  async runNext() {
    if (!this.running || this.spinsLeft <= 0) {
      this.stop('Completed');
      return;
    }

    this.spinsLeft--;
    const result = await gameController.doSpin();

    if (this.stopOnWin   && result.totalWin > 0)          return this.stop('Win');
    if (this.stopOnBonus && result.bonusTriggered)         return this.stop('Bonus');
    if (this.lossLimit   && this.getLoss() > this.lossLimit) return this.stop('Loss limit');

    setTimeout(() => this.runNext(), 500);
  }

  stop(reason) {
    this.running = false;
    showAutoplayStop(reason);
  }

  getLoss() {
    return Math.max(0, this.startBalance - currentBalance);
  }
}
```

---

## Y4.5 — Progressive Jackpot

```js
class ProgressiveJackpot {
  constructor() {
    this.tiers = {
      MINI:  { value: 100,    seed: 100,    contribution: 0.01  },
      MINOR: { value: 500,    seed: 500,    contribution: 0.015 },
      MAJOR: { value: 5000,   seed: 5000,   contribution: 0.02  },
      GRAND: { value: 50000,  seed: 50000,  contribution: 0.025 },
      MEGA:  { value: 500000, seed: 500000, contribution: 0.03  },
    };
  }

  // Har spin pe contribution
  onSpin(betAmount) {
    Object.values(this.tiers).forEach(tier => {
      tier.value += betAmount * tier.contribution;
    });
    this.updateDisplays();
  }

  async awardJackpot(tier, playerId) {
    const winAmount = this.tiers[tier].value;
    await playJackpotAnimation(tier, winAmount);

    // Reset to seed
    this.tiers[tier].value = this.tiers[tier].seed;
    this.updateDisplays();

    return winAmount;
  }

  // Animated counter
  updateDisplays() {
    Object.entries(this.tiers).forEach(([key, tier]) => {
      const display = jackpotDisplays[key];
      gsap.to(display, {
        value:    tier.value,
        duration: 0.5,
        onUpdate: () => {
          display.text = `₹${Math.floor(display.value).toLocaleString()}`;
        }
      });
    });
  }
}
```

---

# ⚡ COMPLETE QUICK REVISION

```
Year 1 Topics:
var/let/const   → let aur const use karo, var avoid
Arrow function  → (a,b) => a+b
Array methods   → map, filter, reduce, find
Async/Await     → try/catch/finally HAMESHA
Closure         → Inner function outer vars access karta
PixiJS setup    → Application, Assets, Stage
Sprite          → Sprite.from(), anchor, alpha, visible
Container       → Group karo, parent move = all move
Graphics        → Shapes draw karo
Game Loop       → ticker.add(delta => ...), DELTA USE KARO!
Reel basic      → Container + Mask + Symbols

Year 2 Topics:
Inheritance     → extends, super()
Design Patterns → Singleton, Observer, Factory, Pool
FSM             → IDLE→SPIN→EVAL→WIN/FREE/BONUS→IDLE
Expanding Wild  → GSAP height + matrix update
Sticky Wild     → Persistent boolean matrix
Cascade         → Async while loop, await each step
Free Spins      → server.freeSpin(), bet nahi kata
Texture Atlas   → 1 draw call = FAST
Object Pool     → acquire/release, no GC
Lazy Loading    → Phase loading, backgroundLoad

Year 3 Topics:
MVC             → Model(data) View(visual) Controller(logic)
GLSL Shader     → PIXI.Filter, uniforms, wave effect
Sound           → Howler.js, audio sprite, mobile unlock
Responsive      → resize(), scale, portrait/landscape
Spine           → pixi-spine, setAnimation, addAnimation
Memory leak     → destroy(), off(), clearTextureCache

Year 4 Topics:
Backend         → Express + MongoDB + RNG server side
RNG             → SERVER ONLY — ILLEGAL client pe!
Testing         → Jest, describe, test, expect
PixiJS v8       → await app.init(), Assets, eventMode
Autoplay        → Stop conditions, loss limit
Jackpot         → Tiers, contribution, animated counter
```

---

# 💰 Salary Journey

```
Year 1 (Junior):    8-12 LPA
Year 2 (Mid):       12-18 LPA
Year 3 (Senior):    18-25 LPA
Year 4 (Lead):      25-35 LPA
Abroad (Year 4+):   80-120 LPA! 🔥
```

---

# 🎯 Daily Routine — 4 Saal Tak

```
Morning (30 min):
☑ 1 concept revise karo
☑ Ya 1 problem solve karo

Office (8 hours):
☑ Best code likho
☑ Questions poochho
☑ Learn from seniors

Evening (1 hour):
☑ Side project karo
☑ New tech seekho
☑ GitHub pe daalo

Weekend (2-3 hours):
☑ Full feature implement karo
☑ Blog likho (optional)
```

---

# 🏆 Year-wise Checklist

```
Year 1 ✅:
☑ JavaScript strong
☑ PixiJS basics
☑ Basic reel logic
☑ Git properly
☑ First feature shipped

Year 2 ✅:
☑ All slot features
☑ Performance optimized
☑ OOPs + Patterns
☑ Server integration
☑ Team mein contribute

Year 3 ✅:
☑ Architecture design kiya
☑ Shaders implement kiye
☑ Junior mentor kiya
☑ Full game own kiya
☑ Senior title mila

Year 4 ✅:
☑ Team lead kiya
☑ Product decisions liye
☑ System design kiya
☑ Interviews diye
☑ 25+ LPA! 🎉
```

---

*Bhai yeh 4 saal consistently follow karo — 35 LPA pakka milega! 💪🔥🎰*