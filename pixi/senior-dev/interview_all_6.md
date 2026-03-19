# 🎰 Slot Game Development — Complete Guide (Hinglish)
> Basic se Advance — PixiJS + Backend + Features + Performance

---

## 📚 CHAPTER 1 — Slot Game Kya Hota Hai?

### Basic Structure
```
5 Reels (columns) × 3 Rows = 15 symbols visible

     Col0  Col1  Col2  Col3  Col4
Row0 [ 🍒 ][ 💎 ][ 7️⃣ ][ 🍋 ][ ⭐ ]
Row1 [ 🃏 ][ 🍒 ][ 🍒 ][ 🍒 ][ 🔔 ] ← WIN LINE!
Row2 [ ⭐ ][ 🍋 ][ 💎 ][ 7️⃣ ][ 🍒 ]

Middle row mein 3+ same symbols = WIN!
```

### Game Flow
```
Player clicks SPIN
→ Reels ghoomti hain
→ Server result deta hai
→ Reels rok jaati hain
→ Win check hota hai
→ Paise milte hain
```

---

## 📚 CHAPTER 2 — Tech Stack

```
Frontend:
→ PixiJS      (2D Rendering - WebGL)
→ GSAP        (Animations)
→ Howler.js   (Sound)
→ JavaScript  (Core Logic)

Backend:
→ Node.js     (Server)
→ Express.js  (API)
→ MongoDB     (Database)

Tools:
→ TexturePacker (Sprite Atlas)
→ Spine          (Skeletal Animations)
```

---

## 📚 CHAPTER 3 — PixiJS Setup

```js
const app = new PIXI.Application({
  width:           800,
  height:          600,
  backgroundColor: 0x1a1a2e,
  resolution:      window.devicePixelRatio || 1,
  antialias:       true,
});
document.body.appendChild(app.view);

// Assets Load
await PIXI.Assets.load([
  'symbols.json',  // Texture atlas
  'ui.json',
  'bg.jpg',
]);
```

---

## 📚 CHAPTER 4 — Game Structure (MVC)

```
src/
├── App.js                 ← PIXI setup
├── models/
│   ├── GameModel.js       ← Balance, bet, session
│   └── ReelModel.js       ← Symbol matrix
├── views/
│   ├── ReelView.js        ← Reel visual
│   ├── SymbolView.js      ← Symbol sprite
│   ├── UIView.js          ← Buttons, balance
│   └── WinView.js         ← Win effects
├── controllers/
│   └── GameController.js  ← Main logic
├── services/
│   ├── ServerService.js   ← API calls
│   └── SoundService.js    ← Audio
└── utils/
    ├── Pool.js            ← Object pool
    └── StateMachine.js    ← FSM
```

---

## 📚 CHAPTER 5 — Reel System

### Reel Kya Hai
```
Reel = Lambi strip jisme symbols hain
Strip scroll karti hai neeche
Player sirf 3 symbols dekhta hai
Mask lagata hai taaki baaki hide ho
```

### ReelView Class
```js
class ReelView {
  constructor(col) {
    this.col      = col;
    this.position = 0;
    this.speed    = 0;
    this.symbols  = [];
    this.container = new PIXI.Container();
    this.setupMask();
    this.createSymbols();
  }

  setupMask() {
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, REEL_W, REEL_H);
    mask.endFill();
    this.container.mask = mask;
    this.container.addChild(mask); // COMPULSORY!
  }

  createSymbols() {
    for (let i = 0; i < ROWS + 2; i++) {
      const sprite = new PIXI.Sprite();
      sprite.width  = SYMBOL_W;
      sprite.height = SYMBOL_H;
      sprite.y      = (i - 1) * SYMBOL_H;
      this.container.addChild(sprite);
      this.symbols.push(sprite);
    }
  }

  // Game loop mein har frame
  update(delta) {
    if (!this.isSpinning) return;

    this.position += this.speed * delta;

    this.symbols.forEach((sym, i) => {
      const totalH = this.symbols.length * SYMBOL_H;
      const rawY   = i * SYMBOL_H - this.position;

      // Infinite scroll — modulo magic!
      sym.y = ((rawY % totalH) + totalH) % totalH;

      // Upar se aaya = naya symbol assign karo
      if (sym.y < SYMBOL_H && sym.prevY > totalH - SYMBOL_H) {
        sym.texture = this.getNextTexture();
      }
      sym.prevY = sym.y;
    });
  }
}
```

---

## 📚 CHAPTER 6 — Reel Spin Logic

### 3 Phases
```
Phase 1: EASE IN   → Dheere se fast (power2.in)
Phase 2: FULL SPIN → Server result wait
Phase 3: EASE OUT  → Bounce ke saath stop (back.out)
```

### Spin Code
```js
async function spinReel(col, targetSymbols) {
  const reel = reels[col];

  // Phase 1: Speed up
  await gsap.to(reel, {
    speed:    50,
    duration: 0.3,
    ease:     'power2.in'
  });

  // Phase 2: Server result wait
  await serverResultPromise;

  // Phase 3: Stop with bounce
  await gsap.to(reel, {
    y:        getTargetY(targetSymbols),
    speed:    0,
    duration: 0.6,
    ease:     'back.out(1.3)'
  });
}

// Stagger — reels ek ek karke rukti hain
async function stopAllReels(result) {
  for (let col = 0; col < 5; col++) {
    spinReel(col, result.symbols[col]);
    await sleep(200); // 200ms delay each
  }
}
```

