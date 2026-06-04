// Trail effects, screenshot, cached background — RenderTexture se possible!
// RenderTexture banao
const renderTexture = PIXI.RenderTexture.create({
  width: 800,
  height: 500,
  resolution: 1,
});

// Container ko texture mein render karo
app.renderer.render(
  gameContainer,
  { renderTexture }
);

// Texture ko sprite mein use karo
const snapshot = new PIXI.Sprite(renderTexture);
app.stage.addChild(snapshot);

// Trail effect — motion blur
const trail = PIXI.RenderTexture.create({
  width: app.screen.width,
  height: app.screen.height,
});

const trailSprite = new PIXI.Sprite(trail);
trailSprite.alpha = 0.8; // Ghost effect
app.stage.addChildAt(trailSprite, 0);

app.ticker.add(() => {
  // Previous frame ko trail pe render karo
  app.renderer.render(app.stage, {
    renderTexture: trail,
    clear: false // Clear mat karo — trail!
  });
});

// Screenshot feature
function takeScreenshot() {
  const rt = PIXI.RenderTexture.create({
    width: app.screen.width,
    height: app.screen.height,
  });
  app.renderer.render(app.stage, { renderTexture: rt });

  // Canvas se image extract karo
  const canvas = app.renderer.extract.canvas(rt);
  const link = document.createElement('a');
  link.download = 'screenshot.png';
  link.href = canvas.toDataURL();
  link.click();

  rt.destroy(true);
}

// Cache expensive graphics
const cachedBg = PIXI.RenderTexture.create({
  width: 1280, height: 720
});
app.renderer.render(backgroundContainer, {
  renderTexture: cachedBg
});
const bgSprite = new PIXI.Sprite(cachedBg);
// gaming_company tip: Static background ko RenderTexture mein cache karo — har frame render nahi hogi!