// Symbol bounce, win glow, reel stop — sab tween se smooth hota hai!
// Manual Tween (no library)
class Tween {
  constructor(target, to, duration, onComplete) {
    this.target = target;
    this.from = {};
    this.to = to;
    this.duration = duration;
    this.elapsed = 0;
    this.done = false;
    this.onComplete = onComplete;
    Object.keys(to).forEach(k => {
      this.from[k] = target[k];
    });
  }

  easeOut(t) { return 1 - Math.pow(1-t, 3); }
  easeIn(t)  { return t * t * t; }
  elastic(t) {
    return t === 1 ? 1 :
      -Math.pow(2, 10*t-10) *
      Math.sin((t*10-10.75) * ((2*Math.PI)/3));
  }

  update(delta) {
    if (this.done) return;
    this.elapsed += delta / (this.duration * 60);
    const p = Math.min(this.elapsed, 1);
    const e = this.easeOut(p);
    Object.keys(this.to).forEach(k => {
      this.target[k] =
        this.from[k] + (this.to[k]-this.from[k]) * e;
    });
    if (p >= 1) {
      this.done = true;
      this.onComplete?.();
    }
  }
}

// Use karo
const tweens = [];

// Symbol bounce karo
const t = new Tween(
  symbol, { y: symbol.y - 30, alpha: 0 }, 0.5,
  () => symbol.visible = false
);
tweens.push(t);

// Win scale up
const scaleUp = new Tween(
  symbol, { scaleX: 1.3, scaleY: 1.3 }, 0.3
);

app.ticker.add((delta) => {
  tweens.forEach(t => t.update(delta));
});
// ZVKY tip: Elastic easing = symbol bounce effect — players ko bahut pasand aata hai!