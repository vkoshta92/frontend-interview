# 🎰 Slot Machine — ALL Features Complete Guide
> Random Wild + Dynamic Reel + Sab Features — Hinglish mein Logic + Code

---

# 🧠 PEHLE SAMJHO — Basic Concepts

## Symbol Matrix
```
Slot mein ek 2D grid hoti hai:

     Col0    Col1    Col2    Col3    Col4
Row0 [ 🍒 ][ 💎 ][ 7️⃣ ][ 🍋 ][ ⭐ ]
Row1 [ 🃏 ][ 🍒 ][ 🍒 ][ 🍒 ][ 🔔 ]  ← Payline (WIN!)
Row2 [ ⭐ ][ 🍋 ][ 💎 ][ 7️⃣ ][ 🍒 ]

symbolMatrix[col][row] = symbol name
symbolMatrix[0][1] = '🃏' (Wild)
symbolMatrix[1][1] = '🍒' (Cherry)
```

## Constants
```js
const COLS         = 5;
const ROWS         = 3;
const SYMBOL_W     = 100;
const SYMBOL_H     = 100;
const REEL_W       = 100;
const REEL_H       = 300; // 3 × 100
const SPIN_SPEED   = 50;  // pixels per frame

const SYMBOLS = ['CHERRY','LEMON','ORANGE','GRAPE','BELL','SEVEN','DIAMOND'];
const WILD    = 'WILD';
const SCATTER = 'SCATTER';
const BONUS   = 'BONUS';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
```

---

# 🎡 REEL SYSTEM — Foundation

## Reel Kya Hai
```
Reel = Ek vertical strip jisme symbols hain
Strip neeche scroll karti hai
Player ko sirf 3 symbols dikhte hain (window)
Mask lagata hai — baaki chhup jaata hai

Strip visualize karo:
[🍒] ← hidden (upar)
[💎]
─────────── ← Mask start
[🎰] ← Row 0  (visible)
[🍋] ← Row 1  (visible)  Player yeh dekhta hai
[⭐] ← Row 2  (visible)
─────────── ← Mask end
[🔔]
[🃏] ← hidden (neeche)
```

## Basic Reel Class
```js
class ReelView {
  constructor(colIndex, xPosition) {
    this.colIndex  = colIndex;
    this.position  = 0;      // Scroll position
    this.speed     = 0;      // Current speed
    this.isSpinning = false;
    this.symbols   = [];     // Sprite objects
    this.stripData = [];     // Symbol names

    // Container
    this.container = new PIXI.Container();
    this.container.x = xPosition;

    // Mask — symbols boundary ke andar rahen!
    this.setupMask();

    // Symbols create karo
    this.createSymbols();
  }

  setupMask() {
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, REEL_W, REEL_H);
    mask.endFill();
    this.container.mask = mask;
    this.container.addChild(mask); // COMPULSORY — warna kaam nahi karega!
  }

  createSymbols() {
    // ROWS + 2 symbols — upar aur neeche buffer ke liye
    for (let i = 0; i < ROWS + 2; i++) {
      const sprite = new PIXI.Sprite();
      sprite.width  = SYMBOL_W;
      sprite.height = SYMBOL_H;
      sprite.y      = (i - 1) * SYMBOL_H; // -1 = pehla symbol upar chhupa
      this.container.addChild(sprite);
      this.symbols.push(sprite);
    }
  }

  // Game loop mein har frame
  update(delta) {
    if (!this.isSpinning) return;

    this.position += this.speed * delta;
    this.updateSymbolPositions();
  }

  updateSymbolPositions() {
    const totalH = this.symbols.length * SYMBOL_H;

    this.symbols.forEach((sym, i) => {
      const rawY    = i * SYMBOL_H - this.position;
      const wrapped = ((rawY % totalH) + totalH) % totalH;

      // Upar se aaya — naya random symbol assign karo (spin ke dauran)
      if (wrapped < SYMBOL_H && sym.prevY > totalH - SYMBOL_H) {
        if (this.isSpinning && !this.isStopping) {
          sym.texture = this.getRandomTexture();
        }
      }

      sym.y     = wrapped;
      sym.prevY = wrapped;
    });
  }

  getRandomTexture() {
    const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    return PIXI.Texture.from(`${sym}.png`);
  }
}
```

---

# ♾️ FEATURE 1 — INFINITE REEL SPIN

## Logic Samjho
```
Problem:
Strip 5 symbols ki hai — scroll karte karte khatam!

Solution — Modulo Magic:
Symbol neeche gaya → upar le aao
Player ko lagta hai infinite strip hai!

Position 0:   [A][B][C][D][E]
Position 100: [E][A][B][C][D] ← E upar aa gaya
Position 200: [D][E][A][B][C]
Position 300: [C][D][E][A][B]
Infinite loop! ✅
```

## Code
```js
// Ticker mein har frame yeh chalega
app.ticker.add((delta) => {
  reels.forEach(reel => reel.update(delta));
});

update(delta) {
  this.position += this.speed * delta;

  this.symbols.forEach((sym, i) => {
    const totalH = this.symbols.length * SYMBOL_H;

    // Raw position without wrapping
    const rawY = i * SYMBOL_H - this.position;

    // DOUBLE MODULO — negative numbers bhi handle!
    // Normal modulo: -10 % 500 = -10 (wrong!)
    // Double modulo: ((-10 % 500) + 500) % 500 = 490 (correct!)
    sym.y = ((rawY % totalH) + totalH) % totalH;

    // Upar se aaya? → Naya symbol
    if (sym.y < SYMBOL_H && sym.prevY > totalH - SYMBOL_H) {
      if (!this.isStopping) {
        sym.texture = this.getRandomTexture();
      } else {
        // Stopping hai → result se texture lo
        sym.texture = this.resultTextures.shift();
      }
    }
    sym.prevY = sym.y;
  });
}
```

---

# 🎯 FEATURE 2 — DYNAMIC REEL

