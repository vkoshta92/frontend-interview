// Complex character animations, symbol animations — gaming_company mein Spine use hota hai!
// Spine = Skeletal 2D Animation
// npm install @pixi-spine/all-4.1

import { Spine } from '@pixi-spine/all-4.1';

// Assets load karo
const spineData = await PIXI.Assets.load({
  alias: 'coinSpin',
  src: 'assets/coin.json',
  data: { spineAtlas: 'assets/coin.atlas' }
});

// Spine object banao
const coin = new Spine(spineData.spineData);
coin.x = 640;
coin.y = 360;
app.stage.addChild(coin);

// Animations list dekho
console.log(coin.state.data.skeletonData.animations);

// Animation play karo
coin.state.setAnimation(0, 'spin', true); // Loop
coin.state.setAnimation(0, 'idle', false); // Once

// Animation chain karo
coin.state.setAnimation(0, 'win', false);
coin.state.addAnimation(0, 'idle', true, 0); // After win

// Speed control
coin.state.timeScale = 2.0; // 2x fast

// Events listen karo
coin.state.addListener({
  complete: (entry) => {
    console.log('Animation done:', entry.animation.name);
  },
  event: (entry, event) => {
    if (event.data.name === 'sound') {
      playSound('coin_sound');
    }
  }
});

// Skin change karo
coin.skeleton.setSkinByName('gold');
coin.skeleton.setSlotsToSetupPose();
// gaming_company tip: Spine animations gaming_company ke symbols mein hoti hain — win pe special animation trigger hoti hai!