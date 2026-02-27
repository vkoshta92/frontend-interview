# 🎰 PixiJS Slot Game Development — Senior Guide

A complete reference covering core concepts used in **HTML5 / iGaming / PixiJS slot games**.

---

# 📌 Table of Contents

1. Drop Calls
2. Lazy Loading
3. Canvas vs WebGL
4. WebGL Basics
5. PixiJS Rendering
6. Structure of Pixi Game
7. Reel Spin Working Logic
8. Infinite Reel Spin Management
9. Object Pooling
10. Reel Spin State Machine (Deep Explanation)

---

# 1️⃣ Drop Calls (Game Server Communication)

## Concept

A **Drop Call** is an API request sent from frontend to backend to get game results.

Slot games are **server-authoritative**.

```
User Click Spin
      ↓
Frontend API Call
      ↓
Game Server + RNG
      ↓
Result JSON Returned
```

## Example

```js
async function spin() {
  const res = await fetch("/api/spin");
  const result = await res.json();

  startReelAnimation(result.reels);
}
```

👉 Result is decided BEFORE animation starts.

---

# 2️⃣ Lazy Loading

## Concept

Load assets only when needed to reduce initial load time.

### Why?

Slot assets are heavy:

* textures
* sounds
* bonus animations

---

## PixiJS Example

```js
await PIXI.Assets.load(["baseSymbols.png"]);

// later (bonus triggered)
await PIXI.Assets.load(["bonusAssets.png"]);
```

### Benefits

* Faster startup
* Lower memory usage
* Better mobile performance

---

# 3️⃣ Canvas vs WebGL

| Canvas                | WebGL                      |
| --------------------- | -------------------------- |
| CPU rendering         | GPU rendering              |
| Simple drawing        | High-performance graphics  |
| Slow for many objects | Handles thousands smoothly |

---

## Canvas Example

```js
const ctx = canvas.getContext("2d");
ctx.fillRect(10,10,100,100);
```

CPU redraws every frame.

---

## WebGL Example

```js
const gl = canvas.getContext("webgl");
gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);
```

GPU handles rendering.

---

# 4️⃣ WebGL Basics

WebGL sends drawing instructions to GPU.

Pipeline:

```
JS → WebGL → GPU → Screen
```

Advantages:

* Parallel rendering
* Texture batching
* Smooth animation (60 FPS)

---

# 5️⃣ PixiJS Rendering

PixiJS is a **WebGL renderer abstraction**.

```
Game Code
   ↓
PixiJS
   ↓
WebGL Renderer
   ↓
GPU
```

---

## Setup

```js
const app = new PIXI.Application({
  width: 800,
  height: 600
});

document.body.appendChild(app.view);
```

---

## Add Sprite

```js
const sprite = PIXI.Sprite.from("symbol.png");
app.stage.addChild(sprite);
```

---

# 6️⃣ Structure of a Pixi Slot Game

```
src/
 ├ core/
 │   ├ Game.ts
 │   ├ StateManager.ts
 │
 ├ reels/
 │   ├ Reel.ts
 │   ├ ReelManager.ts
 │
 ├ pool/
 │   ├ SymbolPool.ts
 │
 ├ network/
 │   ├ ApiService.ts
 │
 ├ ui/
 │   ├ HUD.ts
```

### Main Components

* GameController
* ReelManager
* SymbolPool
* NetworkManager
* UI Layer

---

# 7️⃣ Reel Spin Working Logic

## Important Truth

Reels DO NOT actually spin infinitely.

They move sprites in a loop.

---

## Reel Container

```
Reel Container
  Symbol
  Symbol
  Symbol
```

---

## Movement

```js
app.ticker.add(() => {
  reel.y += speed;
});
```

---

## Recycling Symbol

```js
if(symbol.y > bottomLimit){
   symbol.y -= reelHeight;
   symbol.texture = randomTexture();
}
```

Creates spinning illusion.

---

# 8️⃣ Infinite Reel Spin Management

Only few sprites exist.

```
Visible symbols = 3
Buffer symbols = 6
Total sprites ≈ 9
```

---

## Loop Logic

```js
symbols.forEach(symbol => {
  symbol.y += speed;

  if(symbol.y > limit){
    symbol.y -= totalHeight;
    changeTexture(symbol);
  }
});
```

No new objects created.

---

# 9️⃣ Object Pooling

## Concept

Reuse objects instead of creating/destroying repeatedly.

---

## Pool Class Example

```js
class Pool {
  constructor(createFn){
    this.items = [];
    this.createFn = createFn;
  }

  get(){
    return this.items.pop() || this.createFn();
  }

  release(obj){
    this.items.push(obj);
  }
}
```

---

## Usage

```js
const symbolPool = new Pool(
  () => PIXI.Sprite.from("symbol.png")
);

const sprite = symbolPool.get();
symbolPool.release(sprite);
```

---

## Why Important?

Avoids:

* Garbage collection spikes
* FPS drops
* Memory leaks

---

# 🔟 Reel Spin State Machine (Deep Explanation)

Professional slot games use **state machines**.

---

## States

```
IDLE
 ↓
SPIN_REQUEST
 ↓
SPINNING
 ↓
STOPPING
 ↓
RESULT
 ↓
BONUS (optional)
 ↓
IDLE
```

---

## State Explanation

### IDLE

Waiting for player input.

---

### SPIN_REQUEST

API call sent.

```js
state = "SPIN_REQUEST";
```

---

### SPINNING

Reels move continuously.

```js
speed = maxSpeed;
```

---

### STOPPING

Reels slow using easing.

```js
speed *= 0.95;
```

Each reel stops sequentially.

---

### RESULT

Final symbols aligned.

Win calculation animation starts.

---

### BONUS

Optional:

* Free spins
* Hold & Spin
* Cascades

---

## State Manager Example

```js
switch(state){

 case "SPINNING":
   updateReels();
   break;

 case "STOPPING":
   slowDown();
   break;
}
```

---

# ⭐ Senior Developer Best Practices

✅ Use texture atlases
✅ Reuse sprites (pooling)
✅ Lazy load bonus assets
✅ Keep draw calls low
✅ Separate game states
✅ Backend decides results

---

# 🏁 Final Architecture

```
React UI
   ↓
PixiJS Game Layer
   ↓
WebGL Renderer
   ↓
GPU
```

Backend:

```
Game Server → RNG → Wallet
```

---

# 🎯 Key Takeaway

A slot game is:

> Animation + State Machine + GPU Rendering + Server RNG

NOT just spinning images.

---

**End of Guide**
