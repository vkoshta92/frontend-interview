// Win lines draw karo, backgrounds, debug outlines — sab Graphics se!
const g = new PIXI.Graphics();

// Rectangle
g.beginFill(0xFF0000, 1);      // Color, Alpha
g.drawRect(0, 0, 200, 100);
g.endFill();

// Rounded Rectangle
g.beginFill(0x00FF00);
g.drawRoundedRect(10, 10, 180, 80, 15); // rx=15
g.endFill();

// Circle
g.beginFill(0x0000FF);
g.drawCircle(100, 100, 50); // cx, cy, radius
g.endFill();

// Line / Win Line draw karo
g.lineStyle(4, 0xFFD700, 1); // width, color, alpha
g.moveTo(50, 150);
g.lineTo(750, 150);
g.stroke();

// Bezier curve
g.lineStyle(3, 0xFF00FF);
g.moveTo(0, 100);
g.bezierCurveTo(100, 0, 200, 200, 300, 100);

// Polygon (custom shape)
g.beginFill(0xFFFF00);
g.drawPolygon([0,0, 100,0, 50,100]);
g.endFill();

// Clear karo
g.clear();

// Interactive
g.interactive = true;
g.cursor = 'pointer';
g.on('click', () => console.log('clicked!'));

// Update existing graphics (performance tip)
g.clear();
g.beginFill(0xFF0000);
g.drawRect(0, 0, 200, 100);
g.endFill();
// ZVKY tip: Win line draw karne ke liye lineStyle + moveTo + lineTo — ZVKY mein exact yahi!