---

## 📚 CHAPTER 7 — State Machine (FSM)

### States Diagram
```
IDLE → SPINNING → EVALUATING → WIN_PRESENT → IDLE
                      ↓               ↓
                  FREE_INTRO      FREE_INTRO
                      ↓
                FREE_SPINNING → EVALUATING
                      ↓
                  FREE_OUTRO → IDLE
                      ↓
                    BONUS → IDLE
```

### FSM Code
```js
class StateMachine {
  constructor() {
    this.state = 'IDLE';
    this.map = {
      IDLE:          ['SPINNING'],
      SPINNING:      ['EVALUATING'],
      EVALUATING:    ['WIN_PRESENT', 'FREE_INTRO', 'BONUS', 'IDLE'],
      WIN_PRESENT:   ['IDLE', 'FREE_INTRO'],
      FREE_INTRO:    ['FREE_SPINNING'],
      FREE_SPINNING: ['EVALUATING'],
      FREE_OUTRO:    ['IDLE'],
      BONUS:         ['IDLE'],
    };
  }

  go(next) {
    if (!this.map[this.state].includes(next)) {
      console.error(`Invalid: ${this.state} → ${next}`);
      return;
    }
    this.state = next;
  }

  canSpin() { return this.state === 'IDLE'; }
}
```

### Kyun Zaroori Hai
```
Bina FSM:
❌ Free spins mein balance deduct
❌ Bonus mein spin button clickable
❌ Double spin possible

FSM ke saath:
✅ Invalid states IMPOSSIBLE
✅ Game always correct state mein
```

---

## 📚 CHAPTER 8 — Backend / Server

### Architecture
```
Client → POST /api/spin
           ↓
    Session Validate
           ↓
    Balance Check
           ↓
    RNG Run (Server Side!)
           ↓
    Win Calculate
           ↓
    Balance Update (DB)
           ↓
    Response → Client
```

### Server Code (Node.js)
```js
const express = require('express');
const app     = express();

app.post('/api/spin', async (req, res) => {
  const { bet, sessionId, gameId } = req.body;

  try {
    // Step 1: Session validate
    const session = await validateSession(sessionId);
    if (!session) return res.status(401).json({ error: 'Invalid session' });

    // Step 2: Balance check
    const player = await Player.findById(session.playerId);
    if (player.balance < bet) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Step 3: RNG — SERVER SIDE ONLY!
    // ❌ KABHI CLIENT SIDE MAT KARO
    const symbols = generateResult(gameId);

    // Step 4: Win calculate
    const wins     = calculateWins(symbols, bet);
    const totalWin = wins.reduce((s, w) => s + w.amount, 0);

    // Step 5: Balance update DB
    player.balance = player.balance - bet + totalWin;
    await player.save();

    // Step 6: Response
    res.json({
      symbols,
      wins,
      totalWin,
      newBalance: player.balance,
    });

  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### RNG Function
```js
function generateResult(gameId) {
  const game    = getGameConfig(gameId);
  const symbols = [];

  for (let col = 0; col < 5; col++) {
    const reel = [];
    for (let row = 0; row < 3; row++) {
      reel.push(weightedRandom(game.symbolWeights));
    }
    symbols.push(reel);
  }
  return symbols;
}

// Weighted random — RTP control karta hai
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

## 📚 CHAPTER 9 — Win Calculation

```js
function calculateWins(symbols, bet) {
  const wins = [];

  // Paylines check
  PAYLINES.forEach((payline, lineIndex) => {
    const line = payline.map((row, col) => symbols[col][row]);

    const base = line.find(s => s !== 'WILD');
    if (!base) return;

    let count = 0;
    for (const sym of line) {
      if (sym === base || sym === 'WILD') count++;
      else break;
    }

    if (count >= 3) {
      wins.push({
        lineIndex,
        symbol:  base,
        count,
        amount:  PAYTABLE[base][count] * bet,
      });
    }
  });

  // Scatter — kahi bhi!
  const scatters = symbols.flat()
    .filter(s => s === 'SCATTER').length;

  if (scatters >= 3) {
    wins.push({
      type:      'SCATTER',
      count:     scatters,
      amount:    bet * scatters * 2,
      freeSpins: scatters * 5,
    });
  }

  return wins;
}
```

---

## 📚 CHAPTER 10 — ALL FEATURES

### 1. Wild Symbol
```js
// Koi bhi symbol replace karta hai
const base = line.find(s => s !== 'WILD');
const win  = line.every(s => s === base || s === 'WILD');
```

### 2. Expanding Wild
```js
async function expandWild(col) {
  // Poori column cover karo
  await gsap.to(wildSprite, {
    y: 0, height: REEL_H,
    duration: 0.4, ease: 'back.out(1.2)'
  });
  // Matrix update
  for (let r = 0; r < ROWS; r++) matrix[col][r] = 'WILD';
}
```