## Kya Hota Hai
```
Normal reel = Fixed 3 rows hamesha

Dynamic Reel = Rows CHANGE hoti hain!
Reasons:
1. Megaways — har spin heights random
2. Special event — reel expand hoti hai
3. Feature trigger — extra rows milte hain

Before:        After expand:
[🍒]           [🌟] ← Extra row!
[💎]           [🍒]
[🍋]           [💎]
               [🍋]
               [⭐] ← Extra row!
```

## Implementation
```js
class DynamicReel extends ReelView {
  constructor(colIndex, xPosition) {
    super(colIndex, xPosition);
    this.currentRows  = ROWS;       // Abhi kitne rows hain
    this.targetRows   = ROWS;       // Kitne rows hone chahiye
    this.currentHeight = REEL_H;
  }

  // Rows change karo with animation
  async setRows(newRows) {
    if (newRows === this.currentRows) return;

    this.targetRows = newRows;
    const newHeight = newRows * SYMBOL_H;

    // Height animate karo
    await gsap.to(this, {
      currentHeight: newHeight,
      duration:      0.4,
      ease:          'back.out(1)',
      onUpdate:      () => this.updateMask(),
    });

    this.currentRows = newRows;

    // New symbols add ya remove karo
    this.adjustSymbolCount(newRows);
  }

  updateMask() {
    // Mask ko naya height do
    const mask = this.container.mask;
    mask.clear();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, REEL_W, this.currentHeight);
    mask.endFill();
  }

  adjustSymbolCount(targetRows) {
    const needed = targetRows + 2; // +2 buffer

    // Zyada chahiye?
    while (this.symbols.length < needed) {
      const sprite  = new PIXI.Sprite();
      sprite.width  = SYMBOL_W;
      sprite.height = SYMBOL_H;
      this.container.addChild(sprite);
      this.symbols.push(sprite);
    }

    // Kam chahiye?
    while (this.symbols.length > needed) {
      const removed = this.symbols.pop();
      removed.destroy();
    }
  }

  // Megaways ke liye random height
  generateRandomHeight() {
    const min = 2, max = 7;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}

// Megaways spin mein:
async function megawaysSpin() {
  // Har reel ki height random karo
  const newHeights = reels.map(r => r.generateRandomHeight());

  // Animate all reels simultaneously
  await Promise.all(
    reels.map((reel, i) => reel.setRows(newHeights[i]))
  );

  // Ways calculate karo
  const ways = newHeights.reduce((a, b) => a * b, 1);
  console.log(`This spin: ${ways} ways!`);
  waysDisplay.text = `${ways.toLocaleString()} WAYS`;

  return newHeights;
}
```

---

# 🃏 FEATURE 3 — WILD SYMBOL

## Logic
```
Wild = Joker. Koi bhi symbol replace karta hai.

Line: [🍒][🃏][🍒][🍋][⭐]
        ↑ Base  ↑ Wild replaces Cherry
Result: 3 Cherry WIN! ✅
```

## Code
```js
function evaluateLine(line) {
  // Step 1: Wild chhod ke base symbol find karo
  const base = line.find(s => s !== WILD && s !== SCATTER);

  // Sab wild? Bhi win!
  if (!base) return { win: true, symbol: WILD, count: line.length };

  // Step 2: Left se right count — consecutive!
  let count = 0;
  for (const sym of line) {
    if (sym === base || sym === WILD) count++;
    else break; // Chain toot gayi — stop!
  }

  return count >= 3
    ? { win: true, symbol: base, count }
    : { win: false };
}

// Wild land hone ka animation
async function animateWildLanding(col, row) {
  const sprite = reels[col].symbols[row].sprite;

  // Scale bounce
  sprite.scale.set(0);
  await gsap.to(sprite.scale, {
    x: 1, y: 1,
    duration: 0.4,
    ease:     'back.out(2.5)',
  });

  // Glow add karo
  sprite.filters = [
    new GlowFilter({ color: 0xFF6600, outerStrength: 4, innerStrength: 1 })
  ];
}
```

---

# 🎲 FEATURE 4 — RANDOM WILD

## Kya Hota Hai
```
Spin ke BAAD — randomly koi bhi symbol WILD ban jaata hai!
No pattern — pure surprise! 🎉

Normal spin result:
[🍒][💎][🍋][⭐][🔔]

Random Wild fires:
[🍒][💎][🃏][⭐][🔔]
          ↑ Suddenly WILD!
```

## Types
```
Type 1: Simple Random Wild
  → 1-3 random positions pe wild appear

Type 2: Random Wild Reel
  → Poori ek reel suddenly wild ho jaati hai

Type 3: Random Wild Positions
  → Server predefined positions bhejta hai

Type 4: Roaming Wild
  → Wild ek jagah appear, phir move karta hai
```

