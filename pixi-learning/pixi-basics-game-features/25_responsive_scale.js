// Mobile + Desktop dono pe game fit ho — ZVKY games mobile friendly hote hain!
class ResponsiveManager {
  constructor(app, designWidth, designHeight) {
    this.app = app;
    this.designW = designWidth;   // 1280
    this.designH = designHeight;  // 720
    this.gameContainer = new PIXI.Container();
    app.stage.addChild(this.gameContainer);

    this.resize();
    window.addEventListener('resize',
      () => this.resize()
    );
  }

  resize() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Scale calculate karo
    const scaleX = screenW / this.designW;
    const scaleY = screenH / this.designH;

    // Fit mode — letterbox
    const scale = Math.min(scaleX, scaleY);

    this.gameContainer.scale.set(scale);

    // Center karo
    this.gameContainer.x =
      (screenW - this.designW * scale) / 2;
    this.gameContainer.y =
      (screenH - this.designH * scale) / 2;

    // Renderer resize
    this.app.renderer.resize(screenW, screenH);
  }

  // Portrait / Landscape detect
  isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  // Safe zone (notch, etc.)
  getSafeArea() {
    const style = getComputedStyle(document.body);
    return {
      top: parseInt(
        style.getPropertyValue('--sat') || '0'
      ),
      bottom: parseInt(
        style.getPropertyValue('--sab') || '0'
      ),
    };
  }

  // Pixel to game coordinates
  screenToGame(screenX, screenY) {
    return {
      x: (screenX - this.gameContainer.x) /
         this.gameContainer.scale.x,
      y: (screenY - this.gameContainer.y) /
         this.gameContainer.scale.y,
    };
  }
}

// Use karo
const responsive = new ResponsiveManager(
  app, 1280, 720
);

// Sab game objects gameContainer mein add karo
responsive.gameContainer.addChild(reelContainer);
responsive.gameContainer.addChild(uiContainer);
// ZVKY tip: gameContainer scale karo — individual elements nahi! Ek jagah scale = sab responsive!