### 3. Sticky Wild
```js
const sticky = Array(5).fill(null).map(() => Array(3).fill(false));

// Har spin se pehle apply karo
function applySticky(result) {
  for (let c = 0; c < 5; c++)
    for (let r = 0; r < 3; r++)
      if (sticky[c][r]) result[c][r] = 'WILD';
}

// Free spin mein wild aaya toh sticky mark karo
function onWildLand(col, row) {
  if (isFreeSpins) sticky[col][row] = true;
}
```

### 4. Walking Wild
```js
class WalkingWild {
  constructor(col, row) {
    this.col = col; this.row = row; this.active = true;
  }
  move() {
    this.col--;
    if (this.col < 0) this.active = false;
  }
}
```

### 5. Cascading Reels
```js
async function cascade() {
  let count = 0, total = 0;

  while (true) {
    const wins = evaluateWins(matrix);
    if (!wins.length) break;         // Koi win nahi = band

    count++;
    const mult = Math.min(count, 5); // x1,x2,x3,x4,x5

    await Promise.all(wins.map(w => explode(w))); // 1. Blast
    await applyGravity(matrix);                   // 2. Giro
    await fillFromTop(matrix);                    // 3. Fill
    total += calcWin(wins) * mult;                // 4. Award
  }
  return total;
}

// KEY: Har step await karo!
// Sync loop = animations overlap = BUG!
```

### 6. Multiplier
```js
class ProgressiveMult {
  constructor() { this.value = 1; }
  onWin()        { this.value = Math.min(this.value + 1, 10); }
  apply(win)     { return win * this.value; }
  reset()        { this.value = 1; }
}
```

### 7. Scatter
```js
function checkScatter(matrix) {
  let count = 0;
  // Kahi bhi count karo — payline nahi chahiye!
  for (let c = 0; c < 5; c++)
    for (let r = 0; r < 3; r++)
      if (matrix[c][r] === 'SCATTER') count++;

  return {
    count,
    freeSpins: count >= 3 ? count * 5 : 0,
    win:       count >= 3 ? bet * count * 2 : 0
  };
}
```

### 8. Free Spins
```js
class FreeSpins {
  constructor() {
    this.left   = 0;
    this.active = false;
    this.totalWin = 0;
  }

  trigger(count) {
    this.left   = count;
    this.active = true;
  }

  retrigger(more) { this.left += more; }

  async playOne(server) {
    this.left--;
    const result = await server.freeSpin(); // Bet nahi kata!
    this.totalWin += result.win;
    if (result.scatters >= 3) this.retrigger(result.scatters * 5);
    if (this.left === 0) await this.end();
    return result;
  }

  async end() {
    this.active = false;
    await showSummary(this.totalWin);
  }
}
```

### 9. Bonus Game
```js
class PickEmBonus {
  constructor() {
    this.prizes = [50, 100, 200, 500, 'COLLECT']
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
}
```

### 10. Megaways
```js
function getMegaways() {
  // Har reel ki height random (2-7)
  const heights = Array(6).fill(0)
    .map(() => 2 + Math.floor(Math.random() * 6));

  // Ways = sab multiply karo
  const ways = heights.reduce((a, b) => a * b, 1);
  // Max: 7^6 = 117,649 ways!

  return { heights, ways };
}
```

### 11. Re-Spin / Hold & Win
```js
async function holdAndWin(matrix) {
  let reSpins = 3;
  lockMoneySymbols(matrix);

  while (reSpins > 0) {
    reSpins--;
    const result = await spinUnlockedReels();

    if (result.hasNewCoins) {
      reSpins = 3; // RESET! New coin aaya
      lockNewCoins(result.coins);
    }
  }
  return calculateTotal();
}
```

### 12. Cluster Pays
```js
// Flood fill — connected symbols find karo
function findCluster(matrix, col, row, target) {
  const visited = new Set();
  const queue   = [`${col},${row}`];
  const cluster = [];

  while (queue.length) {
    const key = queue.pop();
    if (visited.has(key)) continue;
    visited.add(key);

    const [c, r] = key.split(',').map(Number);
    if (c < 0 || c >= 5 || r < 0 || r >= 3) continue;
    if (matrix[c][r] !== target && matrix[c][r] !== 'WILD') continue;

    cluster.push({ c, r });
    queue.push(`${c+1},${r}`, `${c-1},${r}`, `${c},${r+1}`, `${c},${r-1}`);
  }
  return cluster; // 5+ = WIN!
}
```

---

## 📚 CHAPTER 11 — Performance

### Draw Calls
```
50 alag textures = 50 draw calls = LAG
1 Texture Atlas  = 1 draw call   = FAST ✅
```

```js
// Texture Atlas load
await PIXI.Assets.load('symbols.json');
const cherry = PIXI.Sprite.from('cherry.png'); // Atlas se auto!
```

### Object Pool
```js
class Pool {
  constructor(factory) {
    this.free = Array.from({ length: 50 }, factory);
  }
  get() {
    const o = this.free.pop();
    o.visible = true;
    o.alpha   = 1;
    o.scale.set(1);
    return o;
  }
  release(o) {
    o.visible = false;
    o.filters = null;
    o.parent?.removeChild(o);
    this.free.push(o);
  }
}
```