## Code — Simple Random Wild
```js
class RandomWildManager {
  constructor() {
    this.TRIGGER_CHANCE = 0.15;  // 15% chance har spin pe
    this.MAX_WILDS      = 3;     // Maximum 3 wilds
  }

  // Spin ke baad call karo
  async applyRandomWilds(symbolMatrix) {
    // Chance check karo
    if (Math.random() > this.TRIGGER_CHANCE) return symbolMatrix;

    // Kitne wilds?
    const wildCount = 1 + Math.floor(Math.random() * this.MAX_WILDS);

    // Random positions choose karo
    const positions = this.getRandomPositions(wildCount, symbolMatrix);

    // Animate karo
    await this.animateWildAppearance(positions, symbolMatrix);

    return symbolMatrix;
  }

  getRandomPositions(count, matrix) {
    const allPositions = [];

    // Sab available positions collect karo
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        // Scatter pe wild mat daalo
        if (matrix[col][row] !== SCATTER) {
          allPositions.push({ col, row });
        }
      }
    }

    // Shuffle karo
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    // Pehle `count` positions lo
    return allPositions.slice(0, count);
  }

  async animateWildAppearance(positions, matrix) {
    // Sab simultaneously animate karo — thoda stagger
    const animations = positions.map(({ col, row }, i) =>
      sleep(i * 150).then(async () => {
        const sprite = reels[col].symbols[row].sprite;

        // Flash effect
        await gsap.to(sprite, { alpha: 0, duration: 0.1 });

        // Wild texture set karo
        sprite.texture = PIXI.Texture.from('wild.png');
        matrix[col][row] = WILD;

        // Appear
        await gsap.to(sprite, { alpha: 1, duration: 0.1 });

        // Glow
        sprite.filters = [new GlowFilter({ color: 0x00FFFF, outerStrength: 5 })];

        // Particles spawn
        spawnParticles(
          col * REEL_W + REEL_W/2,
          row * SYMBOL_H + SYMBOL_H/2,
          0x00FFFF,
          15
        );
      })
    );

    await Promise.all(animations);
    await sleep(500); // Sab dikhne do
  }
}

// Random Wild Reel — poori reel wild
class RandomWildReelManager {
  async triggerWildReel(symbolMatrix) {
    // Random reel choose karo
    const wildCol = Math.floor(Math.random() * COLS);

    console.log(`Wild Reel: Column ${wildCol}!`);

    // Reel flash + expand
    const reel = reels[wildCol];
    await this.animateWildReel(reel, wildCol, symbolMatrix);

    return symbolMatrix;
  }

  async animateWildReel(reel, col, matrix) {
    // Flash karo
    for (let flash = 0; flash < 3; flash++) {
      await gsap.to(reel.container, { alpha: 0.3, duration: 0.1 });
      await gsap.to(reel.container, { alpha: 1,   duration: 0.1 });
    }

    // Puri reel wild kar do
    for (let row = 0; row < ROWS; row++) {
      reels[col].symbols[row].sprite.texture = PIXI.Texture.from('wild.png');
      reels[col].symbols[row].sprite.filters = [
        new GlowFilter({ color: 0xFF6600, outerStrength: 5 })
      ];
      matrix[col][row] = WILD;
      await sleep(100); // Stagger
    }

    // Big glow on whole reel
    reel.container.filters = [
      new GlowFilter({ color: 0xFF6600, outerStrength: 8 })
    ];
  }
}
```

---

# 🔥 FEATURE 5 — EXPANDING WILD

## Logic
```
Wild ek cell mein land karta hai
Phir POORI column expand karta hai

Before:        After expand:
[🍒]           [🔥] ← Expanded Wild
[🃏] ← Wild   [🔥] ← Expanded Wild
[🍋]           [🔥] ← Expanded Wild
```

## Code
```js
class ExpandingWildManager {
  async processExpandingWilds(symbolMatrix) {
    const expandPositions = [];

    // Wild positions find karo
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (symbolMatrix[col][row] === WILD) {
          expandPositions.push(col);
          break; // Ek baar per column
        }
      }
    }

    if (expandPositions.length === 0) return symbolMatrix;

    // Sab expand karo
    await Promise.all(
      expandPositions.map(col => this.expandColumn(col, symbolMatrix))
    );

    return symbolMatrix;
  }

  async expandColumn(col, matrix) {
    // Existing symbols hide karo
    reels[col].symbols.forEach(sym => {
      gsap.to(sym.sprite, { alpha: 0, duration: 0.15 });
    });

    // Expanding wild sprite banao
    const expandSprite    = new PIXI.Sprite(PIXI.Texture.from('wild_expand.png'));
    expandSprite.width    = REEL_W;
    expandSprite.height   = 0;    // Chhota se shuru
    expandSprite.y        = REEL_H / 2; // Center se
    reels[col].container.addChild(expandSprite);

    // Expand animation — center se dono taraf
    await gsap.to(expandSprite, {
      height:   REEL_H,
      y:        0,
      duration: 0.5,
      ease:     'back.out(1.2)',
    });

    // Glow lagao
    expandSprite.filters = [
      new GlowFilter({ color: 0xFF4400, outerStrength: 6, innerStrength: 2 })
    ];

    // Particles
    for (let row = 0; row < ROWS; row++) {
      spawnParticles(
        col * REEL_W + REEL_W/2,
        row * SYMBOL_H + SYMBOL_H/2,
        0xFF4400, 10
      );
    }

    // Matrix update — puri column wild
    for (let row = 0; row < ROWS; row++) {
      matrix[col][row] = 'EXPANDING_WILD';
    }

    console.log(`Column ${col} expanded! 🔥`);
  }
}
```

---

# 📌 FEATURE 6 — STICKY WILD

## Logic
```
Wild land kiya → Chipak gaya!
Next spins mein bhi wahi rehta hai

Spin 1:  [🍒][🃏][🍋]  ← Wild aaya col 1
Spin 2:  [💎][🃏][⭐]  ← Wild WAHI hai (sticky)
Spin 3:  [🍒][🃏][💎]  ← Abhi bhi wahi!
Free spins end → Clear hoga
```

## Code
```js
class StickyWildManager {
  constructor() {
    // 2D boolean matrix — kahan sticky hai
    this.matrix = Array(COLS).fill(null)
      .map(() => Array(ROWS).fill(false));

    this.lockSprites = []; // Visual lock icons
  }

  // Wild land kiya — sticky banao
  addSticky(col, row) {
    if (this.matrix[col][row]) return; // Already sticky hai

    this.matrix[col][row] = true;
    this.addVisualLock(col, row);
    console.log(`Sticky Wild: col${col} row${row}`);
  }

  // Har spin se PEHLE call karo
  applyToResult(serverResult) {
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (this.matrix[col][row]) {
          serverResult[col][row] = WILD; // Override!
        }
      }
    }
    return serverResult;
  }

  // Spin ke baad check karo — naye wilds sticky banao?
  onSpinComplete(symbolMatrix, isFreeSpins) {
    if (!isFreeSpins) return; // Sirf free spins mein!

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (symbolMatrix[col][row] === WILD && !this.matrix[col][row]) {
          this.addSticky(col, row);
        }
      }
    }
  }

  // Visual lock icon add karo
  addVisualLock(col, row) {
    const sprite = reels[col].symbols[row].sprite;

    // Golden glow
    sprite.filters = [
      new GlowFilter({ color: 0xFFD700, outerStrength: 4, innerStrength: 2 })
    ];

    // Lock icon
    const lock   = PIXI.Sprite.from('lock_icon.png');
    lock.width   = 24;
    lock.height  = 24;
    lock.x       = col * REEL_W + REEL_W - 28;
    lock.y       = row * SYMBOL_H + 4;
    lock.zIndex  = 10;
    app.stage.addChild(lock);
    this.lockSprites.push({ col, row, sprite: lock });

    // Pulse animation
    gsap.to(sprite, {
      alpha: 0.75, duration: 0.8,
      yoyo: true, repeat: -1, ease: 'sine.inOut'
    });
  }

  // Free spins khatam — sab clear
  clearAll() {
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (this.matrix[col][row]) {
          const sprite = reels[col].symbols[row].sprite;
          sprite.filters = null;
          gsap.killTweensOf(sprite);
          sprite.alpha = 1;
        }
      }
    }

    // Lock icons remove
    this.lockSprites.forEach(({ sprite }) => sprite.destroy());
    this.lockSprites = [];

    // Matrix reset
    this.matrix = Array(COLS).fill(null).map(() => Array(ROWS).fill(false));
  }
}
```

