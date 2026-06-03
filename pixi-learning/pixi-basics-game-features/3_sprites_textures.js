// Slot symbols, backgrounds, buttons — sab Sprites hain!
// Texture banane ke tarike
const t1 = PIXI.Texture.from('cherry.png');
const t2 = await PIXI.Assets.load('seven.png');
const t3 = PIXI.Texture.WHITE; // White texture

// Sprite banao
const cherry = new PIXI.Sprite(t1);

// Position
cherry.x = 100;
cherry.y = 200;

// Size
cherry.width  = 120;
cherry.height = 120;

// Anchor — pivot point (0=left, 0.5=center, 1=right)
cherry.anchor.set(0.5); // Center anchor
cherry.anchor.set(0, 0); // Top-left (default)

// Scale
cherry.scale.set(2);    // 2x size
cherry.scale.x = 1.5;   // Only X

// Rotation
cherry.rotation = Math.PI / 2; // 90 degrees

// Alpha (transparency)
cherry.alpha = 0.5;

// Tint — color overlay
cherry.tint = 0xFF0000; // Red tint
cherry.tint = 0xFFFFFF; // No tint (default)

// Flip
cherry.scale.x = -1; // Horizontal flip

// Blend mode
cherry.blendMode = PIXI.BLEND_MODES.ADD;
cherry.blendMode = PIXI.BLEND_MODES.MULTIPLY;

// Destroy
cherry.destroy({ texture: false });
// ZVKY tip: anchor.set(0.5) = rotation/scale center se hogi — symbols ke liye zaroori!