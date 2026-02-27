---

# 🔥 CRITICAL SENIOR GAME DEVELOPER QUESTIONS (10+ YEARS EXPERIENCE)

## (PixiJS • WebGL • iGaming • Engine Architecture)

These questions evaluate whether a developer thinks like a **system designer**, not just a coder.

---

# 51️⃣ How Do You Design a Slot Engine That Scales to 100+ Games?

### What Interviewer Tests

Architecture thinking.

### Expected Answer

Separate reusable engine from game content.

```
Core Engine
 ├ Rendering System
 ├ Reel Engine
 ├ State Machine
 ├ Animation System
 └ Plugin System

Game Config (JSON)
 ├ symbols
 ├ paylines
 ├ features
```

### Key Idea

Engine logic reusable, game data configurable.

---

# 52️⃣ How Do You Prevent Frame Drops During Heavy Animations?

### Senior Thinking

Never optimize animation first — optimize pipeline.

Steps:

1. Reduce draw calls
2. Batch textures
3. Pool objects
4. Reduce filters
5. Move work to GPU

### Example

Bad:

```js
new Sprite() each frame
```

Good:

```js
reuse pooled sprite
```

---

# 53️⃣ How Would You Debug Random FPS Drops in Production?

### Senior Process

1. Record performance profile
2. Check frame timeline
3. Identify spikes
4. Inspect GC events
5. Analyze draw calls

### Tools

* Chrome Performance
* WebGL Inspector
* Pixi DevTools

---

# 54️⃣ How Do You Design Reel Logic Independent of Rendering?

### Principle

Game logic must run without visuals.

```
Math Engine → result
Renderer → visualization
```

### Example

```js
const result = mathEngine.spin();
renderer.play(result);
```

Benefits:

* testable logic
* deterministic behavior

---

# 55️⃣ How Do You Handle Network Delay During Spin?

### Senior Solution

Never wait visually.

```
Start fake spin animation
↓
Receive server result
↓
Adjust stopping timing
```

Player never sees latency.

---

# 56️⃣ How Do You Guarantee Deterministic Animations?

### Concept

Same input → same output.

Avoid randomness during animation.

Bad:

```js
Math.random() during stop
```

Good:
Use backend seed/result.

---

# 57️⃣ How Do You Design Feature Systems (Free Spins, Bonus)?

### Senior Pattern

Use feature plugins.

```
Feature Interface
 ├ enter()
 ├ update()
 ├ exit()
```

Example:

```js
class FreeSpinFeature extends Feature {}
```

Engine loads features dynamically.

---

# 58️⃣ How Do You Reduce Memory Fragmentation?

### Techniques

* object pooling
* reuse textures
* avoid frequent allocation
* preload atlases

Senior dev understands browser GC behavior.

---

# 59️⃣ How Do You Optimize for Low-End Mobile Devices?

### Strategy

Dynamic quality scaling.

```
High FPS → full effects
Low FPS → reduce filters
```

Example:

```js
if(fps < 40) disableBlur();
```

---

# 60️⃣ How Do You Structure Animation Systems?

### Senior Architecture

Separate animation controller.

```
AnimationManager
 ├ reel animations
 ├ win animations
 ├ transitions
```

Never mix animation inside game logic.

---

# 61️⃣ How Would You Implement a Global Event System?

### Pattern

Event Bus.

```js
eventBus.emit("SPIN_START");
eventBus.on("SPIN_START", handler);
```

Decouples modules.

---

# 62️⃣ How Do You Avoid Tight Coupling?

Bad:

```
Reel → API → UI → Animation
```

Good:

```
StateManager controls communication.
```

Modules communicate via events.

---

# 63️⃣ Explain GPU Bottleneck vs CPU Bottleneck

### CPU Bottleneck

Too much logic or allocations.

### GPU Bottleneck

Too many draw calls or filters.

Senior dev identifies which pipeline fails.

---

# 64️⃣ How Do You Maintain 60FPS Consistency?

Focus on **frame time**, not FPS.

Target:

```
16.6ms per frame
```

Reduce spikes instead of increasing average FPS.

---

# 65️⃣ How Do You Design a Replayable Spin System?

Store:

```
seed
result
bet
timestamp
```

Replay animation deterministically.

Used for audits.

---

# 66️⃣ How Do You Test Slot Logic Without UI?

Unit test math engine.

```js
expect(spinResult.win).toBe(true);
```

Rendering not required.

---

# 67️⃣ How Do You Handle Asset Versioning?

Use hashed filenames.

```
symbols.a83f2.png
```

Prevents caching issues.

---

# 68️⃣ How Do You Handle Thousands of Particles Efficiently?

Use GPU particle emitter.

Avoid creating sprites individually.

---

# 69️⃣ What Makes a Game Engine Maintainable Long-Term?

Senior answer:

* modular systems
* clear ownership
* minimal dependencies
* configuration-driven design

---

# 70️⃣ Biggest Mistake Mid-Level Developers Make?

They optimize visuals before architecture.

Senior dev optimizes **data flow first**.

---

# ⭐ LEAD ENGINEER MINDSET (10+ YEARS)

A senior developer stops thinking:

> “How do I code this?”

and starts thinking:

> “How will this system behave in 3 years?”

---

# 🏁 FINAL SENIOR PRINCIPLE

```
Predictability > Cleverness
Stability > Features
Architecture > Hacks
```

---

**END — 10+ YEAR SENIOR QUESTIONS**