---

# 🚶 FEATURE 7 — WALKING WILD

## Logic
```
Wild land karta hai
Har spin mein ek position LEFT move karta hai
Screen se bahar = disappear

Spin 1: col=4 [🍒][🍒][🍒][🍒][🃏]
Spin 2: col=3 [🍒][🍒][🍒][🃏][🍒]
Spin 3: col=2 [🍒][🍒][🃏][🍒][🍒]
Spin 4: col=1 [🍒][🃏][🍒][🍒][🍒]
Spin 5: col=0 [🃏][🍒][🍒][🍒][🍒]
Spin 6: Gone! [🍒][🍒][🍒][🍒][🍒]
```

## Code
```js
class WalkingWild {
  constructor(col, row) {
    this.col       = col;
    this.row       = row;
    this.active    = true;
    this.direction = 'left'; // ya 'right'
    this.sprite    = this.createSprite();
  }

  createSprite() {
    const sprite  = PIXI.Sprite.from('walking_wild.png');
    sprite.width  = SYMBOL_W;
    sprite.height = SYMBOL_H;
    sprite.x      = this.col * REEL_W;
    sprite.y      = this.row * SYMBOL_H;
    app.stage.addChild(sprite);
    return sprite;
  }

  applyToMatrix(matrix) {
    if (!this.active) return;
    matrix[this.col][this.row] = WILD;
  }

  async moveOneStep() {
    if (!this.active) return;

    const nextCol = this.direction === 'left'
      ? this.col - 1
      : this.col + 1;

    // Screen se bahar?
    if (nextCol < 0 || nextCol >= COLS) {
      await this.exitScreen();
      return;
    }

    // Move animation
    await gsap.to(this.sprite, {
      x:        nextCol * REEL_W,
      duration: 0.5,
      ease:     'power2.inOut',
    });

    this.col = nextCol;
  }

  async exitScreen() {
    const exitX = this.direction === 'left' ? -REEL_W : COLS * REEL_W;

    await gsap.to(this.sprite, {
      x:        exitX,
      alpha:    0,
      duration: 0.4,
      ease:     'power2.in',
    });

    this.sprite.destroy();
    this.active = false;
    console.log('Walking Wild gaya screen se bahar!');
  }
}

class WalkingWildManager {
  constructor() { this.wilds = []; }

  addWild(col, row) {
    const w = new WalkingWild(col, row);
    this.wilds.push(w);
    this.addTrailEffect(col, row);
  }

  applyToMatrix(matrix) {
    this.wilds
      .filter(w => w.active)
      .forEach(w => w.applyToMatrix(matrix));
    return matrix;
  }

  async moveAll() {
    await Promise.all(
      this.wilds.filter(w => w.active).map(w => w.moveOneStep())
    );
    // Inactive hataao
    this.wilds = this.wilds.filter(w => w.active);
  }

  addTrailEffect(col, row) {
    // Walking wild ke peeche trail effect
    const trail = new PIXI.Graphics();
    trail.beginFill(0xFF6600, 0.3);
    trail.drawRect(col * REEL_W, row * SYMBOL_H, REEL_W, SYMBOL_H);
    trail.endFill();
    app.stage.addChild(trail);

    gsap.to(trail, { alpha: 0, duration: 0.5,
      onComplete: () => trail.destroy() });
  }
}
```

---

# 💥 FEATURE 8 — CASCADING REELS

## Logic
```
WIN hoti hai
→ Winning symbols BLAST
→ Naye symbols upar se girte hain
→ Phir win check
→ Repeat jab tak win ho!

Multiplier bhi badhta hai:
Cascade 1 = x1
Cascade 2 = x2
Cascade 3 = x3
Cascade 4 = x5
Cascade 5+ = x10
```

