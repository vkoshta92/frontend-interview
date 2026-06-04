// Game objects organize karne ke liye — Reels, UI, Background sab alag containers!
// Container = group of objects
const gameContainer = new PIXI.Container();
const uiContainer   = new PIXI.Container();
const bgContainer   = new PIXI.Container();

// Stage pe add karo (z-order = add order)
app.stage.addChild(bgContainer);   // Behind
app.stage.addChild(gameContainer); // Middle
app.stage.addChild(uiContainer);   // Front

// Container position, scale, rotation
gameContainer.x = 100;
gameContainer.y = 50;
gameContainer.scale.set(1.5);      // 1.5x size
gameContainer.rotation = Math.PI / 4; // 45 degrees
gameContainer.alpha = 0.8;         // Transparency
gameContainer.visible = false;     // Hide/show

// Children manage karo
gameContainer.addChild(sprite);
gameContainer.removeChild(sprite);
gameContainer.removeChildren();    // Sab hata do

// Children loop
gameContainer.children.forEach(child => {
  child.alpha = 0.5;
});

// Destroy container + children
gameContainer.destroy({ children: true });

// Bounds get karo
const bounds = gameContainer.getBounds();
console.log(bounds.x, bounds.width);

// Sort children by y (depth)
gameContainer.sortChildren(); // zIndex se sort
// gaming_company tip: zIndex property set karo — addChild order ke bina depth control!