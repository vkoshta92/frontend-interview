# 🎮 PixiJS Slot Game — Core Architecture & Senior Concepts Guide

A deep technical reference covering essential systems used in **HTML5 Slot Games**, **PixiJS**, and **iGaming architecture**.

---

# 📚 Topics Covered

1. Drop Calls
2. Lazy Loading
3. Canvas vs WebGL
4. WebGL Basics
5. PixiJS Rendering Pipeline
6. Pixi Game Structure
7. Reel Spin Logic
8. Infinite Reel Spin
9. Object Pooling
10. Reel State Machine
11. Game Loop
12. RNG (Server vs Client Side)

---

# 1️⃣ Drop Calls (Server Communication)

## Concept

A **Drop Call** is an API request sent from the client to obtain the official spin result.

Slot games are **server-authoritative**.

```
Client → API → Game Server → RNG → Result
```

---

## Why Needed

* Prevent cheating
* Maintain fairness
* Regulatory compliance

---

## Example

```js
async function spin() {
  const res = await fetch("/api/spin");
  const result = await res.json();

  startReelAnimation(result.reels);
}
```

---

## Senior Insight

Animation starts **after result already exists**.

---

# 2️⃣ Lazy Loading (Asset Management)

## Concept

Load assets only when required instead of loading everything at startup.

---

## Why Important

Slot games contain:

* symbol textures
* animations
* audio
* bonus assets

Loading all at once causes memory spikes.

---

## Example

```js
await PIXI.Assets.load("baseAssets");

// load later
await PIXI.Assets.load("bonusAssets");
```

---

## Benefits

✅ faster load time
✅ lower memory usage
✅ smoother mobile performance

---

# 3️⃣ Canvas vs WebGL

| Canvas          | WebGL                        |
| --------------- | ---------------------------- |
| CPU rendering   | GPU rendering                |
| Simple          | High performance             |
| Limited scaling | Handles thousands of sprites |

---

## Canvas Example

```js
const ctx = canvas.getContext("2d");
ctx.fillRect(10,10,100,100);
```

---

## WebGL Example

```js
const gl = canvas.getContext("webgl");
gl.clear(gl.COLOR_BUFFER_BIT);
```

---

## Senior Understanding

Canvas redraws pixels.
WebGL sends instructions to GPU.

---

# 4️⃣ WebGL Basics

## Rendering Pipeline

```
Vertex Data
   ↓
Vertex Shader
   ↓
Rasterization
   ↓
Fragment Shader
   ↓
Screen Pixels
```

---

## Why Used in Games

* smooth animation
* particle effects
* motion blur
* real-time rendering

---

# 5️⃣ PixiJS Rendering Pipeline

PixiJS simplifies WebGL.

```
Sprite
 ↓
Container (Scene Graph)
 ↓
Batch Renderer
 ↓
WebGL
 ↓
GPU
```

---

## Example

```js
const app = new PIXI.Application();
document.body.appendChild(app.view);

const sprite = PIXI.Sprite.from("symbol.png");
app.stage.addChild(sprite);
```

---

## Scene Graph Advantage

Moving parent container moves all children automatically.

---

# 6️⃣ Pixi Game Structure

Typical production layout:

```
src/
 ├ core/
 ├ reels/
 ├ ui/
 ├ network/
 ├ assets/
 └ pool/
```

---

## Key Systems

* GameController
* ReelManager
* StateManager
* NetworkService
* AssetManager

---

## Principle

Separate rendering from game logic.

---

# 7️⃣ Reel Spin Logic

## Important Truth

Reels do NOT physically spin.

Symbols move vertically.

---

## Update Logic

```js
app.ticker.add(()=>{
   symbol.y += speed;
});
```

---

## Recycling

```js
if(symbol.y > bottomLimit){
   symbol.y -= reelHeight;
}
```

Creates spinning illusion.

---

# 8️⃣ Infinite Reel Spin

Only few sprites exist.

```
Visible symbols = 3
Buffer symbols = 6
Total ≈ 9 sprites
```

---

## Texture Replacement

```js
symbol.texture = nextTexture();
```

Memory usage stays constant.

---

## Senior Insight

Infinite animation = object reuse.

---

# 9️⃣ Object Pooling

## Concept

Reuse objects instead of creating/destroying repeatedly.

---

## Why

Frequent allocations cause:

* garbage collection pauses
* FPS drops

---

## Pool Example

```js
class Pool {
 constructor(factory){
   this.items=[];
   this.factory=factory;
 }

 get(){
   return this.items.pop() || this.factory();
 }

 release(obj){
   this.items.push(obj);
 }
}
```

---

## Usage

```js
const sprite = pool.get();
pool.release(sprite);
```

---

# 🔟 Reel State Machine

## Purpose

Controls game flow safely.

---

## States

```
IDLE
SPIN_REQUEST
SPINNING
DECELERATION
STOPPING
RESULT
BONUS
```

---

## Example

```js
switch(state){
 case "SPINNING":
   updateReels();
}
```

---

## Benefits

* prevents double spins
* avoids async bugs
* predictable behavior

---

# 1️⃣1️⃣ Game Loop

Core engine cycle.

```
Input
↓
Update
↓
Render
↓
Repeat (60 FPS)
```

---

## Pixi Ticker

```js
app.ticker.add(update);
```

---

## Delta Time

```js
position += velocity * delta;
```

Keeps motion consistent across devices.

---

# 1️⃣2️⃣ RNG — Server Side or Client Side?

## ✅ Correct Answer

**RNG runs on SERVER SIDE in real slot games.**

---

## Why Not Client Side?

Client code can be modified.

Example hack:

```js
Math.random = () => 1;
```

Player always wins ❌

---

## Server Architecture

```
Client (Pixi Game)
        ↓
Drop Call
        ↓
Game Server
        ↓
RNG Engine
        ↓
Math Engine
        ↓
Result Returned
```

---

## RNG Process

1. Generate random number
2. Map number to reel strip position
3. Calculate win
4. Send result

---

## Example Mapping

```
RNG = 8347291
8347291 % reelLength = stopIndex
```

---

## Client Responsibility

Client only:

✅ animates reels
✅ shows effects
✅ displays winnings

Client NEVER decides result.

---

## Interview Answer (Senior Level)

> RNG must execute server-side to ensure fairness, security, and regulatory compliance. The client acts only as a deterministic renderer of server-provided outcomes.

---

# 🏁 Final Architecture Overview

```
React / UI Layer
        ↓
PixiJS Game Engine
        ↓
WebGL Renderer
        ↓
GPU
```

Backend:

```
Game Server → RNG → Game Math → Wallet
```

---

# ⭐ Core Principle

```
Server = Truth
Client = Visualization
```

---

**END OF CORE ARCHITECTURE GUIDE**
