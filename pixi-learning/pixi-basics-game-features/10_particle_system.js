// Win pe coins girna, confetti, fire — particles se life aati hai game mein!
// Custom Particle System
class Particle {
  constructor() { this.reset(); }

  reset(x = 0, y = 0) {
    this.x = x; this.y = y;
    this.vx = (Math.random()-0.5) * 12;
    this.vy = (Math.random()-2) * 8;
    this.gravity = 0.4;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.01;
    this.scale = Math.random() * 0.8 + 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random()-0.5) * 0.3;
  }

  update(delta) {
    this.vy += this.gravity * delta;
    this.x  += this.vx * delta;
    this.y  += this.vy * delta;
    this.life -= this.decay * delta;
    this.rotation += this.rotationSpeed * delta;
  }

  get alive() { return this.life > 0; }
}

class ParticleSystem {
  constructor(app, texture) {
    this.app = app;
    this.pool = Array.from(
      {length: 200}, () => new Particle()
    );
    this.active = [];
    this.container = new PIXI.ParticleContainer(200, {
      position: true, rotation: true,
      scale: true, alpha: true,
    });
    app.stage.addChild(this.container);
  }

  burst(x, y, count = 30, texture) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.pop() || new Particle();
      p.reset(x, y);
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      p.sprite = sprite;
      this.container.addChild(sprite);
      this.active.push(p);
    }
  }

  update(delta) {
    for (let i = this.active.length-1; i >= 0; i--) {
      const p = this.active[i];
      p.update(delta);
      p.sprite.x = p.x;
      p.sprite.y = p.y;
      p.sprite.alpha = p.life;
      p.sprite.scale.set(p.scale);
      p.sprite.rotation = p.rotation;
      if (!p.alive) {
        this.container.removeChild(p.sprite);
        this.pool.push(p);
        this.active.splice(i, 1);
      }
    }
  }
}

// Use karo
const coins = new ParticleSystem(app, coinTexture);
coins.burst(640, 360, 50); // Win pe!
app.ticker.add(d => coins.update(d));
// gaming_company tip: ParticleContainer use karo — regular Container se 10x fast hota hai!