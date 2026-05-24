// Asset Loader
// Easy
// gaming_company mein kyun zaroori hai

// Game start hone se pehle sab assets load karna zaroori hai!

// Concept

// PIXI.Assets se textures, sounds, fonts preload karo — tabhi game smooth chalta hai.

// PIXI.Assets — Modern Loader (v7+)
async function loadGameAssets() {

  // Manifest define karo
  await PIXI.Assets.init({
    manifest: {
      bundles: [
        {
          name: 'slot-symbols',
          assets: [
            { alias: 'cherry', src: 'cherry.png' },
            { alias: 'seven', src: 'seven.png' },
            { alias: 'bar', src: 'bar.png' },
            { alias: 'wild', src: 'wild.png' },
          ]
        },
        {
          name: 'ui',
          assets: [
            { alias: 'button', src: 'button.png' },
            { alias: 'frame', src: 'frame.png' },
          ]
        }
      ]
    }
  });

  // Progress track karo
  await PIXI.Assets.loadBundle(
    'slot-symbols',
    (progress) => {
      loadingBar.width = progress * 400;
      loadingText.text = 
        `Loading... ${Math.round(progress * 100)}%`;
    }
  );

  // Ab use karo
  const cherry = PIXI.Texture.from('cherry');
}
// Tip: Loading screen gaming_company ke har game mein hoti hai — progress bar zaroor dikhao!