## Code
```js
async function runCascadeLoop(symbolMatrix) {
  let cascadeCount = 0;
  let totalWin     = 0;

  while (true) {
    // Wins evaluate karo
    const wins = evaluateAllWins(symbolMatrix);
    if (wins.length === 0) break; // Koi win nahi → STOP

    cascadeCount++;
    const mult     = getCascadeMultiplier(cascadeCount);
    const roundWin = calcWinAmount(wins) * mult;
    totalWin      += roundWin;

    showCascadeInfo(cascadeCount, mult, roundWin);

    // Step 1: Blast winning symbols
    const winPositions = getWinPositions(wins);
    await explodeWinners(winPositions);

    // Step 2: Matrix mein null karo
    winPositions.forEach(({ col, row }) => {
      symbolMatrix[col][row] = null;
    });

    // Step 3: Gravity
    await applyGravity(symbolMatrix);

    // Step 4: Top se fill karo
    await fillEmptyPositions(symbolMatrix);

    // Loop continue — next iteration pe win check hoga
  }

  return { totalWin, cascadeCount };
}

// Multiplier table
function getCascadeMultiplier(n) {
  const table = { 1:1, 2:2, 3:3, 4:5, 5:10 };
  return table[Math.min(n, 5)] || 10;
}

// Gravity — null symbols neeche khisak jaate hain
async function applyGravity(matrix) {
  const drops = []; // Animate karne ke liye

  for (let col = 0; col < COLS; col++) {
    let writeRow = ROWS - 1; // Neeche se likho

    for (let readRow = ROWS - 1; readRow >= 0; readRow--) {
      if (matrix[col][readRow] !== null) {
        if (readRow !== writeRow) {
          // Symbol drop karna hai
          matrix[col][writeRow] = matrix[col][readRow];
          matrix[col][readRow]  = null;

          drops.push({
            sprite:  reels[col].symbols[readRow].sprite,
            targetY: writeRow * SYMBOL_H,
            delay:   col * 30, // Column stagger
          });
        }
        writeRow--;
      }
    }
  }

  // Sab drops animate karo
  await Promise.all(drops.map(({ sprite, targetY, delay }) =>
    sleep(delay).then(() =>
      gsap.to(sprite, {
        y:        targetY,
        duration: 0.35,
        ease:     'bounce.out',
      })
    )
  ));
}

// Upar se naye symbols fill karo
async function fillEmptyPositions(matrix) {
  const fills = [];

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (matrix[col][row] === null) {
        // Naya random symbol assign
        const newSym      = getRandomSymbol();
        matrix[col][row]  = newSym;

        const sprite = reels[col].symbols[row].sprite;
        sprite.texture = PIXI.Texture.from(`${newSym}.png`);
        sprite.y       = -SYMBOL_H; // Upar se start
        sprite.visible = true;

        fills.push(
          sleep(col * 40).then(() =>
            gsap.to(sprite, {
              y:        row * SYMBOL_H,
              duration: 0.4,
              ease:     'bounce.out',
            })
          )
        );
      }
    }
  }

  await Promise.all(fills);
}

// Winning symbols explode
async function explodeWinners(positions) {
  await Promise.all(positions.map(({ col, row }) => {
    const sprite = reels[col].symbols[row].sprite;

    // Particles
    spawnParticles(
      col * REEL_W + REEL_W/2,
      row * SYMBOL_H + SYMBOL_H/2,
      0xFFD700, 20
    );

    return gsap.to(sprite.scale, {
      x: 1.5, y: 1.5, duration: 0.1,
      yoyo: true, repeat: 1,
      onComplete: () => { sprite.visible = false; }
    });
  }));

  await sleep(150);
}
```

---

# ✖️ FEATURE 9 — MULTIPLIER

## Types & Code
```js
// Type 1: Symbol multiplier
const MULT_SYMBOLS = { 'WILD_2X': 2, 'WILD_5X': 5, 'WILD_10X': 10 };

function applySymbolMultiplier(wins, matrix) {
  let totalMult = 1;
  wins.forEach(win => {
    win.positions.forEach(({ col, row }) => {
      const m = MULT_SYMBOLS[matrix[col][row]];
      if (m) totalMult *= m;
    });
  });
  return totalMult;
}

// Type 2: Progressive (Free Spins mein badhta hai)
class ProgressiveMultiplier {
  constructor() { this.value = 1; this.max = 10; }

  onWin()    { if (this.value < this.max) { this.value++; this.animate(); } }
  apply(win) { return win * this.value; }
  reset()    { this.value = 1; }

  async animate() {
    if (!this.display) return;
    this.display.text = `x${this.value}`;

    // Color change
    if (this.value >= 8)      this.display.style.fill = '#FF0000';
    else if (this.value >= 5) this.display.style.fill = '#FF6600';
    else if (this.value >= 3) this.display.style.fill = '#FFD700';

    // Bounce
    await gsap.to(this.display.scale, {
      x: 1.5, y: 1.5, duration: 0.2,
      yoyo: true, repeat: 1, ease: 'back.out'
    });
  }
}

// Type 3: Random multiplier
function getRandomMultiplier() {
  const opts    = [2, 3, 5, 10, 20, 50];
  const weights = [40, 25, 20, 10, 4,  1];
  return weightedRandom(opts, weights);
}

function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand    = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}
```

---

# 🌟 FEATURE 10 — SCATTER

## Logic
```
Scatter = Koi bhi jagah aaye — payline nahi chahiye!
3+ scatter = Free Spins!

Grid pe kahi bhi:
[🌟][🍒][🌟]  ← scatter col 0, row 0
[💎][🍋][⭐]
[🍒][🌟][💎]  ← scatter col 1, row 2
= 3 scatters! = FREE SPINS! 🎉
```

## Code
```js
function checkScatter(symbolMatrix, totalBet) {
  let count     = 0;
  const positions = [];

  // Poori grid scan karo — har jagah!
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (symbolMatrix[col][row] === SCATTER) {
        count++;
        positions.push({ col, row });
      }
    }
  }

  if (count < 3) return null;

  return {
    count,
    positions,
    win:       totalBet * { 3:2, 4:5, 5:20 }[Math.min(count,5)],
    freeSpins: { 3:10, 4:15, 5:20 }[Math.min(count,5)],
  };
}

// Scatter animation
async function animateScatterWin(positions) {
  // Glow sab ko
  positions.forEach(({ col, row }) => {
    reels[col].symbols[row].sprite.filters = [
      new GlowFilter({ color: 0xFFD700, outerStrength: 6 })
    ];
  });

  // Pulse animation
  await Promise.all(positions.map(({ col, row }) =>
    gsap.to(reels[col].symbols[row].sprite.scale, {
      x: 1.3, y: 1.3, duration: 0.3,
      yoyo: true, repeat: 3
    })
  ));

  // Lines draw karo scatters ke beech
  for (let i = 0; i < positions.length - 1; i++) {
    await drawConnectingLine(positions[i], positions[i+1]);
  }
}
```

---

# 🆓 FEATURE 11 — FREE SPINS

## Logic
```
Scatter se trigger hota hai
Bet NAHI kata — sab profit!
Special features bhi hote hain
Retrigger possible!
```

