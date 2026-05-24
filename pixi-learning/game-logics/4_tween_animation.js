// Tween Animations
// Medium
// gaming_company mein kyun zaroori hai

// Win animations, symbol effects — sab tween se hota hai!

// Concept

// Tween = smooth transition between two values. GSAP ya custom tween use hota hai.

// Custom Tween — gaming_company mein GSAP bhi use hota hai
class Tween {
  constructor(target, props, duration, easing) {
    this.target = target;
    this.startProps = {};
    this.endProps = props;
    this.duration = duration;
    this.elapsed = 0;
    this.easing = easing || this.easeOut;
    this.done = false;

    // Start values save karo
    Object.keys(props).forEach(key => {
      this.startProps[key] = target[key];
    });
  }

  // Ease out — natural feel
  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  update(delta) {
    if (this.done) return;
    this.elapsed += delta / 60;

    const progress = Math.min(
      this.elapsed / this.duration, 1
    );
    const eased = this.easing(progress);

    // Values interpolate karo
    Object.keys(this.endProps).forEach(key => {
      const start = this.startProps[key];
      const end = this.endProps[key];
      this.target[key] = start + (end - start) * eased;
    });

    if (progress >= 1) this.done = true;
  }
}

// Use karo — symbol bounce
const tween = new Tween(
  symbol,
  { y: symbol.y - 30, alpha: 0 },
  0.5
);
// Tip: Win animation mein symbols bounce karte hain — yahi tween se hota hai!