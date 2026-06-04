// Wild symbol poora reel cover karta hai — gaming_company ke premium slots mein hota hai!
class ExpandingWild {
  constructor(container, symbolHeight) {
    this.container = container;
    this.symbolHeight = symbolHeight;
    this.isExpanding = false;
  }

  // Wild symbol check karo
  findWilds(reelResults) {
    const wilds = [];
    reelResults.forEach((reel, col) => {
      reel.forEach((symbol, row) => {
        if (symbol.name === 'wild') {
          wilds.push({ col, row });
        }
      });
    });
    return wilds;
  }

  // Expanding wild animate karo
  async expand(wildSymbol, reelSprites, col) {
    this.isExpanding = true;

    // Wild symbol glow karo
    await this.glowEffect(wildSymbol);

    // Expand animation — 3 positions cover karo
    const expandedWild = new PIXI.Sprite(
      PIXI.Texture.from('wild_expanded.png')
    );
    expandedWild.anchor.set(0.5);
    expandedWild.x = wildSymbol.x;
    expandedWild.y = this.symbolHeight; // Middle
    expandedWild.width = 130;
    expandedWild.height = 10; // Start small

    this.container.addChild(expandedWild);

    // Grow animation
    await new Promise(resolve => {
      const tween = new Tween(
        expandedWild,
        { height: this.symbolHeight * 3 }, // Full reel
        0.5, resolve
      );
      activeTweens.push(tween);
    });

    // Original symbols hide karo
    reelSprites[col].forEach(sym => {
      sym.visible = false;
    });

    this.isExpanding = false;
    return expandedWild;
  }

  // Glow effect
  async glowEffect(sprite) {
    const glowFilter = new PIXI.filters.GlowFilter({
      distance: 20,
      outerStrength: 2,
      color: 0xFFD700,
    });
    sprite.filters = [glowFilter];

    return new Promise(resolve => {
      let strength = 0;
      const pulse = app.ticker.add(() => {
        strength = Math.sin(Date.now() / 100) * 2 + 2;
        glowFilter.outerStrength = strength;
      });
      setTimeout(() => {
        app.ticker.remove(pulse);
        resolve();
      }, 1000);
    });
  }

  // Reel results mein wild replace karo
  replaceWithWild(results, col) {
    return results.map((reel, c) => {
      if (c === col) return ['wild', 'wild', 'wild'];
      return reel;
    });
  }
}
// gaming_company tip: GlowFilter npm install karna hoga: @pixi/filter-glow. gaming_company mein yeh filter use hota hai!