## Code
```js
class FreeSpinsManager {
  constructor() {
    this.total      = 0;
    this.remaining  = 0;
    this.totalWin   = 0;
    this.active     = false;
    this.multiplier = new ProgressiveMultiplier();
    this.stickyMgr  = new StickyWildManager();
  }

  async trigger(count) {
    this.total     = count;
    this.remaining = count;
    this.totalWin  = 0;
    this.active    = true;
    this.multiplier.reset();

    await showFreeSpinsIntro(count);
    updateFSCounter(this.remaining, this.total);
  }

  retrigger(count) {
    this.remaining += count;
    this.total     += count;
    updateFSCounter(this.remaining, this.total);
    showRetriggerBanner(count);
    console.log(`+${count} more free spins! Total: ${this.remaining}`);
  }

  async playOneSpin(server) {
    if (!this.active || this.remaining <= 0) return null;

    this.remaining--;
    updateFSCounter(this.remaining, this.total);

    // FREE SPIN — bet 0!
    const result = await server.freeSpin({
      sessionId:  currentSessionId,
      freeSpinId: this.sessionId,
    });

    // Win pe multiplier increase
    if (result.totalWin > 0) {
      this.multiplier.onWin();
    }

    // Applied multiplier
    const winWithMult = this.multiplier.apply(result.totalWin);
    this.totalWin    += winWithMult;

    // Retrigger check
    const scatter = checkScatter(result.symbols, result.bet);
    if (scatter && scatter.count >= 3) {
      this.retrigger(scatter.freeSpins);
    }

    // Sticky wilds update
    this.stickyMgr.onSpinComplete(result.symbols, true);

    // Last spin?
    if (this.remaining === 0) await this.conclude();

    return { ...result, finalWin: winWithMult };
  }

  async conclude() {
    this.active = false;
    this.stickyMgr.clearAll();
    await showFreeSpinsSummary({
      spins: this.total,
      win:   this.totalWin,
    });
  }
}
```

---

# 🎁 FEATURE 12 — BONUS GAME

## Types
```
1. Pick-em   → Boxes mein se choose karo
2. Wheel     → Spin the wheel!
3. Ladder    → Steps pe chadhte jao
4. Mini Slot → Chhoti slot game
```

## Pick-em Code
```js
class PickEmBonus {
  constructor(bet) {
    this.bet      = bet;
    this.picks    = 3;
    this.totalWin = 0;
    this.mult     = 1;

    // Server se aata hai real mein — yeh demo hai
    this.prizes = this.generatePrizes();
  }

  generatePrizes() {
    return [
      { type: 'coins', value: this.bet * 5  },
      { type: 'coins', value: this.bet * 10 },
      { type: 'coins', value: this.bet * 25 },
      { type: 'mult',  value: 3              },
      { type: 'mult',  value: 5              },
      { type: 'end',   value: 0              }, // Collect!
    ].sort(() => Math.random() - 0.5);
  }

  async pick(index) {
    if (this.picks <= 0) return;
    const prize = this.prizes[index];

    await animateBoxReveal(index, prize);

    if      (prize.type === 'end')   { await this.end(); return; }
    else if (prize.type === 'mult')  { this.mult = prize.value; showMultEffect(prize.value); }
    else if (prize.type === 'coins') {
      const win   = prize.value * this.mult;
      this.totalWin += win;
      showCoinEffect(win);
    }

    this.picks--;
    if (this.picks === 0) await this.end();
  }

  async end() {
    await showBonusTotal(this.totalWin);
    return this.totalWin;
  }
}
```

---

# 🎯 FEATURE 13 — MEGAWAYS

## Logic
```
Har spin mein reel heights RANDOM (2-7)
Ways = sab multiply karo
Max: 7^6 = 117,649 ways!

Heights: [7][3][5][6][4][7]
Ways:     7×3×5×6×4×7 = 17,640
```

## Code
```js
class MegawaysEngine {
  constructor() {
    this.COLS       = 6;
    this.MIN_H      = 2;
    this.MAX_H      = 7;
    this.heights    = [];
  }

  generateHeights() {
    this.heights = Array.from({ length: this.COLS }, () =>
      this.MIN_H + Math.floor(Math.random() * (this.MAX_H - this.MIN_H + 1))
    );
    return this.heights;
  }

  getTotalWays() {
    return this.heights.reduce((a, b) => a * b, 1);
  }

  evaluateWins(matrix, bet) {
    const wins    = [];
    const symbols = this.getAllUniqueSymbols(matrix);

    for (const target of symbols) {
      let waysCount = 1, length = 0;

      for (let col = 0; col < this.COLS; col++) {
        const colSyms  = matrix[col].slice(0, this.heights[col]);
        const matches  = colSyms.filter(s => s === target || s === WILD).length;

        if (matches > 0) { waysCount *= matches; length++; }
        else break;
      }

      if (length >= 3) {
        wins.push({
          symbol:    target,
          length,
          ways:      waysCount,
          winAmount: this.getPayout(target, length) * waysCount * bet,
        });
      }
    }
    return wins;
  }

  // PixiJS — dynamic heights
  async updateReelHeights(newHeights) {
    await Promise.all(newHeights.map((h, col) => {
      const reel  = reels[col];
      const newH  = h * SYMBOL_H;
      return gsap.to(reel, {
        currentHeight: newH,
        duration:      0.4,
        ease:          'back.out',
        onUpdate:      () => reel.updateMask(),
      });
    }));
  }
}
```

---

# 🔄 FEATURE 14 — RE-SPIN / HOLD & WIN

## Logic
```
Coin/Money symbols aate hain
Lock ho jaate hain
3 re-spins milte hain
Naya coin = RE-SPINS RESET to 3!
Sab 15 positions fill = JACKPOT!
```

## Code
```js
class HoldAndWin {
  constructor() {
    this.reSpinsLeft = 3;
    this.MAX_RESPINS = 3;
    this.lockedCoins = []; // {col, row, value}
    this.active      = false;
  }

  async trigger(initialCoins) {
    this.active      = true;
    this.reSpinsLeft = this.MAX_RESPINS;
    this.lockedCoins = [];

    initialCoins.forEach(c => this.lockCoin(c.col, c.row, c.value));
    await this.showTrigger();
    await this.spinLoop();
  }

  lockCoin(col, row, value) {
    this.lockedCoins.push({ col, row, value });
    animateLock(col, row, value);
  }

  async spinLoop() {
    while (this.reSpinsLeft > 0) {
      this.reSpinsLeft--;
      updateReSpinDisplay(this.reSpinsLeft);

      const result = await spinUnlocked(this.lockedCoins);

      const newCoins = result.filter(c =>
        !this.lockedCoins.some(l => l.col === c.col && l.row === c.row)
      );

      if (newCoins.length > 0) {
        // RESET!
        this.reSpinsLeft = this.MAX_RESPINS;
        newCoins.forEach(c => this.lockCoin(c.col, c.row, c.value));
        showResetEffect();
      }

      // Sab fill?
      if (this.lockedCoins.length >= COLS * ROWS) {
        showGrandJackpot();
        break;
      }
    }

    return this.calcTotal();
  }

  calcTotal() {
    return this.lockedCoins.reduce((sum, c) => sum + c.value, 0);
  }
}
```