### Delta Time
```js
// ❌ WRONG — 144hz pe double speed!
app.ticker.add(() => { reel.y += 10; });

// ✅ CORRECT — always same speed
app.ticker.add((delta) => {
  reel.y += 10 * delta;
});
```

### Memory Leak Fix
```js
// ✅ Always destroy properly
sprite.destroy({ children: true, texture: false });
// texture: false → shared atlas protect karo!

// Event listeners cleanup
sprite.off('pointerdown', handler);

// Game close pe
PIXI.utils.clearTextureCache();
```

---

## 📚 CHAPTER 12 — Complete Spin Flow

```
1. Player clicks SPIN
2. FSM: IDLE → SPINNING
3. Reels start animation
4. POST /api/spin → Server
5. Server: Validate → RNG → Calculate → Update DB
6. Server response: { symbols, wins, newBalance }
7. Reels stop on result
8. FSM: SPINNING → EVALUATING
9. Win lines animate
10. Balance updates
11. FSM: WIN/FREE/BONUS/IDLE
```

```js
async function onSpinClick() {
  if (!fsm.canSpin()) return;
  fsm.go('SPINNING');
  spinBtn.disable();

  try {
    reels.forEach(r => r.startSpinning());

    const result = await serverService.spin({
      bet:       model.currentBet,
      sessionId: model.sessionId,
    });

    await stopAllReels(result.symbols);
    fsm.go('EVALUATING');

    if (result.totalWin > 0) {
      await winView.show(result.wins);
      model.balance = result.newBalance;
      uiView.updateBalance(result.newBalance);
    }

    if (result.freeSpins)     fsm.go('FREE_INTRO');
    else if (result.bonus)    fsm.go('BONUS');
    else if (result.totalWin) fsm.go('WIN_PRESENT');
    else                      fsm.go('IDLE');

  } catch(err) {
    console.error(err);
    fsm.go('IDLE');    // Error pe bhi reset!
  } finally {
    spinBtn.enable();  // Always enable!
  }
}
```

---

## 📚 CHAPTER 13 — Draw Calls

### Kya Hota Hai
```
Draw Call = CPU GPU ko ek baar instruction deta hai
"Yeh draw karo!"

Jitne zyada draw calls = Jitna zyada slow

50 alag textures = 50 draw calls = LAG 💀
1 Texture Atlas  = 1 draw call   = FAST ✅
```

### Solutions
```js
// 1. Texture Atlas — BEST solution
await PIXI.Assets.load('symbols.json');
// Sab symbols ek image mein — 1 draw call!

const cherry = PIXI.Sprite.from('cherry.png');
const wild   = PIXI.Sprite.from('wild.png');
const seven  = PIXI.Sprite.from('seven.png');
// Teeno ek hi draw call mein! 🔥

// 2. ParticleContainer — 10,000 sprites = 1 draw call
const particles = new PIXI.ParticleContainer(10000, {
  vertices: true,
  uvs:      true,
  alpha:    true,
});

// 3. cacheAsBitmap — Static UI ke liye
uiPanel.cacheAsBitmap = true;
// ⚠️ Sirf static cheez pe — jo change na ho!
```

### Batch Break Kab Hota Hai
```
Batch toot jaata hai jab:
❌ Alag alag atlas use ho
❌ Filter laga ho kisi pe
❌ BlendMode change ho

Isliye:
✅ Ek atlas mein sab symbols rakho
✅ Filters sirf winning symbols pe
```

---

## 📚 CHAPTER 14 — Lazy Loading

### Kya Hota Hai
```
Bina Lazy Loading:
[====== 8 second load ======] → Game starts
User bored ho jaata hai! 😤

Lazy Loading ke saath:
[== 2 sec ==] → Game starts → Background mein baaki load
User khush! 😊
```

### Phased Loading
```js
// Phase 1: Minimum assets — game dikhao jaldi
await PIXI.Assets.load(['base-symbols.json', 'ui.json']);
showGame(); // Turant dikhao!

// Phase 2: Background mein load karo
PIXI.Assets.backgroundLoad(['free-spins-assets.json']);
PIXI.Assets.backgroundLoad(['bonus-assets.json']);

// Phase 3: Jab zarurat ho tab load
async function onFreeSpinsTriggered() {
  await PIXI.Assets.load('free-spins-assets.json'); // Already cached!
  startFreeSpins();
}
```

### Asset Bundle System
```js
// Bundles define karo
PIXI.Assets.addBundle('base-game', {
  symbols:    'symbols-atlas.json',
  ui:         'ui-atlas.json',
  background: 'bg.jpg',
});

PIXI.Assets.addBundle('free-spins', {
  fsSymbols: 'fs-symbols.json',
  fsUI:      'fs-ui.json',
});

// Base game load karo with progress
await PIXI.Assets.loadBundle('base-game', (progress) => {
  loadingBar.width = progress * 400;
});

// Free spins background mein
PIXI.Assets.backgroundLoadBundle('free-spins');
```

