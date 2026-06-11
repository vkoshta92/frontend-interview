# VLT iGaming + PixiJS — Senior Dev Complete Reference
> SG / LnW Context | Canada, Europe & Pennsylvania Markets  
> PixiJS Deep Dive: Architecture · Reel System · Draw Calls · Object Pooling · All Game Features

---

## TABLE OF CONTENTS

- [VLT iGaming + PixiJS — Senior Dev Complete Reference](#vlt-igaming--pixijs--senior-dev-complete-reference)
  - [TABLE OF CONTENTS](#table-of-contents)
  - [1. Land-Based → iGaming Adaptation](#1-land-based--igaming-adaptation)
  - [2. Cabinet Soul — Jo KABHI Nahi Badlega](#2-cabinet-soul--jo-kabhi-nahi-badlega)
  - [3. Regulated Market Concepts](#3-regulated-market-concepts)
    - [Bet Limits \& Win Caps](#bet-limits--win-caps)
    - [Progressive Jackpot Types](#progressive-jackpot-types)
  - [4. Feature Parity Checklist](#4-feature-parity-checklist)
  - [5. PixiJS — Core Architecture](#5-pixijs--core-architecture)
    - [Plugin-Based Feature Class System](#plugin-based-feature-class-system)
    - [BaseFeature Lifecycle Hooks](#basefeature-lifecycle-hooks)
    - [Scene Graph Structure](#scene-graph-structure)
  - [6. PixiJS — Reel System Deep Dive](#6-pixijs--reel-system-deep-dive)
    - [Reel Strip Concept](#reel-strip-concept)
    - [Reel Spin Phases](#reel-spin-phases)
    - [Symbol Positioning During Spin](#symbol-positioning-during-spin)
    - [Anticipation System](#anticipation-system)
    - [Reel Blur Shader (Motion Blur During Spin)](#reel-blur-shader-motion-blur-during-spin)
  - [7. PixiJS — Draw Calls \& Rendering Pipeline](#7-pixijs--draw-calls--rendering-pipeline)
    - [Draw Call Kya Hota Hai?](#draw-call-kya-hota-hai)
    - [Draw Call Batching — Key Rules](#draw-call-batching--key-rules)
    - [Draw Calls Badhne ke Reasons (Common Mistakes)](#draw-calls-badhne-ke-reasons-common-mistakes)
    - [Texture Atlas Strategy](#texture-atlas-strategy)
    - [PIXI.ParticleContainer vs PIXI.Container](#pixiparticlecontainer-vs-pixicontainer)
    - [RenderTexture — Static Background Optimization](#rendertexture--static-background-optimization)
    - [Draw Call Debug Kaise Karo](#draw-call-debug-kaise-karo)
  - [8. PixiJS — Object Pooling](#8-pixijs--object-pooling)
    - [Object Pooling Kya Hai?](#object-pooling-kya-hai)
    - [Generic Pool Class](#generic-pool-class)
    - [Symbol Pool — Slot Game Specific](#symbol-pool--slot-game-specific)
    - [Kab Pool Karo](#kab-pool-karo)
  - [9. PixiJS — Texture \& Asset Management](#9-pixijs--texture--asset-management)
    - [TextureAtlas / Spritesheet](#textureatlas--spritesheet)
    - [Asset Loading Strategy](#asset-loading-strategy)
    - [Texture Memory Management](#texture-memory-management)
  - [10. PixiJS — GLSL Shaders \& Effects](#10-pixijs--glsl-shaders--effects)
    - [Custom Filter Base](#custom-filter-base)
    - [Common Slot Effects](#common-slot-effects)
    - [ColorMatrixFilter — Dim Non-Winning Symbols](#colormatrixfilter--dim-non-winning-symbols)
  - [11. All Slot Game Features — Deep Dive](#11-all-slot-game-features--deep-dive)
    - [11.1 Free Spins Feature](#111-free-spins-feature)
    - [11.2 Wild Feature](#112-wild-feature)
    - [11.3 Scatter Symbol](#113-scatter-symbol)
    - [11.4 Multiplier Feature](#114-multiplier-feature)
    - [11.5 Cascading / Tumbling Reels](#115-cascading--tumbling-reels)
    - [11.6 Hold \& Spin Feature](#116-hold--spin-feature)
    - [11.7 Jackpot Feature (WAP/MLP)](#117-jackpot-feature-wapmlp)
    - [11.8 Cluster Pays](#118-cluster-pays)
    - [11.9 Megaways™](#119-megaways)
    - [11.10 Bonus Game / Pick Feature](#1110-bonus-game--pick-feature)
    - [11.11 Gamble Feature](#1111-gamble-feature)
    - [11.12 Buy Feature / Bonus Buy](#1112-buy-feature--bonus-buy)
  - [12. State Machine — Complete Flow](#12-state-machine--complete-flow)
  - [13. WebSocket / Server Communication](#13-websocket--server-communication)
    - [Spin Flow](#spin-flow)
    - [Progressive Meter WebSocket](#progressive-meter-websocket)
  - [14. Autoplay \& Session Logic](#14-autoplay--session-logic)
  - [15. Responsible Gaming UI](#15-responsible-gaming-ui)
  - [16. Localization — Dev Perspective](#16-localization--dev-perspective)
  - [17. Performance Optimization Checklist](#17-performance-optimization-checklist)
    - [Rendering](#rendering)
    - [Memory](#memory)
    - [CPU/GPU](#cpugpu)
    - [Code](#code)
    - [Mobile Specific](#mobile-specific)
  - [18. Animation Guidelines (Casino = Restraint)](#18-animation-guidelines-casino--restraint)
    - [Win Tier Animation Duration Guide](#win-tier-animation-duration-guide)
  - [19. Interview Terms Glossary](#19-interview-terms-glossary)
  - [20. Interview Q\&A — Full Set](#20-interview-qa--full-set)
  - [21. Games to Study + Homework Answers](#21-games-to-study--homework-answers)
    - [5 Adaptation Risks (Homework Answer)](#5-adaptation-risks-homework-answer)
    - [3 Things That Must Never Change](#3-things-that-must-never-change)
    - [Cabinet vs iGaming Key Differences](#cabinet-vs-igaming-key-differences)

---

## 1. Land-Based → iGaming Adaptation

```
Cabinet/VLT → Approved Math → Asset Export → PixiJS/Web → Localization → QA → Certification
```

**Core Mindset:** Tu sirf port nahi kar raha — tu "cabinet soul" preserve kar raha hai browser mein.  
Math model kabhi nahi badlti. Sirf delivery layer badlti hai.

| Aspect | Land-Based Cabinet | iGaming (Browser/Mobile) |
|---|---|---|
| Hardware | Fixed, physical buttons | Touch / mouse / keyboard |
| Screen | Fixed resolution CRT/LCD | Responsive, multiple viewports |
| Pacing | Physical reel spin controlled | Code se replicate karna padta hai |
| Session | Coin-in / coin-out | Session token, autoplay, resume |
| Sound | Cabinet speaker hardware | Web Audio API (latency issue) |
| RNG | Hardware RNG chip | Server-side certified RNG |
| Wins | Determined by hardware | Server authoritative |
| Certification | GLI, BMM hardware test | GLI, BMM software test |

---

## 2. Cabinet Soul — Jo KABHI Nahi Badlega

Interviewer yahi sabse pehle sunna chahta hai:

| Element | Kya hai | PixiJS Implementation |
|---|---|---|
| **Reel Rhythm** | Spin start → deceleration → stop timing | Custom easing curve, GSAP `CustomEase` |
| **Anticipation Timing** | Near-miss pe slow reel + sound | Reel-specific deceleration override |
| **Feature Sequencing** | Bonus trigger → transition → feature | State machine strict ordering |
| **Win Pacing** | Small win vs big win celebration ratio | Tiered win presentation system |
| **Symbol Settle** | Reel stop pe symbol "bounce" | Overshoot + settle tween |
| **Audio Sync** | Sound perfectly synced to visual | AudioContext + Ticker sync |

> **Rule:** Agar player ne kabhi cabinet pe khela hai aur browser version mein reel 50ms jaldi ruk jaaye — woh feel karta hai. Trust toot jaata hai.

---

## 3. Regulated Market Concepts

### Bet Limits & Win Caps
| Parameter | Typical Value | Code Impact |
|---|---|---|
| Max Bet | ~$5 per spin | UI enforce, server validate |
| Max Win | ~$2500 per spin | Display cap, server controlled |
| RTP | 85–97% (market dependent) | Math model, not client code |
| Spin Rate | Min 3–5 sec per spin (some markets) | Enforced delay in state machine |

### Progressive Jackpot Types
| Type | Full Name | Network Scope | Dev Concern |
|---|---|---|---|
| **WAP** | Wide Area Progressive | Multiple venues/operators | Large jackpot, WebSocket feed |
| **MLP** | Multi Linked Progressive | Controlled machine network | Smaller pool, faster updates |
| **SAP** | Stand Alone Progressive | Single machine only | Simple local meter |

**PixiJS angle:** Meter ek `TickerBasedCounter` class se animate hota hai — lerp ya GSAP CountTo use karo. WebSocket se value aaye to smooth transition dikhao, sudden jump nahi.

---

## 4. Feature Parity Checklist

> "iGaming version mein woh saari features hain jo cabinet mein thi — SAME behavior ke saath"

- [ ] Reel strip weights (symbol frequency) — server config se
- [ ] Stop positions deterministic per server response
- [ ] Anticipation trigger conditions same
- [ ] Free spins count, retrigger, multiplier progression
- [ ] Wild substitution rules (kaunse symbols replace nahi karta)
- [ ] Scatter pay rules (anywhere pays vs specific positions)
- [ ] Hold & Spin lock/unlock mechanic
- [ ] Progressive contribution rate
- [ ] Win line evaluation (paylines / ways / cluster)
- [ ] Gamble feature availability per market
- [ ] Autoplay rules per jurisdiction
- [ ] Localization correct (currency, language, date)
- [ ] RTP config per market
- [ ] Responsible gaming features active

---

## 5. PixiJS — Core Architecture

### Plugin-Based Feature Class System

```
GameCore (BaseGame)
│
├── ReelSystem          ← Reel strips, symbols, spin/stop logic
├── WinEvaluator        ← Payline / ways / cluster calculation (server validates)
├── UIManager           ← Bet panel, win display, balance, buttons
├── AudioManager        ← Sound effects, music, Web Audio API
├── StateMachine        ← Game state control
│
├── Features/
│   ├── BaseFeature           ← Abstract class, lifecycle hooks
│   ├── FreeSpinsFeature      ← extends BaseFeature
│   ├── WildFeature           ← extends BaseFeature
│   ├── StickyWildFeature     ← extends BaseFeature
│   ├── ExpandingWildFeature  ← extends BaseFeature
│   ├── MultiplierFeature     ← extends BaseFeature
│   ├── CascadeFeature        ← extends BaseFeature
│   ├── HoldSpinFeature       ← extends BaseFeature
│   ├── JackpotFeature        ← extends BaseFeature
│   ├── ClusterFeature        ← extends BaseFeature
│   └── BonusGameFeature      ← extends BaseFeature
│
└── Managers/
    ├── PoolManager           ← Object pooling
    ├── AssetManager          ← Texture atlas, loader
    ├── AnimationManager      ← Spine, spritesheet animations
    ├── ProgressiveManager    ← WAP/MLP meter handling
    └── RGManager             ← Responsible Gaming
```

### BaseFeature Lifecycle Hooks

```javascript
class BaseFeature {
  onInit()        // Game load pe ek baar
  onActivate()    // Feature trigger hone pe
  onSpin()        // Har spin pe
  onResult()      // Server result milne pe
  onComplete()    // Feature khatam hone pe
  onDeactivate()  // Feature disable hone pe
  onDestroy()     // Cleanup
}
```

### Scene Graph Structure

```
PIXI.Application
└── stage (PIXI.Container)
    ├── BackgroundLayer    ← Static renderTexture (1 draw call)
    ├── ReelContainer      ← Mask applied
    │   ├── Reel[0]        ← PIXI.Container
    │   │   ├── Symbol[0]  ← PIXI.Sprite (pooled)
    │   │   ├── Symbol[1]
    │   │   └── Symbol[2]
    │   ├── Reel[1]
    │   └── Reel[2]
    ├── WinEffectsLayer    ← Particle containers
    ├── UILayer            ← Bet panel, balance
    ├── FeatureLayer       ← Feature-specific overlays
    └── TopLayer           ← Jackpot, popups, RG overlays
```

---

## 6. PixiJS — Reel System Deep Dive

### Reel Strip Concept

```javascript
// Reel strip = ordered array of symbol IDs
const reelStrip = [0, 3, 1, 5, 2, 4, 0, 1, 3, 2, ...]; // server se aata hai

// Window = visible symbols (e.g., 3 rows)
// Stop position = strip ka index jo top row pe show hoga
// Server response mein aata hai: { stops: [4, 12, 7, 23, 15] }
```

### Reel Spin Phases

```
1. IDLE
   ↓ player SPIN press
2. SPIN_START       → reel one by one (staggered) start hoti hain
   ↓
3. ACCELERATE       → velocity 0 → max_velocity (ease-in)
   ↓
4. CONSTANT_SPIN    → max_velocity pe loop chalti hai
   ↓ server response aaya
5. ANTICIPATION?    → agar yes: slow down + effect + sound (specific reels)
   ↓
6. DECELERATE       → velocity max → 0 (ease-out, custom curve)
   ↓
7. OVERSHOOT        → 1–2 symbols extra scroll then bounce back
   ↓
8. SETTLE           → final stop position lock
   ↓
9. REEL_STOPPED     → next reel stop, ya evaluation start
```

### Symbol Positioning During Spin

```javascript
// Symbols virtual strip pe hain — position continuously update hoti hai ticker mein
class Reel {
  update(delta) {
    this.position += this.velocity * delta;

    // Symbols reposition karo based on position
    for (let i = 0; i < this.symbols.length; i++) {
      let sym = this.symbols[i];
      sym.y = ((this.position + i * SYMBOL_HEIGHT) % this.totalHeight);

      // Strip se texture assign karo
      let stripIndex = this.getStripIndex(sym.y);
      sym.texture = TextureCache[this.strip[stripIndex]];
    }
  }
}
```

### Anticipation System

```javascript
// Conditions for anticipation (game specific):
// - Scatter appearing on reel 1 aur 2 → reel 3, 4, 5 anticipate
// - High value symbol near completion

class AnticipationManager {
  shouldAnticipate(reelIndex, serverStops) {
    // Server stops check karo
    // Scatter count check karo
    return scatterCount >= 2 && reelIndex >= 2;
  }

  triggerAnticipation(reel) {
    reel.setVelocity(ANTICIPATION_VELOCITY); // Slow down
    this.audioManager.play('anticipation_loop');
    this.showAnticipationEffect(reel); // Arrow/glow overlay
  }
}
```

### Reel Blur Shader (Motion Blur During Spin)

```glsl
// Fragment shader — vertical motion blur
uniform sampler2D uSampler;
uniform float uBlurAmount;  // velocity ke proportion mein

void main(void) {
  vec4 color = vec4(0.0);
  float total = 0.0;
  for (float i = -4.0; i <= 4.0; i++) {
    float offset = i * uBlurAmount;
    color += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + offset));
    total += 1.0;
  }
  gl_FragColor = color / total;
}
```

```javascript
// Velocity ke saath blur amount adjust karo
reel.blurFilter.blurY = currentVelocity * BLUR_FACTOR;
// Slow ya stopped → blur = 0
```

---

## 7. PixiJS — Draw Calls & Rendering Pipeline

### Draw Call Kya Hota Hai?

> Ek **draw call** = GPU ko ek render instruction.  
> Zyada draw calls = zyada CPU→GPU communication = FPS drop.  
> **Target: Slot game mein < 20–30 draw calls per frame.**

### Draw Call Batching — Key Rules

```
SAME texture atlas    +   SAME shader   +   SAME blend mode
= Sab ek draw call mein batch ho jaate hain ✅

DIFFERENT textures    OR  DIFFERENT shaders  OR  DIFFERENT blend modes
= Alag draw call ❌
```

### Draw Calls Badhne ke Reasons (Common Mistakes)

| Mistake | Fix |
|---|---|
| Har symbol alag texture file | Sab ek `TextureAtlas` (.json + .png) mein pack karo |
| Win pe blend mode change (ADDITIVE) | Blend mode change se batch break hoti hai — carefully use karo |
| Har effect layer pe alag shader | Effects group karo, minimal shader switches |
| Text objects har frame | `PIXI.BitmapText` use karo — `PIXI.Text` har frame ek draw call |
| `renderTexture` recreate karna | Cache karo, reuse karo |

### Texture Atlas Strategy

```javascript
// WRONG — alag alag textures
symbol1.texture = PIXI.Texture.from('symbol1.png');  // draw call 1
symbol2.texture = PIXI.Texture.from('symbol2.png');  // draw call 2
symbol3.texture = PIXI.Texture.from('symbol3.png');  // draw call 3

// RIGHT — ek atlas se sab
PIXI.Assets.load('symbols-atlas.json').then(() => {
  symbol1.texture = PIXI.Texture.from('symbol1');  // same draw call!
  symbol2.texture = PIXI.Texture.from('symbol2');  // same draw call!
  symbol3.texture = PIXI.Texture.from('symbol3');  // same draw call!
});
```

### PIXI.ParticleContainer vs PIXI.Container

```javascript
// Normal Container — flexible but slow (many draw calls)
const container = new PIXI.Container();

// ParticleContainer — FAST (1 draw call for 50,000 particles)
// Limitation: no children nesting, no filters, same texture only
const particles = new PIXI.ParticleContainer(10000, {
  position: true,
  rotation: true,
  alpha: true,
  scale: true,
  uvs: false  // false = faster
});
```

### RenderTexture — Static Background Optimization

```javascript
// Background har frame render mat karo
const bgTexture = PIXI.RenderTexture.create({ width: 1920, height: 1080 });
app.renderer.render(backgroundContainer, { renderTexture: bgTexture });
const bgSprite = new PIXI.Sprite(bgTexture);
stage.addChildAt(bgSprite, 0);
// Ab background sirf 1 draw call — forever!
```

### Draw Call Debug Kaise Karo

```javascript
// PixiJS DevTools Chrome Extension use karo
// Ya console mein:
console.log('Draw calls:', app.renderer.gl.drawCallCount);

// pixi-stats library
import Stats from 'pixi-stats';
const stats = addStats(document, app);
// FPS + draw calls realtime dikhata hai
```

---

## 8. PixiJS — Object Pooling

### Object Pooling Kya Hai?

> **Problem:** `new PIXI.Sprite()` → `destroy()` → `new PIXI.Sprite()` = GC pressure = frame drops  
> **Solution:** Objects pre-create karo, reuse karo — kabhi destroy mat karo

### Generic Pool Class

```javascript
class ObjectPool {
  constructor(createFn, initialSize = 20) {
    this.createFn = createFn;
    this.pool = [];
    this.active = [];

    // Pre-warm karo
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get() {
    let obj = this.pool.length > 0
      ? this.pool.pop()
      : this.createFn();  // Pool empty ho to naya banao
    this.active.push(obj);
    obj.visible = true;
    return obj;
  }

  release(obj) {
    obj.visible = false;
    obj.alpha = 1;
    obj.scale.set(1);
    const idx = this.active.indexOf(obj);
    if (idx !== -1) this.active.splice(idx, 1);
    this.pool.push(obj);
  }

  releaseAll() {
    [...this.active].forEach(obj => this.release(obj));
  }
}
```

### Symbol Pool — Slot Game Specific

```javascript
class SymbolPool extends ObjectPool {
  constructor() {
    super(() => {
      const sprite = new PIXI.Sprite();
      sprite.anchor.set(0.5);
      return sprite;
    }, 50); // 5 reels × 3 rows + buffer
  }

  getSymbol(symbolId) {
    const sprite = this.get();
    sprite.texture = PIXI.Texture.from(SYMBOL_MAP[symbolId]);
    return sprite;
  }
}

// Win effect particles pool
class ParticlePool extends ObjectPool {
  constructor() {
    super(() => new PIXI.Sprite(PIXI.Texture.from('particle')), 200);
  }
}
```

### Kab Pool Karo

| Object Type | Pool? | Reason |
|---|---|---|
| Reel symbols | ✅ Yes | Har spin recycle hote hain |
| Win particles | ✅ Yes | Bahut saare, short lived |
| Win line highlights | ✅ Yes | Per payline ek |
| Bonus symbols | ✅ Yes | Hold & Spin mein frequent |
| UI buttons | ❌ No | Ek baar create, rehte hain |
| Background | ❌ No | Static renderTexture |
| Jackpot meter | ❌ No | Always visible |

---

## 9. PixiJS — Texture & Asset Management

### TextureAtlas / Spritesheet

```javascript
// atlas.json structure (TexturePacker se generate hota hai)
{
  "frames": {
    "symbol_wild": { "frame": {"x":0,"y":0,"w":150,"h":150} },
    "symbol_scatter": { "frame": {"x":150,"y":0,"w":150,"h":150} },
    "symbol_7": { "frame": {"x":300,"y":0,"w":150,"h":150} }
  },
  "meta": { "image": "symbols.png", "size": {"w":2048,"h":2048} }
}

// Load karo
await PIXI.Assets.load('symbols.json');
// Ab use karo
const sprite = PIXI.Sprite.from('symbol_wild'); // atlas se aayega
```

### Asset Loading Strategy

```javascript
class AssetManager {
  async loadGame() {
    // Phase 1: Critical assets (loading screen pe)
    await PIXI.Assets.load([
      'symbols-atlas.json',    // All symbols
      'ui-atlas.json',         // UI elements
      'background.jpg'
    ]);

    // Phase 2: Feature assets (lazy load)
    // Free spins background etc. — baad mein load karo
  }

  preloadFeatureAssets(featureName) {
    const assets = FEATURE_ASSET_MAP[featureName];
    PIXI.Assets.backgroundLoad(assets); // Non-blocking
  }
}
```

### Texture Memory Management

```javascript
// Unused textures unload karo (memory leak avoid)
PIXI.Assets.unload('bonus-feature-atlas.json');

// Cache check
const cached = PIXI.Assets.cache.has('symbol_wild');

// TextureGarbageCollector (PixiJS v8)
app.renderer.textureGC.run();
```

---

## 10. PixiJS — GLSL Shaders & Effects

### Custom Filter Base

```javascript
class GlowFilter extends PIXI.Filter {
  constructor(intensity = 1.0) {
    const fragmentSrc = `
      precision mediump float;
      uniform sampler2D uSampler;
      uniform float uIntensity;
      varying vec2 vTextureCoord;

      void main(void) {
        vec4 color = texture2D(uSampler, vTextureCoord);
        float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(color.rgb + brightness * uIntensity, color.a);
      }
    `;
    super(null, fragmentSrc, { uIntensity: intensity });
  }

  set intensity(val) { this.uniforms.uIntensity = val; }
}

// Use karo
symbol.filters = [new GlowFilter(0.5)];
// Win pe intensity animate karo
gsap.to(glowFilter, { intensity: 2.0, duration: 0.3, yoyo: true, repeat: 3 });
```

### Common Slot Effects

| Effect | Implementation |
|---|---|
| Symbol glow (win) | Custom GlowFilter, animate intensity |
| Reel blur (spin) | BlurFilter Y-axis, velocity proportional |
| Win line highlight | Alpha animated Rectangle / Graphics |
| Big win shockwave | Displacement filter, radial map |
| Jackpot shimmer | UV offset shader, time uniform |
| Symbol darken (non-win) | ColorMatrixFilter, brightness reduce |

### ColorMatrixFilter — Dim Non-Winning Symbols

```javascript
// Win evaluation ke baad — non-winning symbols darken karo
const dimFilter = new PIXI.ColorMatrixFilter();
dimFilter.brightness(0.4, false); // 40% brightness

nonWinningSymbols.forEach(sym => {
  sym.filters = [dimFilter];
});

// Win presentation khatam → restore
gsap.to(dimFilter, {
  onComplete: () => { sym.filters = []; }
});
```

---

## 11. All Slot Game Features — Deep Dive

---

### 11.1 Free Spins Feature

**Kya hota hai:** Scatter symbols trigger karte hain — player ko free spins milte hain bina bet ke.

```
Trigger: 3+ Scatter anywhere on reels
Flow:
  1. Scatter land → celebration animation
  2. Free Spins count display (e.g., "10 FREE SPINS!")
  3. Background/theme change (ambient shift)
  4. Free spins play (bet locked — server se free spin flag)
  5. Retrigger possible (3+ scatter during free spins)
  6. Free spins end → total win display → return to base game
```

**State machine impact:**
```
BASE_GAME → FREE_SPINS_INTRO → FREE_SPIN_IDLE → FREE_SPIN_START
→ FREE_SPIN_RESULT → [RETRIGGER?] → FREE_SPINS_OUTRO → BASE_GAME
```

**PixiJS implementation notes:**
```javascript
class FreeSpinsFeature extends BaseFeature {
  onActivate({ count, multiplier }) {
    this.spinsRemaining = count;
    this.totalWin = 0;
    this.showFreeSpinsIntro();       // Transition animation
    this.swapBackground();           // Theme change
    this.uiManager.lockBetPanel();  // Bet change disable
    this.updateSpinCounter(count);
  }

  onSpin() {
    this.spinsRemaining--;
    this.updateSpinCounter(this.spinsRemaining);
  }

  onResult({ winAmount, retrigger }) {
    this.totalWin += winAmount;
    if (retrigger) this.addSpins(retrigger.count);
    if (this.spinsRemaining <= 0) this.triggerOutro();
  }
}
```

---

### 11.2 Wild Feature

**Types:**
| Type | Behavior |
|---|---|
| Standard Wild | Any non-scatter/bonus symbol replace karta hai |
| Expanding Wild | Poori column/row fill kar leta hai |
| Sticky Wild | Ek ya zyada spins tak jagah pe rehta hai |
| Walking Wild | Har spin mein left ya right shift hota hai |
| Stacked Wild | Multiple consecutive positions pe wild |
| Multiplier Wild | Win amount multiply karta hai (2x, 3x) |
| Colossal Wild | 2x2, 3x3 area cover karta hai |

**PixiJS implementation:**
```javascript
class ExpandingWildFeature extends BaseFeature {
  onResult({ expandingWilds }) {
    expandingWilds.forEach(({ reel, symbolIndex }) => {
      // Wild symbol land kiya
      this.playWildLandAnimation(reel, symbolIndex);

      // Expand karo — poori column
      gsap.to(wildSprite.scale, {
        y: TOTAL_COLUMNS,
        duration: 0.4,
        ease: 'back.out',
        onComplete: () => {
          // Baaki symbols replace karo
          this.fillColumnWithWild(reel);
          // Re-evaluate wins
          this.evaluateWins();
        }
      });
    });
  }
}

class StickyWildFeature extends BaseFeature {
  constructor() {
    this.stickyPositions = new Map(); // { "reel_row": sprite }
  }

  onResult({ newStickyWilds }) {
    newStickyWilds.forEach(pos => {
      const sprite = this.symbolPool.getSymbol('WILD');
      this.stickyPositions.set(`${pos.reel}_${pos.row}`, sprite);
    });
  }

  onSpin() {
    // Sticky wilds reels ke saath move nahi karte
    // Unhe fixed position pe rakh do during spin
    this.stickyPositions.forEach((sprite, key) => {
      sprite.visible = true; // Spin ke dauran bhi visible
    });
  }
}
```

---

### 11.3 Scatter Symbol

**Behavior:**
- Kisi bhi position pe pay karta hai (paylines pe land karna zaruri nahi)
- Usually free spins ya bonus trigger karta hai
- Kabhi kabhi "scatter pay" bhi deta hai (e.g., 3 scatters = 5x total bet)

```javascript
// Scatter evaluation — server side hoti hai
// Client side: scatter positions receive karo aur animate karo
onResult({ scatterPositions, scatterTrigger }) {
  scatterPositions.forEach(pos => {
    this.playScatterAnimation(pos.reel, pos.row);
  });

  if (scatterTrigger === 'FREE_SPINS') {
    // Delay ke baad free spins intro
    setTimeout(() => this.freeSpinsFeature.onActivate(), 2000);
  }
}
```

---

### 11.4 Multiplier Feature

**Types:**
- **Reel multiplier** — specific reel pe land ho to win multiply
- **Global multiplier** — poora win amount multiply
- **Progressive multiplier** — free spins mein har spin pe multiplier badh jaata hai (1x → 2x → 3x)
- **Wild multiplier** — wild symbol win ko multiply karta hai

```javascript
class MultiplierFeature extends BaseFeature {
  constructor() {
    this.currentMultiplier = 1;
  }

  // Progressive multiplier during free spins
  onSpin() {
    if (this.gameState === 'FREE_SPINS') {
      this.currentMultiplier++;
      this.updateMultiplierDisplay(this.currentMultiplier);
      this.playMultiplierBumpAnimation();
    }
  }

  applyMultiplier(baseWin) {
    const finalWin = baseWin * this.currentMultiplier;
    this.animateMultiplierEffect(baseWin, finalWin);
    return finalWin;
  }
}
```

---

### 11.5 Cascading / Tumbling Reels

**Kya hota hai:** Win ke baad winning symbols disappear ho jaate hain, upar se naye symbols "gir" ke aate hain. Agar phir win bane to cascade continue hota hai.

```
Spin → Win → Winning symbols explode → New symbols fall → Win check
  → Win again? → Repeat (cascade multiplier badh sakta hai)
  → No win → Cascade ends → Next spin
```

**PixiJS implementation:**
```javascript
class CascadeFeature extends BaseFeature {
  async processCascade(winPositions) {
    // 1. Winning symbols explode karo
    await this.explodeSymbols(winPositions);

    // 2. Existing symbols gravity se neeche giro
    await this.dropSymbols();

    // 3. Top se naye symbols fill karo (server se milte hain)
    await this.fillNewSymbols(this.serverData.newSymbols);

    // 4. Cascade multiplier update karo
    this.cascadeLevel++;
    this.updateCascadeMultiplier(this.cascadeLevel);

    // 5. Check for more wins (server ne bataya tha)
    if (this.serverData.cascadeWins.length > 0) {
      await this.processCascade(this.serverData.cascadeWins);
    }
  }

  dropSymbols() {
    // Each column mein symbols neeche animate karo
    return new Promise(resolve => {
      let animations = [];
      for (let col = 0; col < REEL_COUNT; col++) {
        const emptySlots = this.getEmptySlots(col);
        emptySlots.forEach(slot => {
          const symbol = this.getSymbolAbove(col, slot);
          if (symbol) {
            animations.push(
              gsap.to(symbol, {
                y: slot * SYMBOL_HEIGHT,
                duration: 0.3,
                ease: 'bounce.out'
              })
            );
          }
        });
      }
      Promise.all(animations.map(a => a.then())).then(resolve);
    });
  }
}
```

---

### 11.6 Hold & Spin Feature

**Kya hota hai:** Special symbols (usually coin/cash symbols) land karte hain → sab reels reset hoti hain → sirf coin symbols hold hote hain → 3 spins milte hain → koi naya coin aaye to spins reset ho jaate hain.

```
Trigger: 6+ coin symbols (game specific)
Flow:
  1. Transition to Hold & Spin mode
  2. Reels reset to blank
  3. Triggering coins locked in their positions
  4. 3 spins start (counter display)
  5. Har spin pe naye coins land kar sakte hain
  6. Naya coin → spins reset to 3
  7. Grand/Major/Minor/Mini jackpot positions fill karo
  8. 3 spins exhaust → total win calculate → outro
```

**PixiJS implementation:**
```javascript
class HoldSpinFeature extends BaseFeature {
  constructor() {
    this.lockedCoins = new Map();  // position → coin sprite
    this.spinsRemaining = 3;
    this.jackpotPositions = {
      GRAND: null, MAJOR: null, MINOR: null, MINI: null
    };
  }

  onActivate({ triggerCoins }) {
    this.showHoldSpinIntro();
    this.clearNonCoinSymbols(); // Blank symbols dikho
    this.lockCoins(triggerCoins);
  }

  lockCoins(coins) {
    coins.forEach(coin => {
      const sprite = this.createCoinSprite(coin);
      this.lockedCoins.set(`${coin.reel}_${coin.row}`, sprite);
      this.playCoinLockAnimation(sprite);
    });
  }

  onResult({ newCoins, spinsReset }) {
    if (newCoins.length > 0) {
      this.lockCoins(newCoins);
      if (spinsReset) {
        this.spinsRemaining = 3;
        this.playSpinsResetAnimation();
      }
    }
    this.spinsRemaining--;
    this.updateSpinCounter(this.spinsRemaining);

    if (this.spinsRemaining <= 0) this.endHoldSpin();
  }

  endHoldSpin() {
    // All coin values sum karo
    // Jackpot check karo
    this.showTotalWin(this.calculateTotal());
  }
}
```

---

### 11.7 Jackpot Feature (WAP/MLP)

**Jackpot Tiers:**
```
GRAND   → Largest (WAP mein network-wide pool)
MAJOR   → Second
MINOR   → Third
MINI    → Smallest (most frequent)
```

**Meter Animation (Critical for VLT):**
```javascript
class JackpotFeature extends BaseFeature {
  constructor() {
    this.meters = {
      GRAND: { value: 0, display: null, targetValue: 0 },
      MAJOR: { value: 0, display: null, targetValue: 0 }
    };
    this.ws = null; // WebSocket connection
  }

  connectToJackpotFeed() {
    this.ws = new WebSocket(JACKPOT_WS_URL);
    this.ws.onmessage = ({ data }) => {
      const { tier, amount } = JSON.parse(data);
      this.updateMeter(tier, amount);
    };
  }

  updateMeter(tier, newAmount) {
    const meter = this.meters[tier];
    // Smooth animation — sudden jump nahi
    gsap.to(meter, {
      value: newAmount,
      duration: 0.5,
      ease: 'none',
      onUpdate: () => {
        meter.display.text = this.formatCurrency(meter.value);
      }
    });
  }

  triggerJackpotWin(tier) {
    // Jackpot win animation — full screen takeover
    this.showJackpotCelebration(tier);
    this.playJackpotSound(tier);
    this.rollUpMeter(0, this.meters[tier].value); // Count se 0 tak roll down
  }
}
```

---

### 11.8 Cluster Pays

**Kya hota hai:** Paylines nahi hote — adjacent symbols ka cluster (usually 5+) win deta hai. BFS/flood-fill se cluster detect hota hai.

```javascript
// Server side calculate karta hai — client sirf animate karta hai
// Lekin interview mein logic samajhna chahiye:

function findClusters(grid, symbolId) {
  const visited = new Set();
  const clusters = [];

  function bfs(startRow, startCol) {
    const queue = [[startRow, startCol]];
    const cluster = [];
    while (queue.length) {
      const [r, c] = queue.shift();
      const key = `${r}_${c}`;
      if (visited.has(key)) continue;
      if (grid[r][c] !== symbolId) continue;
      visited.add(key);
      cluster.push({ row: r, col: c });
      // Adjacent 4 directions check
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS)
          queue.push([nr, nc]);
      });
    }
    return cluster;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === symbolId && !visited.has(`${r}_${c}`)) {
        const cluster = bfs(r, c);
        if (cluster.length >= MIN_CLUSTER_SIZE) clusters.push(cluster);
      }
    }
  }
  return clusters;
}
```

---

### 11.9 Megaways™

**Kya hota hai:** Har reel pe random number of symbols (2–7) dikhti hain — isliye ways to win bahut zyada ho sakti hain (up to 117,649).

```
Ways calculation:
  Reel 1 symbols × Reel 2 symbols × Reel 3 symbols × ... = Total ways

  E.g.: 7 × 6 × 5 × 4 × 3 × 2 = 2,520 ways (ek specific spin mein)
  Max: 7 × 7 × 7 × 7 × 7 × 7 = 117,649 ways
```

**PixiJS implementation challenge:**
```javascript
// Reel heights dynamic hain — symbols ka size adjust karna padta hai
class MegawaysReel extends Reel {
  update(symbolCount) {
    this.visibleSymbols = symbolCount; // 2–7
    const symbolHeight = REEL_HEIGHT / symbolCount;

    // Symbols resize aur reposition karo
    for (let i = 0; i < symbolCount; i++) {
      this.symbols[i].height = symbolHeight;
      this.symbols[i].y = i * symbolHeight;
    }
  }
}

// Horizontal reel (top/bottom strip) bhi hoti hai — "Reactions" mechanic
```

---

### 11.10 Bonus Game / Pick Feature

**Kya hota hai:** Scatter trigger karta hai → alag scene open hota hai → player items pick karta hai → prizes milti hain.

```javascript
class BonusGameFeature extends BaseFeature {
  onActivate({ bonusItems, maxPicks }) {
    this.hideMainGame();
    this.showBonusScene();
    this.createPickItems(bonusItems); // Server ne pre-determined kiya hua
    this.picksRemaining = maxPicks;
  }

  onItemPick(itemIndex) {
    const result = this.bonusItems[itemIndex];

    if (result.type === 'PRIZE') {
      this.revealPrize(itemIndex, result.amount);
      this.totalWin += result.amount;
    } else if (result.type === 'COLLECT') {
      this.endBonusGame();
    } else if (result.type === 'BONUS_BONUS') {
      this.triggerBonusWithinBonus();
    }

    this.picksRemaining--;
    if (this.picksRemaining <= 0) this.endBonusGame();
  }

  endBonusGame() {
    this.showTotalBonusWin();
    // Transition back to main game
    setTimeout(() => {
      this.showMainGame();
      this.stateMachine.transition('BASE_IDLE');
    }, 3000);
  }
}
```

---

### 11.11 Gamble Feature

**Markets:** Available in most markets EXCEPT some regulated (PA gambling restrictions check karo)

**Types:**
- Card Gamble (Red/Black)
- Suit Gamble (♠♥♦♣)
- Ladder Gamble (ek ek step up)

```javascript
class GambleFeature extends BaseFeature {
  onActivate({ currentWin }) {
    this.gambleAmount = currentWin;
    this.showGambleUI(currentWin);
  }

  onPlayerChoice(choice) {
    // Server result wait karo
    this.sendGambleChoice(choice);
  }

  onResult({ win, newAmount, card }) {
    this.revealCard(card);
    if (win) {
      this.showWin(newAmount);
      this.gambleAmount = newAmount;
      // Offer to gamble again ya collect
    } else {
      this.showLoss();
      this.onComplete(); // Back to base game
    }
  }
}
```

---

### 11.12 Buy Feature / Bonus Buy

**Kya hota hai:** Player directly bonus/free spins khareed sakta hai — scatter land karne ka wait nahi karna.

**Market restriction:** UK (UKGC) mein banned hai!

```javascript
class BonusBuyFeature extends BaseFeature {
  getBuyOptions() {
    return [
      { label: 'Free Spins', cost: currentBet * 80, feature: 'FREE_SPINS' },
      { label: 'Free Spins + Multiplier', cost: currentBet * 200, feature: 'FS_MULTIPLIER' }
    ];
  }

  onPlayerBuy(option) {
    // Market check
    if (MARKET_CONFIG.bonusBuyAllowed === false) {
      console.error('Bonus buy not allowed in this market');
      return;
    }
    // Balance check
    if (balance < option.cost) {
      this.showInsufficientFunds();
      return;
    }
    this.sendBonusBuyRequest(option);
  }
}
```

---

## 12. State Machine — Complete Flow

```
                        ┌─────────────────────────────┐
                        │                             │
                        ▼                             │
┌─────────┐  SPIN    ┌──────────┐  STOP   ┌─────────┐│
│  IDLE   │─────────▶│ SPINNING │────────▶│ RESULT  ││
└─────────┘          └──────────┘         └────┬────┘│
     ▲                                         │      │
     │                              ┌──────────┼──────┘
     │                              │          │
     │                    ┌─────────▼──┐  ┌───▼──────────┐
     │                    │ NO FEATURE │  │ FEATURE      │
     │                    │   WIN PRES │  │ TRIGGER      │
     │                    └─────┬──────┘  └───┬──────────┘
     │                          │              │
     │                          │    ┌─────────▼──────────────┐
     │                          │    │ FREE_SPINS / HOLD_SPIN  │
     │                          │    │ BONUS_GAME / etc.       │
     │                          │    └─────────┬──────────────┘
     │                          │              │
     └──────────────────────────┴──────────────┘
                              IDLE

// State machine implementation
class StateMachine {
  constructor() {
    this.state = 'IDLE';
    this.transitions = {
      IDLE:        ['SPINNING'],
      SPINNING:    ['RESULT'],
      RESULT:      ['WIN_PRESENTATION', 'FEATURE_TRIGGER', 'IDLE'],
      WIN_PRESENTATION: ['FEATURE_TRIGGER', 'IDLE'],
      FEATURE_TRIGGER: ['FREE_SPINS', 'HOLD_SPIN', 'BONUS_GAME'],
      FREE_SPINS:  ['FREE_SPIN_IDLE'],
      FREE_SPIN_IDLE: ['FREE_SPINNING'],
      FREE_SPINNING: ['FREE_RESULT'],
      FREE_RESULT: ['FREE_SPIN_IDLE', 'FREE_SPINS_END'],
      FREE_SPINS_END: ['IDLE'],
      HOLD_SPIN:   ['HOLD_SPIN_IDLE'],
      // ... etc
    };
  }

  transition(newState) {
    if (!this.transitions[this.state].includes(newState)) {
      throw new Error(`Invalid transition: ${this.state} → ${newState}`);
    }
    this.emit('stateChange', { from: this.state, to: newState });
    this.state = newState;
  }
}
```

---

## 13. WebSocket / Server Communication

### Spin Flow

```javascript
// 1. Spin request
const spinRequest = {
  gameId: 'QUICK_HIT_001',
  sessionToken: 'abc123',
  betAmount: 1.00,
  betLines: 25,
  currency: 'CAD'
};

// 2. Server response
const spinResponse = {
  reelStops: [4, 12, 7, 23, 15],       // Reel strip positions
  symbols: [[3,1,5],[2,0,4],[1,3,2],[5,1,0],[4,2,3]], // Grid
  winAmount: 5.00,
  winLines: [{ lineId: 3, symbolId: 1, count: 4, winAmount: 5.00 }],
  features: {
    freeSpins: null,
    holdSpin: null,
    jackpot: null
  },
  balance: 94.50,
  newState: 'WIN_PRESENTATION'
};

// 3. Client sirf animate karta hai — KABHI calculate nahi karta
class SpinManager {
  async spin() {
    this.stateMachine.transition('SPINNING');
    this.reelSystem.startSpin();

    const response = await this.api.spin(spinRequest);

    // Server ne sab bataya — client follow karta hai
    this.reelSystem.stopAt(response.reelStops);
    this.winManager.present(response.winLines, response.winAmount);

    if (response.features.freeSpins) {
      this.freeSpinsFeature.onActivate(response.features.freeSpins);
    }
  }
}
```

### Progressive Meter WebSocket

```javascript
// Separate persistent connection for jackpot meters
class ProgressiveWebSocket {
  connect() {
    this.ws = new WebSocket(PROGRESSIVE_FEED_URL);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // { tier: 'GRAND', amount: 15234.56 }
      this.jackpotFeature.updateMeter(data.tier, data.amount);
    };

    this.ws.onclose = () => {
      // Reconnect with exponential backoff
      setTimeout(() => this.connect(), this.backoffDelay());
    };
  }
}
```

---

## 14. Autoplay & Session Logic

```javascript
class AutoplayManager {
  constructor() {
    this.config = {
      spinsSelected: 0,      // 10/25/50/100/∞
      spinsPlayed: 0,
      lossLimit: null,        // Optional — stop agar iss se zyada loss
      singleWinLimit: null,   // Optional — stop agar koi win isse zyada
      stopOnBonus: true,      // Bonus trigger pe stop?
      stopOnFreeSpin: true    // Free spins pe stop?
    };
    this.active = false;
    this.startBalance = 0;
  }

  start(config) {
    this.config = { ...this.config, ...config };
    this.active = true;
    this.startBalance = currentBalance;
    this.scheduleNextSpin();
  }

  afterSpinCheck(result) {
    this.config.spinsPlayed++;

    // Checks
    if (this.config.spinsSelected !== -1 &&
        this.config.spinsPlayed >= this.config.spinsSelected) {
      return this.stop('SPINS_COMPLETE');
    }

    const currentLoss = this.startBalance - currentBalance;
    if (this.config.lossLimit && currentLoss >= this.config.lossLimit) {
      return this.stop('LOSS_LIMIT_REACHED');
    }

    if (this.config.singleWinLimit && result.winAmount >= this.config.singleWinLimit) {
      return this.stop('WIN_LIMIT_REACHED');
    }

    if (this.config.stopOnBonus && result.features.bonus) {
      return this.stop('BONUS_TRIGGERED');
    }

    this.scheduleNextSpin();
  }

  scheduleNextSpin() {
    // Minimum spin time enforce karo (regulated markets)
    const elapsed = Date.now() - this.lastSpinTime;
    const delay = Math.max(0, MIN_SPIN_TIME - elapsed);
    setTimeout(() => this.spinManager.spin(), delay);
  }
}
```

---

## 15. Responsible Gaming UI

| Feature | Description | Code |
|---|---|---|
| Session Timer | Play time display | `Date.now() - sessionStart` |
| Reality Check | Popup every N minutes | Configurable interval |
| Net Win/Loss | Session P&L display | `balance - sessionStartBalance` |
| Self-Exclusion | Pre-launch API check | Block game if excluded |
| Bet Limits | Per spin max bet | UI disable + server validate |
| Deposit Limits | Wallet level | Server side |
| Cooling Off | Forced break | Timer + game lock |
| Problem Gambling Links | Always visible | Static UI element |

```javascript
class RGManager {
  constructor() {
    this.sessionStart = Date.now();
    this.realityCheckInterval = 30 * 60 * 1000; // 30 min default
  }

  startRealityCheckTimer() {
    this.timer = setInterval(() => {
      this.showRealityCheck();
      this.pauseGame(); // Game pause until player acknowledges
    }, this.realityCheckInterval);
  }

  showRealityCheck() {
    const elapsed = this.formatTime(Date.now() - this.sessionStart);
    const netPL = currentBalance - this.sessionStartBalance;

    this.popup.show({
      title: 'Reality Check',
      timeOnSite: elapsed,
      netWinLoss: netPL,
      buttons: ['Continue Playing', 'End Session']
    });
  }
}
```

---

## 16. Localization — Dev Perspective

| Market | Currency | Language | Special Rules |
|---|---|---|---|
| Canada (ON) | CAD | EN / FR | French mandatory, AGCO rules |
| Pennsylvania | USD | EN | PA Gaming Control Board |
| Germany | EUR | DE | Spin rate limit, loss limits |
| UK | GBP | EN | UKGC: no autoplay (some), no bonus buy |
| Netherlands | EUR | NL | KSA: strict RG requirements |

```javascript
// Currency — NEVER hardcode
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: marketConfig.currency, // 'CAD', 'USD', 'GBP'
  minimumFractionDigits: 2
});
formatter.format(1234.5); // "$1,234.50" ya "€1.234,50"

// i18n
i18next.init({
  lng: marketConfig.language, // 'en', 'fr', 'de'
  resources: {
    en: { translation: { spin: 'SPIN', win: 'WIN' } },
    fr: { translation: { spin: 'TOURNER', win: 'GAIN' } },
    de: { translation: { spin: 'DREHEN', win: 'GEWINN' } }
  }
});

t('spin'); // Market ke hisaab se correct word
```

---

## 17. Performance Optimization Checklist

### Rendering
- [ ] Sab symbols ek TextureAtlas se
- [ ] Static backgrounds RenderTexture se cache
- [ ] ParticleContainer win effects ke liye
- [ ] Draw calls < 30 per frame target
- [ ] Blend mode changes minimize karo

### Memory
- [ ] Symbol object pooling active
- [ ] Particle pool active
- [ ] Unused textures unload karo (feature change pe)
- [ ] Event listeners properly remove karo
- [ ] PIXI objects properly destroy karo when needed

### CPU/GPU
- [ ] Win effects GLSL shaders se (CPU nahi)
- [ ] Reel blur shader (not CSS filter)
- [ ] GSAP se animations (requestAnimationFrame optimized)
- [ ] Avoid per-frame DOM manipulation

### Code
- [ ] `PIXI.BitmapText` for score/counter text (not PIXI.Text)
- [ ] Ticker se sirf active animations run hone chahiye
- [ ] State machine — sirf current state ka logic active

### Mobile Specific
- [ ] Touch events optimized (no 300ms delay)
- [ ] Resolution scaling (devicePixelRatio aware)
- [ ] Lower particle count on mobile
- [ ] Texture compression (ASTC/ETC2 for mobile)

---

## 18. Animation Guidelines (Casino = Restraint)

| Do ✅ | Don't ❌ |
|---|---|
| Reel stop pe symbol "settle" bounce | Screen shake on small wins |
| Proportional win celebrations | Same fanfare for $0.10 and $500 win |
| Readable outcome first, effects second | Particles covering winning symbols |
| Smooth progressive meter count up | Sudden jackpot number jump |
| Anticipation builds tension naturally | Random anticipation (player trust breaks) |
| Big win: slow reveal, dramatic pause | Instant big win display (kills moment) |
| Dim non-winning symbols | Flash entire screen randomly |
| Consistent timing (cabinet-matched) | Variable timing per feature |

### Win Tier Animation Duration Guide
```
< 1x bet      → Quick flash (0.5s), no fanfare
1–5x bet      → Coin shower (1.5s)
5–20x bet     → Medium celebration (2.5s) + sound
20–50x bet    → Big win screen (4s) + music change
50–100x bet   → Epic win (6s) + special effect
100x+ bet     → MEGA WIN (8s+) + full screen takeover
Jackpot       → 10s+ + unique jackpot sequence
```

---

## 19. Interview Terms Glossary

| Term | Matlab |
|---|---|
| Feature Parity | iGaming = cabinet ka exact same behavior |
| Cabinet Soul | Core gameplay feel jo preserve karna hai |
| Anticipation | Near-miss tension animation/sound |
| Reel Rhythm | Spin/stop ka timing pattern |
| Regulated UX | Jurisdiction rules ke according UI |
| RTP | Return to Player — math model ka % |
| WAP | Wide Area Progressive — multi-venue jackpot |
| MLP | Multi Linked Progressive — controlled network |
| SAP | Stand Alone Progressive — single machine |
| Server Authoritative | Wins server decide karta hai, client nahi |
| Config-Driven | Behavior hardcode nahi, JSON/config se |
| Draw Call | GPU ko ek render instruction |
| Texture Atlas | Multiple textures ek image mein pack |
| Object Pool | Pre-created objects reuse karo, destroy mat |
| State Machine | Game states ko control karne ka system |
| Symbol Strip | Reel ka ordered symbol array |
| Stop Position | Server-determined reel stop index |
| Cascade | Win ke baad symbols fall, naye aate hain |
| Hold & Spin | Coin symbols lock, 3 spins mechanic |
| Megaways | Dynamic reel height, max 117,649 ways |
| Cluster Pays | Adjacent symbols group se win |
| Scatter Pay | Anywhere on grid pay karta hai |
| Sticky Wild | Wild jo position pe ek ya zyada spins rahe |
| GLI/BMM | Testing labs for game certification |
| AGCO | Alcohol and Gaming Commission of Ontario |
| PGCB | Pennsylvania Gaming Control Board |
| UKGC | UK Gambling Commission |

---

## 20. Interview Q&A — Full Set

**Q: Cabinet se iGaming mein kya preserve karna sabse important hai?**
> Reel rhythm aur anticipation timing. Player ka muscle memory cabinet se ban chuka hai — agar browser mein reel 50ms jaldi ruke ya anticipation sound late aaye, woh immediately notice karta hai. Trust toot jaata hai.

**Q: Draw calls kya hote hain aur slot game mein kaise optimize karte ho?**
> Draw call GPU ko ek render instruction hai. Zyada draw calls = CPU→GPU overhead = FPS drop. Optimize karne ke liye: sab symbols ek TextureAtlas mein pack karo taaki batch ek call mein render ho. Static background ko RenderTexture mein cache karo. Win effects ke liye ParticleContainer use karo. Blend mode changes minimize karo kyunki woh batch break karte hain. Target: 20-30 draw calls per frame.

**Q: Object pooling kab aur kyun use karte ho?**
> Jab objects frequently create/destroy hote hain — jaise reel symbols jo har spin pe cycle hote hain, ya win particles. `new PIXI.Sprite()` aur `destroy()` ka frequent call GC (garbage collection) pressure create karta hai jo frame drops cause karta hai. Pool mein objects pre-create karo, reuse karo — visible=false karke return karo pool mein, destroy nahi karo.

**Q: Hold & Spin feature kaise implement karte ho?**
> Teen phases hote hain: Activate pe reels blank ho jaati hain aur triggering coins lock ho jaate hain, unki positions Map mein store karo. Spin phase mein naye coins land kar sakte hain — har naya coin spins counter reset kar deta hai 3 pe. End phase mein sab coin values add karo, jackpot check karo, total win display karo.

**Q: Server authoritative architecture kyun zaroori hai?**
> Regulated requirement hai — wins kabhi client side calculate nahi hote. Server certified RNG se result determine karta hai. Client sirf animate karta hai. Agar client calculate kare to game manipulate ho sakti hai. Certification labs (GLI, BMM) verify karte hain ki result determination server pe hi ho.

**Q: WAP aur MLP mein difference kya hai?**
> WAP = Wide Area Progressive — multiple operators/venues ke across shared pool, isliye jackpot bahut bada hota hai. MLP = Multi Linked Progressive — ek controlled network ke andar specific machines linked hain. Dev impact: dono ke liye WebSocket se real-time meter sync, lekin WAP feed external provider se aati hai (e.g., SG network), MLP internal hoti hai.

**Q: Megaways mechanic kya challenge create karta hai?**
> Reel heights dynamic hoti hain (2–7 symbols per reel per spin). Isliye symbol sizes dynamically calculate karne padte hain. Ways to win bhi dynamic hain — har spin mein alag. Win evaluation complex hoti hai: server side hoti hai lekin client ko display karna hota hai ki "X ways" win kiya. ParticleContainer aur pooling zyada important ho jaata hai kyunki zyada symbols possible hain.

**Q: Cascade feature aur free spins mein multiplier kaise kaam karta hai?**
> Cascade mein har successive win ke baad multiplier badhta hai (1x → 2x → 3x → ...). Free spins mein ya to static multiplier hota hai ya progressive (har free spin pe badh jaata hai). PixiJS mein: server response mein current multiplier aata hai, client multiplier display animate karta hai aur win amount formula server se aata hai — client calculate nahi karta.

**Q: Mobile pe performance different kyun hoti hai aur kaise handle karte ho?**
> Mobile pe: GPU weaker hai, memory limited hai, touchscreen hai. Solutions: devicePixelRatio ke hisaab se resolution scale karo, mobile pe particle count reduce karo, texture compression use karo (ASTC/ETC2), touch events optimize karo (fastclick ya pointer events API). Lower-end devices ke liye shader effects reduce ya disable karo — config mein quality setting rakho.

---

## 21. Games to Study + Homework Answers

| Game | Link/Source | Kya Notice Karo |
|---|---|---|
| Quick Hit Blitz Blue | igaming.lnw.com/games/quick-hit-blitz-blue/ | Reel rhythm, anticipation arrows |
| 88 Fortunes | YouTube | Progressive meter animation, WAP feed |
| Monopoly WMS | YouTube | Bonus game transition, feature parity |

### 5 Adaptation Risks (Homework Answer)
1. **Reel timing mismatch** — browser `requestAnimationFrame` 60fps vs cabinet hardware timing — custom easing curves carefully tune karo
2. **Audio latency** — Web Audio API cabinet speaker se different hai — AudioContext unlock (user gesture required) handle karo
3. **Responsive UI breaks** — cabinet fixed resolution tha, mobile pe asset reflow — anchor points aur percentage-based layout use karo
4. **Progressive meter lag** — WebSocket delay se meter jump dikhta hai — smooth lerp/GSAP tween mandatory
5. **Autoplay regulation** — kuch markets (UKGC) mein autoplay restricted ya banned — feature ko config-driven rakho, market flag se toggle hona chahiye

### 3 Things That Must Never Change
1. **Reel rhythm + anticipation timing** — player trust ka base
2. **Feature sequencing** — bonus trigger ka exact flow aur transitions
3. **Win pacing** — win tier celebrations ka relative duration ratio

### Cabinet vs iGaming Key Differences
| Cabinet | iGaming |
|---|---|
| Physical buttons | Touch/click events |
| Hardware RNG chip | Server-side certified RNG |
| Fixed screen resolution | Responsive viewport |
| Cabinet-controlled pacing | Code-enforced min spin time |
| Coin mechanism | Virtual balance + wallet |
| Venue-based play | Anywhere, any device |
| Hardware-tested | Software GLI/BMM certified |

---

*Prepared for ZVKY Design Studio / VLT client context | SG–LnW iGaming*  
*PixiJS v7/v8 · WebGL · GSAP · WebSocket · Regulated Markets*