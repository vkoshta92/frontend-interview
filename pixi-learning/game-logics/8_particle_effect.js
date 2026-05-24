// Particle Effects
// Medium
// gaming_company mein kyun zaroori hai

// Win pe coins girte hain, confetti — sab particles se hota hai!

// Concept

// Particles = bahut saare chhote sprites jo physics follow karte hain.

// Particle System — Win Celebration
class ParticleSystem {
  constructor(app, texture) {
    this.app = app;
    this.texture = texture;
    this.particles = [];
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);
  }

  // Particles emit karo
  emit(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Sprite(this.texture);
      particle.x = x;
      particle.y = y;
      particle.scale.set(Math.random() * 0.5 + 0.3);

      // Random velocity
      particle.vx = (Math.random() - 0.5) * 10;
      particle.vy = (Math.random() - 1) * 15;
      particle.gravity = 0.5;
      particle.life = 1.0; // Full life
      particle.decay = Math.random() * 0.02 + 0.01;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  // Har frame update
  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics apply karo
      p.vy += p.gravity * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.life -= p.decay * delta;
      p.alpha = p.life;

      // Dead particles remove karo
      if (p.life <= 0) {
        this.container.removeChild(p);
        this.particles.splice(i, 1);
      }
    }
  }
}

// Win pe use karo!
const coins = new ParticleSystem(app, coinTexture);
coins.emit(640, 360, 50); // Center pe 50 coins!
// Tip: Big Win pe zyada particles — Small Win pe kam!