---

## 📚 CHAPTER 15 — Canvas vs WebGL

### Simple Comparison
```
              Canvas 2D        WebGL
Processor:    CPU              GPU
Speed:        Slow             Fast (10-100x)
Sprites:      ~500 max         100,000+
Effects:      Limited          Custom shaders
Battery:      Better           More drain
Support:      100% browsers    97%+ browsers
```

### Kaise Kaam Karta Hai
```
Canvas 2D:
CPU → [calculate every pixel] → Screen
(CPU slow hai, ek cheez ek baar)

WebGL:
CPU → [data GPU ko bhejo] → GPU → [parallel] → Screen
(GPU mein thousands of cores ek saath!)
```

```js
// PixiJS automatically choose karta hai
const app = new PIXI.Application({ width: 800, height: 600 });
// Internally: WebGL first, Canvas fallback

// Force canvas:
const app = new PIXI.Application({ forceCanvas: true });

// Check karo kaunsa use ho raha hai:
console.log(app.renderer.type);
// 1 = WebGL ✅
// 2 = Canvas
```

### Kab Kya Use Karo
```
Canvas:
→ Testing/debug
→ Very old devices
→ Simple prototype

WebGL:
→ Production slot game ALWAYS ✅
→ Animations
→ Effects
→ Performance critical
```

---

## 📚 CHAPTER 16 — WebGL Basics

### Kya Karta Hai
```
WebGL = JavaScript se directly GPU ko instructions

Sab kuch triangles hain:
     ____
    |  / |
    | /  |
    |/___|
Triangle 1 + Triangle 2 = Square/Sprite!
```

