// Sprite Pool & Memory Management
// Medium
// gaming_company mein kyun zaroori hai

// Slot games mein bahut sprites hoti hain — memory optimize karna zaroori hai!

// Concept

// Sprites baar baar create/destroy karna slow hota hai. Pool mein pre-create karo aur reuse karo.

// Sprite Pool — gaming_company level pattern
class SpritePool {
  constructor(texture, size = 20) {
    this.pool = [];
    // Pre-create sprites
    for (let i = 0; i < size; i++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.visible = false;
      this.pool.push(sprite);
    }
  }

  // Pool se sprite lo
  get() {
    const sprite = this.pool.find(s => !s.visible);
    if (sprite) {
      sprite.visible = true;
      return sprite;
    }
    return null; // Pool full hai
  }

  // Sprite wapas karo
  release(sprite) {
    sprite.visible = false;
    sprite.x = 0;
    sprite.y = 0;
  }
}

// Use karo
const pool = new SpritePool(texture, 50);
const coin = pool.get();
// ... use karo
pool.release(coin); // Destroy nahi, reuse!
// Tip: Slot games mein har symbol ek pool se aata hai — yahi gaming_company mein hoga!