---

# 📈 FEATURE 15 — PROGRESSIVE JACKPOT

## Logic
```
Har spin se thoda pool mein jaata hai
Pool grow karta rehta hai
Koi bhi player kabhi bhi win kar sakta hai!

MINI:  ₹100  → ₹1,000
MAJOR: ₹5K   → ₹50K
GRAND: ₹50K  → ₹5L
MEGA:  ₹5L   → ∞ 🔥
```

## Code
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
    this.displays = {}; // PixiJS text objects
  }

  onSpin(bet) {
    Object.values(this.tiers).forEach(t => t.value += bet * t.contribution);
    this.updateDisplays();
  }

  async award(tierName) {
    const win = this.tiers[tierName].value;
    await this.showJackpotAnimation(tierName, win);
    this.tiers[tierName].value = this.tiers[tierName].seed;
    this.updateDisplays();
    return win;
  }

  updateDisplays() {
    Object.entries(this.tiers).forEach(([name, tier]) => {
      const text = this.displays[name];
      if (!text) return;
      gsap.to({ v: text._currentVal || 0 }, {
        v: tier.value, duration: 0.5,
        onUpdate: function() {
          text.text = `₹${Math.floor(this.targets()[0].v).toLocaleString('en-IN')}`;
        }
      });
    });
  }
}
```

---

# 🌀 FEATURE 16 — CLUSTER PAYS

## Logic
```
Paylines NAHI!
5+ touching same symbols = WIN!
Adjacent = up/down/left/right

[🍒][🍒][🍋]
[🍒][🍒][💎]  ← 5 connected 🍒 = WIN!
[🍋][🍒][🍋]
      ↑ This one too = 6 connected!
```

## Code — Flood Fill
```js
class ClusterEngine {
  findCluster(matrix, col, row, target) {
    const visited = new Set();
    const queue   = [`${col},${row}`];
    const cluster = [];

    while (queue.length > 0) {
      const key = queue.shift();
      if (visited.has(key)) continue;
      visited.add(key);

      const [c, r] = key.split(',').map(Number);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;

      const sym = matrix[c][r];
      if (sym !== target && sym !== WILD) continue;

      cluster.push({ col: c, row: r });

      // 4 directions
      queue.push(`${c+1},${r}`, `${c-1},${r}`,
                 `${c},${r+1}`, `${c},${r-1}`);
    }
    return cluster;
  }

  findAllClusters(matrix) {
    const visited  = new Set();
    const clusters = [];

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const key = `${col},${row}`;
        if (visited.has(key)) continue;

        const sym = matrix[col][row];
        if (!sym || sym === SCATTER) continue;

        const cluster = this.findCluster(matrix, col, row, sym);
        cluster.forEach(p => visited.add(`${p.col},${p.row}`));

        if (cluster.length >= 5) { // Min 5 symbols
          clusters.push({ symbol: sym, positions: cluster });
        }
      }
    }
    return clusters;
  }
}
```

---

# 🎭 FEATURE 17 — MYSTERY SYMBOL

## Logic
```
? symbol land karta hai
Spin hone ke BAAD reveal hota hai
Sab mystery ek SAME symbol bante hain!

Before reveal:    After reveal:
[🍒][?][🍋]      [🍒][💎][🍋]
[?][💎][⭐]   →  [💎][💎][⭐]  ← 3 diamond WIN!
[🍒][?][🍒]      [🍒][💎][🍒]
```

## Code
```js
class MysterySymbol {
  async revealAll(matrix) {
    const positions = [];

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (matrix[col][row] === 'MYSTERY') {
          positions.push({ col, row });
        }
      }
    }

    if (positions.length === 0) return;

    // EK symbol — sab mystery same bante hain!
    const revealSym = this.pickHighValueSymbol();

    // Animate — ek ek karke (stagger)
    for (const { col, row } of positions) {
      const sprite = reels[col].symbols[row].sprite;

      // Spin animation
      await gsap.to(sprite, { rotation: Math.PI * 4, duration: 0.5, ease: 'power2.in' });

      sprite.texture  = PIXI.Texture.from(`${revealSym}.png`);
      sprite.rotation = 0;
      matrix[col][row] = revealSym;

      spawnParticles(col * REEL_W + REEL_W/2, row * SYMBOL_H + SYMBOL_H/2, 0xFFFFFF, 10);

      await sleep(80); // Stagger
    }
  }

  pickHighValueSymbol() {
    const high = ['SEVEN', 'DIAMOND', 'BELL', 'STAR'];
    return high[Math.floor(Math.random() * high.length)];
  }
}
```

---

# 🎪 FEATURE 18 — ANTICIPATION

## Logic
```
Server result pehle aata hai
Agar scatter/wild aane wala hai
→ Reel BAHUT slow ho jaati hai
→ Camera shake
→ Dramatic sound
= SUSPENSE! 😱
```

## Code
```js
class Anticipation {
  shouldAnticipate(result, col) {
    let scattersBefore = 0;

    for (let c = 0; c < col; c++) {
      if (result.symbols[c].includes(SCATTER)) scattersBefore++;
    }

    // 2 scatters aaye → agle reels anticipate
    if (scattersBefore >= 2) return true;

    // Wild aane wala hai?
    if (result.symbols[col].includes(WILD)) return true;

    return false;
  }