### Core Concepts
```js
// 1. VERTEX BUFFER — Points kahan hain
const vertices = new Float32Array([
  // x,    y,    u,   v
   0,    0,   0.0, 0.0,  // top-left
  100,   0,   1.0, 0.0,  // top-right
   0,  100,   0.0, 1.0,  // bottom-left
  100, 100,   1.0, 1.0,  // bottom-right
]);

// 2. VERTEX SHADER — Position calculate karta hai
const vertexShader = `
  attribute vec2 aPosition;
  attribute vec2 aUV;
  varying vec2 vUV;
  void main() {
    vUV = aUV;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// 3. FRAGMENT SHADER — Har pixel ka color
const fragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vUV;
  void main() {
    gl_FragColor = texture2D(uTexture, vUV);
  }
`;
```

### PixiJS Internally
```
CPU (JavaScript):          GPU (GLSL):
─────────────────          ──────────────────
Sprite positions     →     Vertex Shader
Texture atlas load   →     Fragment Shader
Draw call send       →     Rasterize → Screen
```

### Batching
```js
// PixiJS ek draw call mein 65,535 sprites tak!

// Batch break hota hai:
// - Alag texture atlas
// - Filter laga ho
// - BlendMode change

// Isliye texture atlas critical hai!
```

---

## 📚 CHAPTER 17 — PixiJS Rendering Pipeline

### Ek Frame Ka Safar
```
app.ticker fires
      ↓
Stage.render() call
      ↓
Scene Graph traverse (tree walk)
      ↓
Har DisplayObject ke liye:
  - Visible check karo
  - World transform calculate karo
  - Batch mein add karo
  - Mask/Filter apply?
      ↓
Batch flush → 1 draw call GPU ko
      ↓
GPU renders → Screen
```

### Transform System
```js
// Local vs World transform
const container = new PIXI.Container();
container.x = 100; // Local

const child = new PIXI.Container();
child.x = 50;      // Local
container.addChild(child);

// Child ki world position = 100 + 50 = 150
// PixiJS automatically calculate karta hai!

// Performance tip:
child.cacheAsBitmap = true; // Static objects ke liye
```

### Render Order
```js
// addChild ka order = render order
// Pehle add = pehle draw = neeche dikhega

stage.addChild(background);    // Index 0 — sabse peeche
stage.addChild(reelContainer); // Index 1 — beech mein
stage.addChild(uiOverlay);     // Index 2 — sabse upar

// Specific index pe:
stage.addChildAt(sprite, 1);
```

### Filter Pipeline
```js
// Filter lagne pe:
// 1. Object RenderTexture pe render hota hai (off-screen)
// 2. Filter us texture pe apply hota hai
// 3. Result screen pe

// Extra draw call lagta hai!
// Isliye filters costly hain

// ✅ Efficient:
winSymbols.forEach(s => s.filters = [glowFilter]);

// ❌ Avoid:
everySymbol.filters = [glowFilter]; // 15 extra draw calls!
```

---

## 📚 CHAPTER 18 — Pixi Game Structure

### Folder Structure
```
src/
├── index.js              ← Entry point
├── App.js                ← PIXI Application
├── GameController.js     ← Main logic (MVC center)
├── models/
│   ├── GameModel.js      ← Balance, bet, state
│   └── ReelModel.js      ← Symbol matrix
├── views/
│   ├── ReelView.js       ← Reel visual
│   ├── SymbolView.js     ← Symbol sprite
│   ├── UIView.js         ← Buttons, balance
│   └── WinView.js        ← Win lines, effects
├── services/
│   ├── ServerService.js  ← API calls
│   └── SoundService.js   ← Howler.js wrapper
└── utils/
    ├── Pool.js           ← Object pool
    ├── StateMachine.js   ← FSM
    └── AssetLoader.js    ← Loading logic
```

### App.js
```js
class App {
  async init() {
    this.app = new PIXI.Application({
      width:           800,
      height:          600,
      backgroundColor: 0x0a0a14,
      resolution:      window.devicePixelRatio || 1,
      autoDensity:     true,
      antialias:       true,
    });
    document.getElementById('game').appendChild(this.app.view);

    await this.loadAssets();
    this.setupGame();
  }

  setupGame() {
    this.controller = new GameController(this.app);
    this.controller.init();
  }
}
```

### GameController.js
```js
class GameController {
  constructor(app) {
    this.app    = app;
    this.model  = new GameModel();
    this.view   = new GameView(app.stage);
    this.server = new ServerService();
    this.fsm    = new StateMachine();
  }

  init() {
    this.view.spinButton.on('pointerdown', () => this.onSpinClick());
  }

  async onSpinClick() {
    if (!this.fsm.canSpin()) return;
    this.fsm.go('SPINNING');

    const result = await this.server.spin({ bet: this.model.bet });
    await this.view.stopReels(result.symbols);

    if (result.wins.length) {
      await this.view.showWins(result.wins);
      this.model.balance = result.newBalance;
    }
    this.fsm.go('EVALUATING');
  }
}
```

---

## 📚 CHAPTER 19 — Reel Spin Logic (Detail)

### Reel Strip Concept
```
Reel = Vertical strip of symbols

Strip mein 20-30 symbols hote hain
Visible window = 3 symbols (rows)

[🍒] ← hidden (upar)
[💎]
[🎰] ← visible row 0
[🍋] ← visible row 1  ← Player yeh 3 dekhta hai
[⭐] ← visible row 2
[🔔]
[🃏] ← hidden (neeche)

Jab spin → strip neeche scroll karti hai
```

### Win Evaluation
```js
function evaluateLine(line) {
  // Base symbol find karo (wild ignore karke)
  const base = line.find(s => s !== 'WILD' && s !== 'SCATTER');
  if (!base) return { win: true, symbol: 'WILD' };

  // Left se right consecutive count
  let count = 0;
  for (const sym of line) {
    if (sym === base || sym === 'WILD') count++;
    else break; // Consecutive toot gaya
  }

  return count >= 3
    ? { win: true, symbol: base, count }
    : { win: false };
}
```

### Anticipation
```js
// Server result pehle aa jaata hai
// Agar scatter aane wala hai → reel slow karo!
async function spinWithAnticipation(result) {
  for (let col = 0; col < 5; col++) {
    const hasScatter = result.symbols[col].includes('SCATTER');
    const duration   = hasScatter ? 1.2 : 0.6; // Slow karo!

    reels[col].stop(result.symbols[col], duration);
    await sleep(150); // Stagger
  }
}
```

---

## 📚 CHAPTER 20 — Infinite Reel Spin

### Problem & Solution
```
Problem:
Strip scroll karte karte khatam ho jaati hai!

Solution — Symbol Wrapping:
Symbol neeche gaya toh upar le aao
Player ko lagta hai infinite strip hai! 😄
```

### Modulo Magic
```js
app.ticker.add((delta) => {
  position += speed * delta;

  symbols.forEach((sym, i) => {
    const totalH = symbols.length * SYMBOL_H;
    const rawY   = i * SYMBOL_H - position;

    // Double modulo — negative bhi handle!
    sym.sprite.y = ((rawY % totalH) + totalH) % totalH;

    // Top se aaya = naya symbol!
    if (sym.sprite.y < SYMBOL_H && sym.prevY > totalH - SYMBOL_H) {
      sym.sprite.texture = getNextTexture();
    }
    sym.prevY = sym.sprite.y;
  });
});
```

### Stop on Result
```js
async function alignToResult(targetSymbols) {
  const currentMod = position % (SYMBOL_H * STRIP_LENGTH);
  const targetMod  = getTargetMod(targetSymbols);

  let extraScroll = targetMod - currentMod;
  if (extraScroll < 0) extraScroll += SYMBOL_H * STRIP_LENGTH;
  // Ensure minimum half revolution
  if (extraScroll < SYMBOL_H * 2) extraScroll += SYMBOL_H * STRIP_LENGTH;

  await gsap.to(reel, {
    position: position + extraScroll,
    speed:    0,
    duration: 0.8,
    ease:     'power3.out',
  });
}
```

---

## 📚 CHAPTER 21 — Object Pooling

### Kyun Zaroori Hai
```
Without Pool:
Spin → Create 15 sprites → Animate → Destroy → GC → FRAME DROP 📉

With Pool:
Spin → Take 15 from pool → Animate → Return → NO GC → SMOOTH 📈
```

### Pool Class
```js
class ObjectPool {
  constructor(createFn, size = 50) {
    this.createFn  = createFn;
    this.available = [];
    this.inUse     = new Set();

    // Pre-warm — pehle se banao
    for (let i = 0; i < size; i++) {
      this.available.push(this.createFn());
    }
  }

  acquire() {
    const obj = this.available.pop() || this.createFn();
    this.inUse.add(obj);
    obj.visible = true;
    return obj;
  }

  release(obj) {
    if (!this.inUse.has(obj)) return;
    this.inUse.delete(obj);
    obj.visible  = false;
    obj.alpha    = 1;
    obj.scale.set(1);
    obj.filters  = null;
    obj.parent?.removeChild(obj);
    this.available.push(obj);
  }

  releaseAll() {
    [...this.inUse].forEach(obj => this.release(obj));
  }
}
```

### Slot Specific Pool
```js
// Symbol pool
const symbolPool = new ObjectPool(() => {
  const s = new PIXI.Sprite();
  s.anchor.set(0.5);
  s.visible = false;
  return s;
}, 50);

// Win particle pool
const coinPool = new ObjectPool(() => {
  const g = new PIXI.Graphics();
  g.beginFill(0xFFD700);
  g.drawCircle(0, 0, 4);
  g.endFill();
  g.visible = false;
  return g;
}, 200);

// Win celebration
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

---

## 📚 CHAPTER 22 — Reel State Machine

### Kyun Chahiye
```
Bina FSM:
❌ Free spins mein balance deduct
❌ Bonus mein spin clickable
❌ Double spin possible
❌ Invalid state bugs

FSM ke saath:
✅ Invalid states IMPOSSIBLE
✅ Game always correct state mein
✅ No bugs!
```

### Full FSM
```js
class SlotStateMachine {
  constructor(controller) {
    this.controller = controller;
    this.current    = 'IDLE';

    this.states = {
      IDLE: {
        enter:        () => this.onIdle(),
        canSpin:      true,
        canBetChange: true,
      },
      SPINNING: {
        enter:        () => this.onSpinning(),
        canSpin:      false,
        canBetChange: false,
      },
      EVALUATING: {
        enter:        () => this.onEvaluating(),
        canSpin:      false,
        canBetChange: false,
      },
      WIN_PRESENT: {
        enter:        () => this.onWinPresent(),
        canSpin:      false,
        canBetChange: false,
      },
      FREE_SPINNING: {
        enter:        () => this.onFreeSpinning(),
        canSpin:      false,
        canBetChange: false,
      },
      BONUS: {
        enter:        () => this.onBonus(),
        canSpin:      false,
        canBetChange: false,
      },
    };

    this.transitions = {
      IDLE:          ['SPINNING'],
      SPINNING:      ['EVALUATING'],
      EVALUATING:    ['WIN_PRESENT', 'FREE_INTRO', 'BONUS', 'IDLE'],
      WIN_PRESENT:   ['IDLE', 'FREE_INTRO'],
      FREE_INTRO:    ['FREE_SPINNING'],
      FREE_SPINNING: ['EVALUATING'],
      BONUS:         ['IDLE'],
    };
  }

  go(next) {
    if (!this.transitions[this.current].includes(next)) {
      console.error(`INVALID: ${this.current} → ${next}`);
      return;
    }
    console.log(`${this.current} → ${next}`);
    this.current = next;
    this.states[next].enter();
  }

  canSpin()      { return this.states[this.current].canSpin; }
  canBetChange() { return this.states[this.current].canBetChange; }

  onIdle() {
    this.controller.view.spinButton.enable();
  }

  onSpinning() {
    this.controller.view.spinButton.disable();
    this.controller.sound.play('spin');
  }

  onEvaluating() {
    const r = this.controller.lastResult;
    if (r.bonusTriggered)      this.go('BONUS');
    else if (r.freeSpins)      this.go('FREE_INTRO');
    else if (r.totalWin > 0)   this.go('WIN_PRESENT');
    else                        this.go('IDLE');
  }
}
```

---

## 📚 CHAPTER 23 — Game Loop

### Kya Hota Hai
```
Game Loop = Infinite loop jo har frame chalti hai

Update (logic) → Render (draw) → Update → Render...
60 baar per second = 60 FPS
```

### PixiJS Ticker
```js
// Basic game loop
app.ticker.add((delta) => {
  // delta = 1.0 at 60fps
  // delta = 2.0 at 30fps (frame drop hua)
  update(delta);
});

function update(delta) {
  reels.forEach(reel => reel.update(delta));
  particles.forEach(p  => p.update(delta));
  uiAnimations.update(delta);
}
```

### Custom Game Loop
```js
class GameLoop {
  constructor(app) {
    this.app      = app;
    this.systems  = [];
    this.isPaused = false;
    app.ticker.add(this.update.bind(this));
  }

  addSystem(system) { this.systems.push(system); }

  update(delta) {
    if (this.isPaused) return;
    this.systems.forEach(s => s.update(delta));
  }

  pause()  { this.isPaused = true;  }
  resume() { this.isPaused = false; }
}

// Systems add karo
const loop = new GameLoop(app);
loop.addSystem(reelSystem);
loop.addSystem(particleSystem);
loop.addSystem(uiSystem);
```

### Important Rules
```js
// 1. Delta time ALWAYS use karo
const SPEED = 600; // px per second
app.ticker.add((delta) => {
  reel.y += SPEED * (delta / 60);
});

// 2. FPS cap — battery save
app.ticker.maxFPS = 60;

// 3. Tab hidden pe pause karo
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    app.ticker.stop();
    soundManager.pause();
  } else {
    app.ticker.start();
    soundManager.resume();
  }
});

