// Game start pe sab assets load karo — loading screen ke saath!
// Modern PixiJS v7+ Assets API
async function loadGameAssets(onProgress) {

  // Manifest define karo
  await PIXI.Assets.init({
    manifest: {
      bundles: [
        {
          name: 'symbols',
          assets: [
            { alias: 'cherry',  src: 'symbols/cherry.png' },
            { alias: 'seven',   src: 'symbols/seven.png' },
            { alias: 'wild',    src: 'symbols/wild.png' },
            { alias: 'scatter', src: 'symbols/scatter.png' },
          ]
        },
        {
          name: 'ui',
          assets: [
            { alias: 'spinBtn', src: 'ui/spin_btn.png' },
            { alias: 'frame',   src: 'ui/frame.png' },
          ]
        },
        {
          name: 'audio',
          assets: [
            { alias: 'winSfx',  src: 'audio/win.mp3' },
            { alias: 'spinSfx', src: 'audio/spin.mp3' },
          ]
        }
      ]
    }
  });

  // Load with progress
  const symbols = await PIXI.Assets.loadBundle(
    'symbols',
    (progress) => onProgress(progress * 0.5)
  );

  const ui = await PIXI.Assets.loadBundle(
    'ui',
    (progress) => onProgress(0.5 + progress * 0.5)
  );

  return { symbols, ui };
}

// Loading screen banao
async function showLoadingScreen() {
  const bar = new PIXI.Graphics();
  const barBg = new PIXI.Graphics();

  barBg.beginFill(0x333333);
  barBg.drawRoundedRect(240, 340, 800, 40, 20);
  barBg.endFill();

  const text = new PIXI.Text('Loading...', {
    fontSize: 36, fill: '#FFFFFF'
  });
  text.anchor.set(0.5);
  text.x = 640; text.y = 300;

  app.stage.addChild(barBg, bar, text);

  await loadGameAssets((progress) => {
    bar.clear();
    bar.beginFill(0xFFD700);
    bar.drawRoundedRect(
      240, 340, 800 * progress, 40, 20
    );
    bar.endFill();
    text.text = `Loading... ${Math.round(progress*100)}%`;
  });

  app.stage.removeChild(barBg, bar, text);
}
// gaming_company tip: Bundle mein load karo — sab ek saath load hoti hain, faster!