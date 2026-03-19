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

## ⚡ QUICK REVISION — Sab Ek Jagah

```
PixiJS        → WebGL 2D rendering library
Stage         → Root container
Container     → Children rakh sakta hai
Ticker        → Game loop + delta time
Delta time    → Frame-rate independent animation
Mask          → addChild(mask) COMPULSORY!
Atlas         → 1 draw call = FAST
Pool          → No GC = No frame drops
FSM           → Invalid states impossible
Cascade       → Async loop, har step await karo
Wild          → Koi bhi symbol replace
Scatter       → Kahi bhi, payline nahi chahiye
Free Spins    → Server free spin, bet nahi kata
Sticky Wild   → Persistent matrix
Expanding     → GSAP height + matrix update
Megaways      → Random heights, 117,649 ways max
RNG           → SERVER SIDE ONLY — ILLEGAL client pe!
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