// 4. Performance monitor
let fps = 0;
app.ticker.add(() => {
  fps++;
  // Har second log karo
});
```

---

## 📚 CHAPTER 24 — RNG (Server vs Client)

### RNG Kya Hai
```
RNG = Random Number Generator
Decide karta hai kaunse symbols aayenge

2 types:
1. Client-side RNG ❌ ILLEGAL
2. Server-side RNG ✅ REQUIRED
```

### Client Side — KABHI MAT KARO
```js
// ❌ ILLEGAL — Real money slots mein
function clientSideRNG() {
  return Math.random();
}

// Hacker kya kar sakta hai:
// Browser console mein:
Math.random = () => 0.99; // Always jackpot!
// PROFIT 🤑 (illegal but possible!)
```

### Server Side — ALWAYS KARO
```js
// ✅ CORRECT flow

// CLIENT:
async function onSpinClick() {
  // Sirf request karo — result decide mat karo!
  const result = await fetch('/api/spin', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ bet: 10, sessionId }),
  });
  // Client sirf ANIMATE karta hai!
  await animateResult(result);
}

// SERVER (Node.js):
app.post('/api/spin', async (req, res) => {
  // 1. Validate
  const session = await validateSession(req.body.sessionId);

  // 2. Balance check
  if (player.balance < req.body.bet) {
    return res.status(400).json({ error: 'Low balance' });
  }

  // 3. RNG — Server pe!
  const symbols = generateRNG(gameConfig);

  // 4. Win calculate
  const wins     = calculateWins(symbols, req.body.bet);
  const totalWin = wins.reduce((s, w) => s + w.amount, 0);

  // 5. DB update
  player.balance -= req.body.bet;
  player.balance += totalWin;
  await player.save();

  // 6. Response
  res.json({ symbols, wins, totalWin, newBalance: player.balance });
});
```

### Anticipation — Server Result Use Karo
```js
// Server result pehle aa jaata hai
// Agar scatter aane wala hai — reel slow karo!
async function spinWithAnticipation(result) {
  for (let col = 0; col < 5; col++) {
    const exciting = result.symbols[col].includes('SCATTER')
                  || result.symbols[col].includes('WILD');

    // Exciting result aane wala hai → slow karo
    const stopDuration = exciting ? 1.5 : 0.6;
    reels[col].stop(result.symbols[col], stopDuration);
    await sleep(150);
  }
}
```

### Certified RNG
```
Real money slot ke liye certification zaroori:
→ GLI (Gaming Laboratories International)
→ BMM Testlabs
→ eCOGRA

