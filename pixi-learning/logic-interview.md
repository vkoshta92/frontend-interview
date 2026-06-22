# Slot Game Development — Full Preparation Guide

> ZVKY Design Studio context ke liye — HTML5 / PixiJS slot games
> Topics: 2D Matrix Arrays, Reel Spin Logic, DI Container + Features, Character Movement, State Machine

---

## Table of Contents

1. [2D Matrix Array — Banane Ka Tarika](#1-2d-matrix-array)
2. [Reel Spin — Pura Logic](#2-reel-spin)
3. [DI Container + @Injectable — Feature Expansion](#3-di-container)
4. [Character Movement — Left/Right](#4-character-movement)
5. [State Machine — Basic to Advance](#5-state-machine)

---

<a name="1-2d-matrix-array"></a>
## 1. 2D Matrix Array — Banane Ka Tarika

Slot game me reels ka grid hamesha ek 2D matrix hota hai — rows x columns. Yeh samajhna foundation hai, baaki sab isi pe based hai.

### 1.1 Combined Function (matrix banao + random value daalo)

```javascript
function make2DMatrix(rows, cols, a, b, c) {
  const values = [a, b, c];
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const randomValue = values[Math.floor(Math.random() * values.length)];
      row.push(randomValue);
    }
    matrix.push(row);
  }

  return matrix;
}

// Example usage:
const matrix = make2DMatrix(3, 4, 1, 5, 9);
console.log(matrix);
```

**Output example** (3 rows, 4 columns, values 1/5/9 me se random):
```javascript
[
  [5, 1, 9, 5],
  [9, 9, 1, 1],
  [1, 5, 5, 9]
]
```

### 1.2 Separated Functions (single responsibility — better practice)

Production code me hamesha responsibilities separate rakho. Ek function sirf matrix banaye, doosra sirf random value de.

```javascript
// Function 1 — sirf matrix dimensions leta hai, default-filled matrix deta hai
function makeMatrix(rows, cols) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0); // default fill
    }
    matrix.push(row);
  }
  return matrix;
}

// Function 2 — sirf 3 values leta hai, randomly ek return karta hai
function getRandomValue(a, b, c) {
  const values = [a, b, c];
  return values[Math.floor(Math.random() * values.length)];
}

// Combine karke use karo
const rows = 3;
const cols = 4;
const matrix = makeMatrix(rows, cols);

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    matrix[i][j] = getRandomValue(1, 5, 9);
  }
}

console.log(matrix);
```

**Yeh approach kyun better hai:**
- `makeMatrix` aur `getRandomValue` dono independently test ho sakte hain
- `getRandomValue` ko kahin bhi reuse kar sakte ho (sirf matrix ke liye nahi)
- Slot game me symbols ki weight/probability add karni ho toh sirf `getRandomValue` change hoga, matrix logic untouched rahega

### 1.3 Flexible Version (slot symbols ke liye — variable arguments)

Real slot game me sirf 3 symbols nahi hote, 8-15 symbols ho sakte hain. Isliye `...values` (rest parameter) use karo:

```javascript
function getRandomValue(...values) {
  return values[Math.floor(Math.random() * values.length)];
}

// Ab kitne bhi symbols pass kar sakte ho
getRandomValue(1, 5, 9);                          // 3 values
getRandomValue('A', 'K', 'Q', 'J', '10', 'WILD');  // 6 symbols
```

### 1.4 Weighted Random (slot reels me symbol probability ke liye)

Real slot machines me har symbol ki same probability nahi hoti — WILD rare hota hai, low-value symbols common. Yeh weighted random kaise implement karte hain:

```javascript
function getWeightedRandomSymbol(symbolWeights) {
  // symbolWeights = { 'A': 10, 'K': 15, 'Q': 20, 'WILD': 2 }
  const totalWeight = Object.values(symbolWeights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [symbol, weight] of Object.entries(symbolWeights)) {
    if (random < weight) return symbol;
    random -= weight;
  }
}

const reelSymbolWeights = { 'A': 10, 'K': 15, 'Q': 20, 'J': 25, 'WILD': 2 };
const symbol = getWeightedRandomSymbol(reelSymbolWeights); // WILD rarely aayega
```

---

<a name="2-reel-spin"></a>
## 2. Reel Spin — Pura Logic Aur Explanation

### 2.1 Real-World Analogy

Socho ek lambi strip hai jisme symbols print hain — jaise purane mechanical slot machine ka physical reel. Strip ek loop me ghoomti hai: top se symbols nikalte hain, bottom se gayab hote hain, aur wapas top pe aa jaate hain (infinite loop, kyunki strip circular treat hoti hai).

### 2.2 Reel Spin Ke 4 Phases

```
1. SPIN START (acceleration)
2. SPINNING (constant speed loop)
3. SPIN STOP (deceleration + snap to position)
4. SETTLE (bounce/squash effect - optional polish)
```

### 2.3 Core Logic — Symbol Strip

Reel ek array hai symbols ka, jo **virtually infinite** treat hota hai (modulo wrap-around se):

```javascript
class Reel {
  constructor(symbolStrip, visibleRows = 3) {
    this.strip = symbolStrip; // e.g. ['A','K','Q','WILD','J','10', ...] - 20-30 symbols
    this.visibleRows = visibleRows;
    this.position = 0; // current scroll offset (float, for smooth movement)
    this.speed = 0;
    this.state = 'IDLE'; // IDLE | ACCELERATING | SPINNING | DECELERATING | STOPPED
    this.symbolHeight = 150; // px
    this.targetPosition = 0; // jaha rukna hai (final result)
  }

  // Strip se symbol nikalna given an index (wrap-around ke saath)
  getSymbolAt(index) {
    const len = this.strip.length;
    const wrappedIndex = ((index % len) + len) % len; // negative-safe modulo
    return this.strip[wrappedIndex];
  }

  update(delta) {
    switch (this.state) {
      case 'ACCELERATING':
        this.speed += this.acceleration * delta;
        if (this.speed >= this.maxSpeed) {
          this.speed = this.maxSpeed;
          this.state = 'SPINNING';
        }
        this.position += this.speed * delta;
        break;

      case 'SPINNING':
        this.position += this.speed * delta;
        // Yahan check hota hai - server se result aa gaya kya? Agar haan, DECELERATING start karo
        break;

      case 'DECELERATING':
        this.speed -= this.deceleration * delta;
        this.position += this.speed * delta;

        // Jab target position ke close pahunch jao aur speed slow ho, snap karo
        if (this.isCloseToTarget() && this.speed < this.snapThreshold) {
          this.position = this.targetPosition;
          this.speed = 0;
          this.state = 'STOPPED';
          this.onReelStopped(); // callback - bounce effect, sound, etc.
        }
        break;
    }

    this.renderSymbols(); // position ke basis par symbols ko screen pe place karo
  }

  renderSymbols() {
    const topSymbolIndex = Math.floor(this.position / this.symbolHeight);
    const offsetY = this.position % this.symbolHeight;

    for (let row = 0; row < this.visibleRows + 1; row++) { // +1 buffer row
      const symbol = this.getSymbolAt(topSymbolIndex + row);
      const yPos = (row * this.symbolHeight) - offsetY;
      this.symbolSprites[row].texture = this.getTexture(symbol);
      this.symbolSprites[row].y = yPos;
    }
  }
}
```

### 2.4 Important Concept — Result Pehle Aata Hai, Animation Baad Me

Yeh **sabse important point** hai jo naye developers miss karte hain:

```
GALAT SOCH: Reel spin hoti hai -> random symbols aate hain -> result decide hota hai
SAHI SOCH:  Server se result already decide ho chuka hai -> ab us result tak
            pohochne ke liye animation chalti hai (RNG fairness/regulation ke liye)
```

```javascript
async function spinReel() {
  // Step 1: Animation start - sirf visual hai, result pata nahi
  reel.state = 'ACCELERATING';

  // Step 2: Backend call - YAHI result decide karta hai (RNG server-side)
  const result = await api.getSpinResult(); // { symbols: ['A','WILD','K'], stopIndex: 47 }

  // Step 3: Result ke basis par target position calculate karo
  reel.targetPosition = result.stopIndex * reel.symbolHeight;

  // Step 4: Minimum spin time complete hone do (UX ke liye, turant nahi rukna)
  await waitForMinSpinDuration(); // e.g. 1.5 sec minimum

  // Step 5: Ab deceleration start karo target ki taraf
  reel.state = 'DECELERATING';
}
```

Isliye animation aur game logic **decoupled** rehte hain — animation sirf "result ko visually represent" karta hai, decide nahi karta. Yeh regulatory compliance ke liye bhi zaroori hai (RNG fairness audits).

### 2.5 Stagger Effect (multiple reels ek saath)

5 reels ek saath start hote hain but stop **staggered** hote hain (left to right, thoda delay ke saath) — yeh visual polish hai jo har slot game me dikhta hai:

```javascript
function spinAllReels(reels, results) {
  reels.forEach((reel, i) => {
    reel.start();
  });

  reels.forEach((reel, i) => {
    const stopDelay = i * 200; // har reel 200ms baad rukta hai apne se pehle wale se
    setTimeout(() => reel.stop(results[i]), baseSpinTime + stopDelay);
  });
}
```

### 2.6 Quick Summary Table

| Phase | Kya hota hai | Key variable |
|---|---|---|
| ACCELERATING | Speed zero se max tak badhti hai | `acceleration` |
| SPINNING | Constant max speed, result wait karta hai | `maxSpeed` |
| DECELERATING | Speed kam hoti hai, target ki taraf | `deceleration`, `targetPosition` |
| STOPPED | Snap exact position pe, callback trigger | `snapThreshold` |

---

<a name="3-di-container"></a>
## 3. DI Container + @Injectable — Wild, Random Wild, Hold & Spin

### 3.1 DI Container Kya Solve Karta Hai

**Problem without DI:**
```javascript
class WildFeature {
  constructor() {
    this.reelManager = new ReelManager(); // tightly coupled
    this.soundManager = new SoundManager(); // hard to test/mock
    this.scoreManager = new ScoreManager();
  }
}
```
Yahan `WildFeature` khud apni dependencies bana raha hai — agar `ReelManager` badalna ho ya mock karna ho testing ke liye, mushkil hai.

**DI ka solution:** Dependencies *inject* hoti hain bahar se, class khud nahi banata.

### 3.2 Basic DI Container Structure

```javascript
// Container - sab dependencies ka registry
class DIContainer {
  constructor() {
    this.providers = new Map(); // token -> factory/class
    this.instances = new Map(); // token -> singleton instance (agar singleton hai)
  }

  register(token, factoryOrClass, options = { singleton: true }) {
    this.providers.set(token, { factoryOrClass, options });
  }

  resolve(token) {
    if (this.instances.has(token)) {
      return this.instances.get(token); // already created, reuse
    }

    const provider = this.providers.get(token);
    if (!provider) throw new Error(`No provider for ${token}`);

    // Constructor ke dependencies ko recursively resolve karo
    const deps = (provider.factoryOrClass.injectParams || [])
      .map(depToken => this.resolve(depToken));

    const instance = new provider.factoryOrClass(...deps);

    if (provider.options.singleton) {
      this.instances.set(token, instance);
    }
    return instance;
  }
}

// @Injectable decorator - class pe metadata lagata hai
function Injectable(dependencies = []) {
  return function (target) {
    target.injectParams = dependencies; // container ko batata hai kya chahiye
    return target;
  };
}
```

### 3.3 Usage — Core Services

```javascript
@Injectable()
class ReelManager {
  spin() { /* ... */ }
}

@Injectable()
class SoundManager {
  play(sfx) { /* ... */ }
}

@Injectable([ReelManager, SoundManager]) // yeh dependencies maangta hai
class SpinController {
  constructor(reelManager, soundManager) {
    this.reelManager = reelManager;
    this.soundManager = soundManager;
  }

  triggerSpin() {
    this.reelManager.spin();
    this.soundManager.play('spin_start');
  }
}

// Registration (app bootstrap me ek baar)
const container = new DIContainer();
container.register(ReelManager, ReelManager);
container.register(SoundManager, SoundManager);
container.register(SpinController, SpinController);

const spinController = container.resolve(SpinController);
// ReelManager aur SoundManager automatically inject ho gaye!
```

### 3.4 Teen Features Add Karna — Wild, Random Wild, Hold & Spin

Har feature ko **independent injectable service** banao, aur ek **FeatureOrchestrator** unko coordinate kare.

```javascript
// --- Feature 1: Basic Wild ---
@Injectable([ReelManager])
class WildFeature {
  constructor(reelManager) {
    this.reelManager = reelManager;
  }

  isWild(symbol) {
    return symbol === 'WILD';
  }

  // Wild substitute logic - paylines check karte waqt
  resolveSymbolForPayline(symbol, expectedSymbol) {
    return this.isWild(symbol) ? expectedSymbol : symbol;
  }
}

// --- Feature 2: Random Wild (depends on WildFeature + RNG service) ---
@Injectable([ReelManager, RNGService, WildFeature])
class RandomWildFeature {
  constructor(reelManager, rngService, wildFeature) {
    this.reelManager = reelManager;
    this.rng = rngService;
    this.wildFeature = wildFeature;
    this.triggerChance = 0.15; // 15% chance har spin pe
  }

  async maybeTrigger(spinResult) {
    if (this.rng.chance(this.triggerChance)) {
      const randomPositions = this.rng.pickRandomPositions(spinResult.grid, 2); // 2 random cells
      randomPositions.forEach(pos => {
        spinResult.grid[pos.row][pos.col] = 'WILD'; // overwrite with wild
      });
      await this.playRandomWildAnimation(randomPositions);
    }
    return spinResult;
  }
}

// --- Feature 3: Hold & Spin (independent, but needs ReelManager + SoundManager) ---
@Injectable([ReelManager, SoundManager])
class HoldAndSpinFeature {
  constructor(reelManager, soundManager) {
    this.reelManager = reelManager;
    this.soundManager = soundManager;
    this.maxRespins = 3;
    this.heldPositions = new Set(); // jo symbols "lock" ho gaye
  }

  async start(initialGrid) {
    this.lockTriggerSymbols(initialGrid);
    let respinsLeft = this.maxRespins;

    while (respinsLeft > 0) {
      const newGrid = await this.respin(); // sirf non-held positions spin karte hain
      const newLocks = this.lockTriggerSymbols(newGrid);

      respinsLeft = newLocks > 0 ? this.maxRespins : respinsLeft - 1;

      if (this.isGridFull()) break; // sab positions lock ho gaye = jackpot
    }
    return this.calculatePayout();
  }
}

// --- Orchestrator: sab features ko coordinate karta hai ---
@Injectable([ReelManager, RandomWildFeature, HoldAndSpinFeature, WildFeature])
class SpinFeatureOrchestrator {
  constructor(reelManager, randomWild, holdAndSpin, wildFeature) {
    this.reelManager = reelManager;
    this.randomWild = randomWild;
    this.holdAndSpin = holdAndSpin;
    this.wildFeature = wildFeature;
  }

  async processSpin(spinResult) {
    // Pipeline: ek feature ka output dusre ka input
    spinResult = await this.randomWild.maybeTrigger(spinResult);

    if (spinResult.triggersHoldAndSpin) {
      spinResult = await this.holdAndSpin.start(spinResult.grid);
    }

    spinResult.payout = this.calculatePayoutWithWilds(spinResult);
    return spinResult;
  }
}
```

### 3.5 Yeh Approach Kyun Important Hai

- Har feature **independently testable** hai (mock dependencies inject karke)
- Naya feature add karna = nayi `@Injectable` class banao, orchestrator me plug karo
- Existing code touch nahi karna padta (Open/Closed Principle)
- Feature flags se easily enable/disable kar sakte ho registration time pe

### 3.6 Quick Reference

| Concept | Matlab |
|---|---|
| `@Injectable()` | Class ko DI container ke liye eligible banata hai, dependencies declare karta hai |
| `register()` | Container ko batata hai kis token ke liye konsi class use karni hai |
| `resolve()` | Container se instance maangna — dependencies automatically inject hoti hain |
| `singleton: true` | Ek hi instance reuse hoga; `false` har baar naya banega |
| Orchestrator pattern | Multiple independent features ko ek jagah coordinate karna |

---

<a name="4-character-movement"></a>
## 4. Character Movement — Left/Right Kaise Hota Hai

### 4.1 Concept — 3 Cheezein Chahiye

1. **Position** (x coordinate) — character kaha hai
2. **Velocity** — kis direction me, kitni speed se move karna hai
3. **Facing flag** — sprite ko flip karna hai ya nahi (left dekhe ya right)

### 4.2 Full Code

```javascript
class Character {
  constructor(sprite) {
    this.sprite = sprite; // PixiJS sprite
    this.x = sprite.x;
    this.velocity = 0;
    this.speed = 5; // px per frame
    this.facing = 1; // 1 = right, -1 = left
  }

  moveRight() {
    this.facing = 1;
    this.velocity = this.speed;
    this.sprite.scale.x = Math.abs(this.sprite.scale.x); // flip sahi taraf
  }

  moveLeft() {
    this.facing = -1;
    this.velocity = -this.speed;
    this.sprite.scale.x = -Math.abs(this.sprite.scale.x); // mirror flip
  }

  stop() {
    this.velocity = 0;
  }

  update(delta) {
    this.x += this.velocity * delta;

    // Boundary check (screen ke bahar na jaaye)
    const minX = 0;
    const maxX = app.screen.width - this.sprite.width;
    this.x = Math.max(minX, Math.min(maxX, this.x));

    this.sprite.x = this.x;
  }
}

// PixiJS app loop me
const character = new Character(characterSprite);

app.ticker.add((delta) => {
  character.update(delta);
});

// Keyboard input se control
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') character.moveRight();
  if (e.key === 'ArrowLeft') character.moveLeft();
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') character.stop();
});
```

### 4.3 Sprite Flip Ka Trick

`scale.x` ko negative karne se sprite horizontally mirror ho jaata hai — naya texture load nahi karna padta left-facing ke liye, same image reuse hoti hai.

```javascript
this.sprite.scale.x = Math.abs(this.sprite.scale.x);  // right facing
this.sprite.scale.x = -Math.abs(this.sprite.scale.x);  // left facing (mirrored)
```

### 4.4 Quick Reference

| Variable | Role |
|---|---|
| `x` | Current position (float) |
| `velocity` | Direction (+/-) aur speed combined |
| `facing` | Sprite flip ke liye flag (1 = right, -1 = left) |
| `update(delta)` | Har frame call hota hai, position update karta hai |
| Boundary clamp | `Math.max(minX, Math.min(maxX, x))` se screen ke bahar jaane se rokta hai |

---

<a name="5-state-machine"></a>
## 5. State Machine — Basic to Advance Pura Concept

### 5.1 Basic Samajh — Real Analogy

Socho **traffic light** — woh hamesha ek fixed state me hota hai (RED, YELLOW, GREEN), aur sirf defined rules se ek state se dusre me jaata hai. Kabhi RED se directly GREEN nahi jaata — pehle YELLOW se guzarna padta hai.

> **State machine** = ek system jo kisi bhi waqt sirf ek fixed "state" me ho sakta hai, aur defined "transitions" hi allowed hain state badalne ke liye.

### 5.2 Teen Core Concepts

```
1. STATES       - possible conditions (IDLE, SPINNING, WIN_DISPLAY, etc.)
2. TRANSITIONS  - rules ki kis state se kis state me jaa sakte hain
3. EVENTS       - trigger jo transition cause karte hain (button click, timer end, etc.)
```

### 5.3 Level 1 — Basic State Machine (slot game context)

```javascript
class SlotGameStateMachine {
  constructor() {
    this.state = 'IDLE';

    // Transition table - yahi state machine ka "dimaag" hai
    this.transitions = {
      IDLE:          { SPIN_PRESSED: 'SPINNING' },
      SPINNING:      { REELS_STOPPED: 'EVALUATING' },
      EVALUATING:    { WIN_FOUND: 'WIN_DISPLAY', NO_WIN: 'IDLE' },
      WIN_DISPLAY:   { ANIMATION_DONE: 'IDLE' },
    };
  }

  send(event) {
    const nextState = this.transitions[this.state]?.[event];

    if (!nextState) {
      console.warn(`Invalid transition: ${event} from ${this.state}`);
      return false; // illegal transition, ignore
    }

    console.log(`${this.state} --[${event}]--> ${nextState}`);
    this.state = nextState;
    this.onEnterState(nextState);
    return true;
  }

  onEnterState(state) {
    switch (state) {
      case 'SPINNING': this.startSpinAnimation(); break;
      case 'EVALUATING': this.calculateWins(); break;
      case 'WIN_DISPLAY': this.showWinAnimation(); break;
    }
  }
}

// Usage
const fsm = new SlotGameStateMachine();
fsm.send('SPIN_PRESSED'); // IDLE -> SPINNING
fsm.send('SPIN_PRESSED'); // ignored - already SPINNING, isse IDLE me hi allowed tha
fsm.send('REELS_STOPPED'); // SPINNING -> EVALUATING
```

**Yeh kyun powerful hai:** Agar player rapid-click kare spin button, `SPINNING` state me `SPIN_PRESSED` event ka koi defined transition nahi hai — toh automatically ignore ho jaata hai. Bina ek bhi `if (isSpinning) return;` check likhe.

### 5.4 Level 2 — Guard Conditions (intermediate)

Kabhi transition condition pe depend karta hai, sirf event pe nahi:

```javascript
class SlotGameStateMachine {
  send(event, context = {}) {
    const transition = this.transitions[this.state]?.[event];
    if (!transition) return false;

    // Guard - extra condition check karo
    if (transition.guard && !transition.guard(context)) {
      console.warn('Guard failed, transition blocked');
      return false;
    }

    this.state = transition.target;
    this.onEnterState(this.state, context);
    return true;
  }
}

// Example: balance check karna spin se pehle
this.transitions = {
  IDLE: {
    SPIN_PRESSED: {
      target: 'SPINNING',
      guard: (ctx) => ctx.balance >= ctx.betAmount // sirf tab transition hoga
    }
  }
};

fsm.send('SPIN_PRESSED', { balance: 50, betAmount: 100 }); // guard fail, blocked
```

### 5.5 Level 3 — Hierarchical / Nested State Machines (advance)

Real slot games me **Hold & Spin** jaisa feature khud ek **sub-state-machine** hota hai andar:

```javascript
class HoldAndSpinFSM {
  constructor() {
    this.state = 'TRIGGERED';
    this.respinsLeft = 3;

    this.transitions = {
      TRIGGERED:    { START_RESPIN: 'RESPINNING' },
      RESPINNING:   { SYMBOLS_LANDED: 'CHECKING_LOCKS' },
      CHECKING_LOCKS: {
        NEW_LOCK_FOUND: 'RESPINNING',     // reset respin counter, continue
        NO_NEW_LOCK: 'CHECKING_RESPINS',
        GRID_FULL: 'JACKPOT'
      },
      CHECKING_RESPINS: {
        RESPINS_REMAIN: 'RESPINNING',
        RESPINS_EXHAUSTED: 'COMPLETE'
      },
      JACKPOT:  { ANIMATION_DONE: 'COMPLETE' },
      COMPLETE: {} // terminal state - feature ka exit
    };
  }
}

// Parent state machine isko ek "black box" ki tarah treat karta hai
class MainGameFSM {
  transitions = {
    EVALUATING: {
      HOLD_SPIN_TRIGGERED: 'HOLD_AND_SPIN_ACTIVE' // delegate to sub-FSM
    },
    HOLD_AND_SPIN_ACTIVE: {
      HOLD_SPIN_COMPLETE: 'WIN_DISPLAY' // sub-FSM ka COMPLETE event bubble up hota hai
    }
  };
}
```

**Yahan concept hai "composition":** Parent FSM ko Hold & Spin ki internal complexity (respins, locks, jackpot logic) pata nahi hona chahiye — usko sirf ek event chahiye jab feature complete ho. Yeh exactly section 3 ke Wild, Random Wild, Hold & Spin features ko orchestrator ke through manage karne wala concept hai.

### 5.6 Full State Flow (overview)

```
IDLE
  --SPIN_PRESSED--> SPINNING
SPINNING
  --REELS_STOPPED--> EVALUATING
EVALUATING
  --WIN_FOUND--> WIN_DISPLAY
  --NO_WIN--> IDLE
  --HOLD_TRIGGER--> HOLD_AND_SPIN (nested sub-FSM)
WIN_DISPLAY
  --ANIMATION_DONE--> IDLE
HOLD_AND_SPIN
  --HOLD_SPIN_COMPLETE--> WIN_DISPLAY
```

### 5.7 Quick Reference

| Level | Concept | Use case |
|---|---|---|
| Basic | Transition table + `send(event)` | Simple flows, IDLE -> SPINNING -> EVALUATING |
| Intermediate | Guard conditions | Balance check, validation before transition |
| Advance | Nested/hierarchical FSM | Hold & Spin, Free Games — complex sub-features |

---

## Final Summary — Sab Kaise Connect Hota Hai

```
State Machine      -> decide karta hai abhi konsa "phase" chal raha hai
Reel Spin Logic     -> SPINNING state ke andar ka implementation
DI + Features       -> EVALUATING state me jo features trigger hote hain
                       (Wild, Random Wild, Hold & Spin)
Character Movement  -> same physics principle (position + velocity),
                       bonus games ya avatar ke liye
2D Matrix            -> reel grid ka underlying data structure
```

**Practical next step:** Agar ZVKY ke project me already DI container hai, toh `SlotGameStateMachine` ko bhi `@Injectable` bana do, aur `SpinFeatureOrchestrator` ke saath wire karo — taaki state transition pe automatically correct feature trigger ho.