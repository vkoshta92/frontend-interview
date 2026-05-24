// Method Override
// Advanced
// Parent ka method override karke apna behavior add karo — super() se parent bhi chala sakte ho!

// Simple matlab

// Override = child class mein parent ka same method naam use karo — apna logic daalo.


class BaseAnimation {
  constructor(target) {
    this.target = target;
    this.duration = 1;
    this.elapsed = 0;
  }

  // Parent method
  update(delta) {
    this.elapsed += delta / 60;
    console.log('Base update running');
  }

  isComplete() {
    return this.elapsed >= this.duration;
  }
}

// Child — override karo
class WinAnimation extends BaseAnimation {
  constructor(target, winAmount) {
    super(target);
    this.winAmount = winAmount;
    this.duration = 2; // Override duration
    this.scale = 1;
  }

  // Override — parent method replace
  update(delta) {
    super.update(delta); // Parent bhi chala!

    // Apna extra logic add karo
    const progress = this.elapsed / this.duration;
    this.scale = 1 + Math.sin(progress * Math.PI) * 0.3;
    this.target.scale.set(this.scale);
  }
}

class SpinAnimation extends BaseAnimation {
  constructor(target) {
    super(target);
    this.rotation = 0;
  }

  // Override — alag behavior
  update(delta) {
    super.update(delta);
    this.rotation += 0.1 * delta;
    this.target.rotation = this.rotation;
  }
}

// Same update() call — alag behavior!
const winAnim = new WinAnimation(symbol, 500);
const spinAnim = new SpinAnimation(reel);

winAnim.update(1);  // Scale animation
spinAnim.update(1); // Rotation animation