Yeh certify karte hain:
✅ Truly random hai
✅ RTP accurate hai (e.g., 96%)
✅ No manipulation possible
✅ Results auditable hain

CLIENT SIDE RNG = LICENSE CANCEL! 🚫
```

---

## ⚡ QUICK REVISION — Sab Ek Jagah

```
Draw Calls    → Atlas = 1 draw call. Zyada = LAG
Lazy Loading  → Phase 1 minimum, background rest
Canvas        → CPU slow. WebGL → GPU fast
WebGL         → Triangles + Shaders + Batching
Pipeline      → Scene graph → Batch → GPU draw
Game Structure→ MVC: Controller + Model + View
Reel Spin     → 3 phases: ease-in → full → ease-out
Infinite Reel → Modulo wrapping. Neeche = upar aao
Object Pool   → acquire/release. No GC = smooth
State Machine → Invalid states impossible
Game Loop     → Ticker + delta. Tab hidden = pause
RNG           → SERVER SIDE ONLY — ILLEGAL client pe!
PixiJS        → WebGL 2D rendering library
Stage         → Root container
Ticker        → Game loop + delta time
Delta time    → Frame-rate independent
Mask          → addChild(mask) COMPULSORY!
Atlas         → 1 draw call = FAST
FSM           → Invalid states impossible
Cascade       → Async loop, har step await karo
Wild          → Koi bhi symbol replace
Scatter       → Kahi bhi, payline nahi chahiye
Free Spins    → Server free spin, bet nahi kata
Sticky Wild   → Persistent matrix
Expanding     → GSAP height + matrix update
Megaways      → Random heights, 117,649 ways max
```

---

## 🎯 Learning Path

```
Week 1-2:   JavaScript basics + OOPs
Week 3-4:   PixiJS setup + Sprites
Week 5-6:   Reel spin logic
Week 7-8:   Win calculation
Week 9-10:  Wild, Scatter features
Week 11-12: State machine + FSM
Month 4:    Server + RNG integration
Month 5:    Advanced features
Month 6:    Performance optimization
Month 7-8:  Complete slot game! 🎰
```

---

*Bhai yeh sab padh lo — Slot game developer ban jaoge! 💪🔥🎰*