  async spinAllWithAnticipation(result) {
    for (let col = 0; col < COLS; col++) {
      const reel    = reels[col];
      const doAntic = this.shouldAnticipate(result, col);

      if (doAntic) {
        // Slow down
        await gsap.to(reel, { speed: 3, duration: 0.4 });

        // Shake
        await this.shakeReel(reel);

        // Sound
        SoundManager.getInstance().play('anticipation');

        // Wait — suspense!
        await sleep(1200);
      }

      // Stop on result
      await reel.stopOn(result.symbols[col]);
      await sleep(200); // Stagger
    }
  }

  async shakeReel(reel) {
    const origX = reel.container.x;
    await gsap.to(reel.container, {
      x:        origX + 6,
      duration: 0.04,
      yoyo:     true,
      repeat:   8,
      onComplete: () => { reel.container.x = origX; }
    });
  }
}
```

---

# 🔧 COMPLETE SPIN FLOW

## Full Game Controller
```js
class GameController {
  constructor() {
    this.model         = new GameModel();
    this.fsm           = new SlotFSM();
    this.server        = new ServerService();
    this.sound         = SoundManager.getInstance();

    // Feature managers
    this.randomWild    = new RandomWildManager();
    this.expandingWild = new ExpandingWildManager();
    this.stickyWild    = new StickyWildManager();
    this.walkingWild   = new WalkingWildManager();
    this.freeSpins     = new FreeSpinsManager();
    this.jackpot       = new ProgressiveJackpot();
    this.anticipation  = new Anticipation();
  }

  async onSpinClick() {
    if (!this.fsm.canSpin()) return;

    this.fsm.go('SPINNING');
    this.sound.play('spin');

    try {
      // Jackpot contribution
      this.jackpot.onSpin(this.model.bet);

      // Server spin
      const result = await this.server.spin({
        bet:       this.model.bet,
        sessionId: this.model.sessionId,
      });

      // Pre-spin features apply
      this.stickyWild.applyToResult(result.symbols);
      this.walkingWild.applyToMatrix(result.symbols);

      // Spin with anticipation
      await this.anticipation.spinAllWithAnticipation(result);

      // Post-spin features
      await this.randomWild.applyRandomWilds(result.symbols);
      await this.expandingWild.processExpandingWilds(result.symbols);

      // Evaluate wins
      this.fsm.go('EVALUATING');

      // Cascading?
      let totalWin = 0;
      if (this.model.hasCascade) {
        const cascade = await runCascadeLoop(result.symbols);
        totalWin      = cascade.totalWin;
      } else {
        totalWin = calcWinAmount(evaluateAllWins(result.symbols));
      }

      // Scatter check
      const scatter = checkScatter(result.symbols, this.model.bet);
      if (scatter) {
        await animateScatterWin(scatter.positions);
        this.freeSpins.trigger(scatter.freeSpins);
      }

      // Sticky wild update
      this.stickyWild.onSpinComplete(result.symbols, this.freeSpins.active);

      // Walking wild move
      await this.walkingWild.moveAll();

      // Balance update
      this.model.balance += totalWin - this.model.bet;
      updateBalanceDisplay(this.model.balance);

      // Next state
      if (scatter)       this.fsm.go('FREE_INTRO');
      else if (totalWin) this.fsm.go('WIN_PRESENT');
      else               this.fsm.go('IDLE');

    } catch(err) {
      console.error('Spin error:', err);
      this.fsm.go('IDLE');
    }
  }
}
```

---

# ⚡ QUICK REVISION — Sab Features

```
Feature          Kya Karta Hai                    Key Point
─────────────────────────────────────────────────────────────────
Infinite Reel  → Symbol neeche = upar aao         Modulo wrapping
Dynamic Reel   → Heights change hoti hain         gsap + mask update
Wild           → Koi bhi symbol replace            base = find non-wild
Random Wild    → Randomly wild appear              15% chance
Expanding Wild → Column expand                     gsap height 0→REEL_H
Sticky Wild    → Wild chipka rehta hai             Boolean matrix persist
Walking Wild   → Har spin col-- move               Active check
Cascade        → Win→blast→gravity→fill→repeat     Async while loop!
Multiplier     → Win × N                           Progressive/Random
Scatter        → Kahi bhi count                    No payline needed
Free Spins     → server.freeSpin() bet=0           Retrigger possible
Bonus Game     → Pick-em, Wheel                    Server prizes
Megaways       → Random heights 2-7                Ways = multiply all
Hold & Win     → Coins lock, 3 respins             New coin = reset
Jackpot        → Pool contribution per spin        Server decides win
Cluster        → 5+ adjacent same symbols          Flood fill BFS
Mystery        → ? → same symbol reveal            All same!
Anticipation   → Slow reel if exciting             Server result first
```

---

# 🔥 COMMON BUGS & FIXES

```js
// BUG 1: Mask kaam nahi kar raha
// ❌ Wrong
container.mask = mask;
// ✅ Fix
container.mask = mask;
container.addChild(mask); // COMPULSORY!

// BUG 2: Delta time use nahi kiya
// ❌ Wrong — 144hz pe double speed
reel.y += 10;
// ✅ Fix
reel.y += 10 * delta;

// BUG 3: Cascade async nahi kiya
// ❌ Wrong
while(hasWin()) {
  explode();   // No await!
  fillNew();   // No await!
}
// ✅ Fix
while(hasWin()) {
  await explode();
  await fillNew();
}

// BUG 4: Sticky wild clear nahi kiya
// ❌ Wrong — free spins ke baad bhi sticky active
// ✅ Fix
freeSpinsManager.onEnd = () => {
  stickyWildManager.clearAll(); // ZAROOR!
};

// BUG 5: Memory leak
// ❌ Wrong
new PIXI.Sprite().destroy(); // Texture bhi destroy ho gayi!
// ✅ Fix
sprite.destroy({ children: true, texture: false }); // texture: false!

// BUG 6: Pool release bhool gaya
// ❌ Wrong
const coin = coinPool.acquire();
gsap.to(coin, { alpha: 0, duration: 1 }); // Release kahan?
// ✅ Fix
gsap.to(coin, {
  alpha: 0, duration: 1,
  onComplete: () => coinPool.release(coin) // RELEASE KARO!
});
```

---

**Bhai yeh sab practice karo —**
**ZVKY mein koi bhi feature mushkil nahi lagega! 💪🔥🎰**