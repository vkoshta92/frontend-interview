---

# 🎮 11️⃣+ Senior Game Development Interview Questions (PixiJS / Slot Games)

Below are advanced questions commonly asked for **Senior HTML5 Game Developer / PixiJS / iGaming roles**.

---

## 12️⃣ What is a Draw Call?

### Answer

A draw call is a request sent to GPU to render objects.

Too many draw calls reduce performance.

### Optimization

* Use texture atlas
* Batch sprites
* Share base textures

```
100 sprites (same texture) → 1 draw call
100 sprites (different textures) → 100 draw calls
```

---

## 13️⃣ What is Sprite Batching?

### Answer

PixiJS groups multiple sprites into a single GPU draw operation.

Requirements:

* Same texture
* Same blend mode
* Same shader

Improves FPS significantly.

---

## 14️⃣ Why Texture Atlas is Important?

### Answer

Combines many images into one texture.

Benefits:

* fewer GPU texture swaps
* faster rendering
* reduced memory usage

Example:

```
symbols.png
 ├ cherry
 ├ wild
 ├ scatter
```

---

## 15️⃣ How Do You Optimize FPS in PixiJS?

### Answer

Senior optimizations:

* Object pooling
* Reduce filters
* Avoid large textures
* Use bitmap fonts
* Lazy load assets
* Minimize masks
* Batch sprites

---

## 16️⃣ What Causes Memory Leaks in Games?

### Answer

Common causes:

* Event listeners not removed
* Unreleased textures
* Creating sprites repeatedly
* Timers not cleared

Example fix:

```js
sprite.destroy({ texture:false });
```

---

## 17️⃣ Difference Between Container and Sprite?

| Sprite      | Container        |
| ----------- | ---------------- |
| Has texture | Holds children   |
| Renderable  | Logical grouping |
| Lightweight | Scene structure  |

Containers organize scene hierarchy.

---

## 18️⃣ What is Delta Time?

### Answer

Delta time ensures movement speed remains consistent across FPS.

```js
app.ticker.add((delta)=>{
   sprite.x += 5 * delta;
});
```

Without delta → animation speed varies.

---

## 19️⃣ How Do You Implement Reel Stop Sequence?

### Answer

Reels stop sequentially for realism.

```
Reel1 stop → Reel2 → Reel3 → Reel4 → Reel5
```

Implementation:

```js
setTimeout(()=>stopReel(2),300);
```

---

## 20️⃣ How Are Slot Results Synced With Animation?

### Answer

Backend decides result first.

Flow:

```
API Result Received
      ↓
Store final symbols
      ↓
Animate reels
      ↓
Snap to result positions
```

Frontend never calculates wins.

---

## 21️⃣ What is Masking in PixiJS?

### Answer

Mask limits visible area.

Used for reel windows.

```js
reelContainer.mask = maskGraphic;
```

---

## 22️⃣ What is a Game Loop?

### Answer

Continuous update cycle.

```
Update Logic
↓
Render Frame
↓
Repeat (60 FPS)
```

Pixi ticker manages loop automatically.

---

## 23️⃣ How Do You Handle Different Screen Sizes?

### Answer

Use responsive scaling.

```js
app.renderer.resize(width,height);
stage.scale.set(scaleFactor);
```

Maintain aspect ratio.

---

## 24️⃣ What is GPU vs CPU Responsibility?

| CPU              | GPU               |
| ---------------- | ----------------- |
| Game logic       | Rendering         |
| API calls        | Drawing pixels    |
| State management | Animation visuals |

Good games move rendering work to GPU.

---

## 25️⃣ How Do Filters Affect Performance?

### Answer

Filters (blur, glow) are expensive GPU operations.

Use carefully:

✅ during spin only
❌ permanently active

Example:

```js
reel.filters = [blurFilter];
```

---

## 26️⃣ How Do You Implement Reel Blur Effect?

### Answer

Blur intensity linked to speed.

```js
blur.blurY = speed * 0.4;
```

Fast spin → more blur.

---

## 27️⃣ What is Z-Index in PixiJS?

### Answer

Controls rendering order.

```js
sprite.zIndex = 10;
container.sortableChildren = true;
```

Used for UI layering.

---

## 28️⃣ How Do You Manage Assets Efficiently?

### Answer

* preload core assets
* lazy load bonus assets
* unload unused textures

```js
PIXI.Assets.unload("bonus.png");
```

---

## 29️⃣ Explain State Machine in Games

### Answer

Prevents logic conflicts.

```
IDLE → SPIN → STOP → RESULT → BONUS
```

Only one state active at a time.

---

## 30️⃣ Why Avoid Creating Objects Inside Game Loop?

### Answer

Creates garbage collection spikes.

Bad:

```js
ticker.add(()=>{
   new Sprite();
});
```

Good:

Reuse pooled objects.

---

## 31️⃣ What is Object Pooling?

### Answer

Reuse objects instead of recreating.

Benefits:

* stable FPS
* less memory allocation
* smoother gameplay

---

## 32️⃣ How Do You Debug Performance Issues?

### Answer

Tools:

* Chrome DevTools Performance tab
* FPS meter
* PixiJS DevTools

Check:

* draw calls
* memory usage
* texture count

---

## 33️⃣ What is Texture Switching?

### Answer

GPU slows when switching textures frequently.

Solution:
Use atlas to keep same base texture.

---

## 34️⃣ Difference Between WebGL Renderer and Canvas Renderer?

WebGL:

* GPU accelerated
* high performance

Canvas:

* CPU rendering
* fallback mode

Pixi auto-selects WebGL when available.

---

## 35️⃣ Senior-Level Architecture Principle

Separate layers:

```
Rendering Layer
Game Logic Layer
Network Layer
UI Layer
```

Never mix API logic with rendering logic.

---

# ⭐ Senior Interview Tip

Most important answer mindset:

> Animation is presentation.
> Game result is server-controlled logic.

---

**End — Senior Interview Section**
