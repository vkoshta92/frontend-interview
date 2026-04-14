
# 🚀 Full-Stack + PixiJS Game Dev Roadmap
## Fresher se Senior (10 Year Journey) — Hinglish Edition
### Frontend · Backend · PixiJS · Express · Node.js

---

## 📋 ROADMAP OVERVIEW

```
FRESHER (0-1yr) → JUNIOR (1-3yr) → MID (3-5yr) → SENIOR (5-8yr) → STAFF/LEAD (8-10yr+)
```

---

# 🌱 STAGE 1: FRESHER (0–1 Year)
## "Neev banana" — Foundation

---

## 1.1 HTML & CSS — Bilkul Basics

### Q: HTML5 ke important tags kaunse hain?

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slot Game</title>
</head>
<body>

  <!-- Semantic tags — screen readers & SEO ke liye -->
  <header>  <!-- Page ka top section -->
  <nav>     <!-- Navigation links -->
  <main>    <!-- Main content -->
  <section> <!-- Related content ka group -->
  <article> <!-- Self-contained content -->
  <aside>   <!-- Sidebar -->
  <footer>  <!-- Page ka bottom -->

  <!-- Game container -->
  <canvas id="game-canvas" width="1280" height="720"></canvas>

  <!-- Forms -->
  <form action="/login" method="POST">
    <input type="email" name="email" required>
    <input type="password" name="password" minlength="8">
    <button type="submit">Login</button>
  </form>

</body>
</html>
```

### Q: CSS Box Model kya hota hai?

```css
/* Box Model = Content + Padding + Border + Margin */

.game-card {
  /* Content */
  width: 200px;
  height: 150px;
  
  /* Padding — andar ki jagah */
  padding: 20px;           /* Sab taraf */
  padding: 10px 20px;      /* Top-Bottom Left-Right */
  padding: 5px 10px 15px 20px; /* Top Right Bottom Left (TRBL) */
  
  /* Border */
  border: 2px solid #gold;
  border-radius: 8px;      /* Rounded corners */
  
  /* Margin — bahar ki jagah */
  margin: 0 auto;          /* Center karo */
  
  /* box-sizing — important! */
  box-sizing: border-box;  /* Padding/border width mein include ho */
}

/* ❌ Bina box-sizing ke */
/* width: 200px + padding: 20px = actual width 240px — surprise! */

/* ✅ box-sizing: border-box ke saath */
/* width: 200px hi rehti hai — predictable */
```

### Q: Flexbox kya hai? Kab use karte hain?

```css
/* Flexbox — 1D layout (ek row ya column) */

.reel-container {
  display: flex;
  flex-direction: row;        /* left to right */
  justify-content: center;    /* Main axis pe center */
  align-items: center;        /* Cross axis pe center */
  gap: 10px;                  /* Items ke beech space */
  flex-wrap: wrap;            /* Overflow pe wrap karo */
}

.reel {
  flex: 1;           /* Available space equally baanto */
  flex: 0 0 180px;   /* Fixed width, no grow/shrink */
  flex-grow: 2;      /* Double space lo */
}

/* CSS Grid — 2D layout (rows + columns dono) */
.game-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 equal columns */
  grid-template-rows: repeat(3, 160px); /* 3 fixed rows */
  gap: 5px;
}

/* Responsive grid */
.symbol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
```

---

## 1.2 JavaScript — Basics

### Q: var, let, const mein kya farak hai?

```javascript
// var — purana, avoid karo
var x = 10;
var x = 20; // Re-declare allowed — bug ka source!
// Function scoped (block nahi)

// let — variable (value badlegi)
let balance = 1000;
balance = 900; // ✅ OK

// const — constant (reference nahi badlega)
const MAX_BET = 10000;
// MAX_BET = 5000; // ❌ Error!

// LEKIN — objects/arrays ke saath
const user = { name: 'Rahul', balance: 1000 };
user.balance = 900; // ✅ OK! Reference same hai, property badli
// user = {}; // ❌ Error! Reference nahi badal sakte

// Scope example
{
  let blockScoped = 'inside block';
  var functionScoped = 'anywhere in function';
}
// console.log(blockScoped); // ❌ ReferenceError
// console.log(functionScoped); // ✅ Works (bad practice!)
```

### Q: Callback, Promise, Async/Await — Evolution samjhao

```javascript
// === EVOLUTION OF ASYNC JAVASCRIPT ===

// 1. Callbacks — purana tarika (callback hell!)
function getUserBalance_old(userId, callback) {
  db.query(`SELECT balance FROM users WHERE id = ?`, [userId], (err, result) => {
    if (err) return callback(err, null);
    
    // Aur ek async call
    validateBalance(result.balance, (err2, valid) => {
      if (err2) return callback(err2, null);
      
      // Aur ek...
      logAccess(userId, (err3) => {
        callback(null, { balance: result.balance, valid });
        // "Callback Hell" / "Pyramid of Doom"
      });
    });
  });
}

// 2. Promises — better!
function getUserBalance_promise(userId) {
  return db.query(`SELECT balance FROM users WHERE id = ?`, [userId])
    .then(result => validateBalance(result.balance))
    .then(validatedBalance => {
      return logAccess(userId).then(() => validatedBalance);
    })
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}

// 3. Async/Await — best! (Promises ki syntax sugar)
async function getUserBalance(userId) {
  try {
    const result = await db.query(
      `SELECT balance FROM users WHERE id = ?`, 
      [userId]
    );
    
    const validatedBalance = await validateBalance(result.balance);
    await logAccess(userId);
    
    return validatedBalance;
    
  } catch (err) {
    console.error('Balance fetch failed:', err);
    throw err;
  }
}

// Parallel execution — Promise.all
async function getGameData(userId, gameId) {
  // ❌ Sequential — slow! (2 seconds total)
  const user = await fetchUser(userId);     // 1 sec
  const game = await fetchGame(gameId);     // 1 sec
  
  // ✅ Parallel — fast! (1 second total)
  const [user, game] = await Promise.all([
    fetchUser(userId),   // Dono saath shuru
    fetchGame(gameId)    // Dono saath shuru
  ]);
  
  return { user, game };
}
```

### Q: Array methods — map, filter, reduce samjhao

```javascript
// Slot game example
const spins = [
  { id: 1, bet: 10, win: 0,  symbol: 'LEMON' },
  { id: 2, bet: 20, win: 50, symbol: 'SEVEN' },
  { id: 3, bet: 10, win: 0,  symbol: 'CHERRY' },
  { id: 4, bet: 50, win: 200, symbol: 'SEVEN' },
  { id: 5, bet: 10, win: 10, symbol: 'BAR' },
];

// MAP — transform karo (same length return karta hai)
const profits = spins.map(spin => spin.win - spin.bet);
// [-10, 30, -10, 150, 0]

// FILTER — filter karo (subset return karta hai)
const winningSpins = spins.filter(spin => spin.win > 0);
// [{ id: 2 }, { id: 4 }, { id: 5 }]

// REDUCE — ek value mein compress karo
const totalProfit = spins.reduce((acc, spin) => {
  return acc + (spin.win - spin.bet);
}, 0); // 0 = initial value
// -10 + 30 + (-10) + 150 + 0 = 160

// CHAINING — powerful combination
const bigWinSymbols = spins
  .filter(spin => spin.win > spin.bet * 2)  // Big wins only
  .map(spin => spin.symbol)                  // Symbol nikalo
  .filter((sym, idx, arr) => arr.indexOf(sym) === idx); // Unique
// ['SEVEN']

// FIND — pehla matching element
const firstWin = spins.find(spin => spin.win > 0);
// { id: 2, bet: 20, win: 50, symbol: 'SEVEN' }

// SOME / EVERY
const hasWin = spins.some(spin => spin.win > 0); // true — koi ek win hai?
const allWin = spins.every(spin => spin.win > 0); // false — sab ne jeeta?
```

---

## 1.3 Node.js — Basics

### Q: Node.js kya hai? Browser JavaScript se kaise alag hai?

```javascript
// Browser JavaScript:
// - DOM access: document.getElementById()
// - Window object
// - Fetch API (limited)
// - No file system access

// Node.js:
// - No DOM (no browser!)
// - Global object (window nahi)
// - Full file system access
// - HTTP server bana sakte hain
// - npm packages

// === Node.js basics ===

// File system
const fs = require('fs');

// Synchronous (blocking) — avoid in production!
const data = fs.readFileSync('./config.json', 'utf8');

// Asynchronous (non-blocking) — use this!
fs.readFile('./config.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(JSON.parse(data));
});

// Promise version (modern)
const { readFile } = require('fs/promises');
const config = await readFile('./config.json', 'utf8');

// HTTP Server — basic
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from Node!' }));
});

server.listen(3000, () => {
  console.log('Server chalu hai port 3000 pe!');
});
```

### Q: npm kya hai? package.json samjhao

```json
{
  "name": "slot-game-api",
  "version": "1.0.0",
  "description": "Slot game backend",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  }
}
```

```bash
# Common npm commands
npm init -y              # package.json banao
npm install express      # Package install karo
npm install -D nodemon   # Dev dependency
npm run dev              # Script chalao
npm update               # Update karo
npm audit                # Security check
```

---

## 1.4 Express.js — Basics

### Q: Express mein basic server kaise banate hain?

```javascript
const express = require('express');
const app = express();

// Middleware — JSON parse karo
app.use(express.json());

// GET route
app.get('/api/games', (req, res) => {
  res.json([
    { id: 1, name: 'Lucky Slots', rtp: 96 },
    { id: 2, name: 'Golden Reels', rtp: 95 }
  ]);
});

// POST route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email aur password dono chahiye' });
  }
  
  // Logic...
  res.json({ token: 'jwt-token-here', message: 'Login successful' });
});

// Route params
app.get('/api/games/:id', (req, res) => {
  const { id } = req.params;    // URL se
  const { page } = req.query;   // ?page=1 se
  
  res.json({ gameId: id, page });
});

// Server start karo
app.listen(3000, () => {
  console.log('Express server port 3000 pe chal raha hai!');
});
```

---

# 🌿 STAGE 2: JUNIOR (1–3 Years)
## "Machinery samajhna" — Going Deeper

---

## 2.1 JavaScript — Intermediate

### Q: Closures kya hoti hain? Real example batao

```javascript
// Closure = Function jo apne outer scope ko "yaad" rakhti hai
// Even after outer function return ho jaaye

function createBetValidator(minBet, maxBet) {
  // minBet aur maxBet "close" ho gayi inner function mein
  
  return function validate(betAmount) {
    if (betAmount < minBet) {
      return { valid: false, error: `Minimum bet ${minBet} hai` };
    }
    if (betAmount > maxBet) {
      return { valid: false, error: `Maximum bet ${maxBet} hai` };
    }
    return { valid: true };
  };
}

// Alag alag games ke liye alag validators
const casualBetValidator = createBetValidator(0.10, 100);
const vipBetValidator = createBetValidator(100, 10000);

console.log(casualBetValidator(50));   // { valid: true }
console.log(casualBetValidator(5000)); // { valid: false, error: 'Maximum bet 100 hai' }
console.log(vipBetValidator(5000));    // { valid: true }

// Practical: Counter with closure
function createSpinCounter(userId) {
  let count = 0;
  let totalBet = 0;
  
  return {
    spin(betAmount) {
      count++;
      totalBet += betAmount;
      console.log(`User ${userId}: Spin #${count}, Total bet: ${totalBet}`);
    },
    getStats() {
      return { userId, totalSpins: count, totalBet, avgBet: totalBet / count };
    }
  };
}

const rahulCounter = createSpinCounter('rahul-123');
rahulCounter.spin(10);
rahulCounter.spin(20);
console.log(rahulCounter.getStats());
// { userId: 'rahul-123', totalSpins: 2, totalBet: 30, avgBet: 15 }
```

### Q: Prototype aur Class kya hai?

```javascript
// ES6 Class (modern syntax)
class SlotSymbol {
  // Static property — class ka hai, instance ka nahi
  static SYMBOLS = ['WILD', 'SEVEN', 'CHERRY', 'BAR', 'LEMON'];
  
  constructor(name, multipliers, weight) {
    this.name = name;
    this.multipliers = multipliers; // [0, 0, 10, 50, 200]
    this.weight = weight;           // Frequency
  }
  
  // Method
  getWin(matchCount, betAmount) {
    return (this.multipliers[matchCount] || 0) * betAmount;
  }
  
  // Getter
  get isWild() {
    return this.name === 'WILD';
  }
  
  // Static method
  static getByName(name) {
    // ...find and return
  }
  
  // toString
  toString() {
    return `Symbol(${this.name}, weight=${this.weight})`;
  }
}

// Inheritance
class AnimatedSymbol extends SlotSymbol {
  constructor(name, multipliers, weight, animationUrl) {
    super(name, multipliers, weight); // Parent constructor call
    this.animationUrl = animationUrl;
  }
  
  // Override
  getWin(matchCount, betAmount) {
    const baseWin = super.getWin(matchCount, betAmount); // Parent ka method
    return baseWin * 1.1; // Animated symbols 10% bonus!
  }
  
  play() {
    console.log(`Playing animation: ${this.animationUrl}`);
  }
}

const wildSymbol = new AnimatedSymbol(
  'WILD', 
  [0, 0, 50, 100, 500],
  2,
  '/animations/wild.json'
);

console.log(wildSymbol.isWild);              // true
console.log(wildSymbol.getWin(3, 10));       // (100 * 10) * 1.1 = 1100
console.log(wildSymbol instanceof SlotSymbol); // true
```

---

## 2.2 Express.js — Middleware & Routing

### Q: Router kaise organize karte hain?

```javascript
// === FOLDER STRUCTURE ===
// src/
// ├── routes/
// │   ├── auth.routes.js
// │   ├── game.routes.js
// │   └── balance.routes.js
// ├── controllers/
// │   ├── auth.controller.js
// │   └── game.controller.js
// ├── middleware/
// │   ├── auth.middleware.js
// │   └── validate.middleware.js
// └── app.js

// routes/game.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const gameController = require('../controllers/game.controller');

// Sab game routes ko auth chahiye
router.use(authenticate);

router.get('/', gameController.getGames);
router.get('/:gameId', gameController.getGame);
router.post('/:gameId/spin', gameController.spin);
router.get('/:gameId/history', gameController.getHistory);

module.exports = router;

// app.js
const gamesRouter = require('./routes/game.routes');
const authRouter = require('./routes/auth.routes');

app.use('/api/auth', authRouter);   // /api/auth/login, /api/auth/register
app.use('/api/games', gamesRouter); // /api/games, /api/games/:id/spin
```

### Q: JWT Authentication kaise implement karte hain?

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Auth Controller
const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      // Password hash karo — NEVER plain text store karo!
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const user = await db('users').insert({
        username,
        email,
        password_hash: hashedPassword,
        balance: 0
      }).returning(['id', 'username', 'email']);
      
      res.status(201).json({ 
        message: 'Account ban gaya!',
        user: user[0]
      });
      
    } catch (err) {
      // Duplicate email/username
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Email already registered hai' });
      }
      next(err);
    }
  },
  
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // User dhundo
      const user = await db('users').where({ email }).first();
      if (!user) {
        // Vague error — user enumeration prevent karo
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Password verify karo
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // JWT create karo
      const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }  // Short lived
      );
      
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }  // Long lived
      );
      
      // Refresh token secure cookie mein
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,   // JS access nahi kar sakta
        secure: true,     // HTTPS only
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ accessToken, user: { id: user.id, username: user.username } });
      
    } catch (err) {
      next(err);
    }
  }
};

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token nahi mila' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 2.3 PixiJS — Getting Started

### Q: PixiJS kya hai? Basic setup karo

```javascript
// PixiJS — WebGL based 2D game engine
// Canvas se 10x fast — GPU use karta hai

import * as PIXI from 'pixi.js';

// Application create karo
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e,    // Dark background
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,             // Sharp on Retina displays
});

// Canvas DOM mein add karo
document.getElementById('game').appendChild(app.view);

// === BASIC OBJECTS ===

// 1. Sprite — Image display karne ke liye
const texture = await PIXI.Assets.load('/assets/wild.png');
const wildSprite = new PIXI.Sprite(texture);
wildSprite.x = 100;
wildSprite.y = 100;
wildSprite.anchor.set(0.5); // Center pe anchor
app.stage.addChild(wildSprite);

// 2. Graphics — Shapes banane ke liye
const bg = new PIXI.Graphics();
bg.beginFill(0x2d2d44);        // Fill color
bg.lineStyle(2, 0xffd700);     // Border
bg.drawRoundedRect(0, 0, 200, 150, 10); // Rounded rectangle
bg.endFill();
app.stage.addChild(bg);

// 3. Text
const balanceText = new PIXI.Text('Balance: ₹1,000', {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xffd700,    // Gold color
  align: 'center'
});
balanceText.x = 640;
balanceText.y = 650;
balanceText.anchor.set(0.5);
app.stage.addChild(balanceText);

// 4. Container — Group objects
const reelContainer = new PIXI.Container();
reelContainer.x = 200;
reelContainer.y = 100;
app.stage.addChild(reelContainer);

// 5. Game Loop
app.ticker.add((delta) => {
  // delta = 1 at 60fps
  // Har frame pe yeh chalega
  wildSprite.rotation += 0.01 * delta; // Rotation
});

// 6. Interactivity
wildSprite.interactive = true;
wildSprite.cursor = 'pointer';
wildSprite.on('pointerdown', () => {
  console.log('Wild clicked!');
  wildSprite.tint = 0xff0000; // Red tint
});
```

### Q: PixiJS mein basic Reel kaise banate hain?

```javascript
class BasicReel {
  constructor(app, x, y, symbols) {
    this.app = app;
    this.symbols = symbols; // ['CHERRY', 'LEMON', 'BAR', ...]
    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;
    this.symbolSprites = [];
    this.isSpinning = false;
    this.speed = 0;
    
    this.createSymbols();
    this.addToStage();
  }
  
  createSymbols() {
    const SYMBOL_HEIGHT = 160;
    
    for (let i = 0; i < 5; i++) { // 3 visible + 2 buffer
      const symbolName = this.symbols[i % this.symbols.length];
      const sprite = new PIXI.Sprite(
        PIXI.Texture.from(`${symbolName}.png`)
      );
      
      sprite.width = 160;
      sprite.height = 155;
      sprite.y = i * SYMBOL_HEIGHT;
      
      this.container.addChild(sprite);
      this.symbolSprites.push(sprite);
    }
    
    // Mask — reel ke bahar nahi dikhna chahiye
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, 165, SYMBOL_HEIGHT * 3);
    mask.endFill();
    this.container.addChild(mask);
    this.container.mask = mask;
  }
  
  startSpin() {
    this.isSpinning = true;
    this.speed = 30; // pixels per frame
    
    // Blur effect
    this.blurFilter = new PIXI.BlurFilter();
    this.blurFilter.blurY = 15;
    this.container.filters = [this.blurFilter];
  }
  
  stopSpin(targetSymbols) {
    // Gradually slow down
    const slowDown = () => {
      if (this.speed > 1) {
        this.speed *= 0.9;
        setTimeout(slowDown, 16);
      } else {
        this.isSpinning = false;
        this.speed = 0;
        this.container.filters = [];
        this.setSymbols(targetSymbols);
      }
    };
    slowDown();
  }
  
  update() {
    if (!this.isSpinning) return;
    
    // Scroll down
    this.symbolSprites.forEach(sprite => {
      sprite.y += this.speed;
      
      // Reset to top jab bottom se bahar jaye
      if (sprite.y > 160 * 4) {
        sprite.y -= 160 * 5;
        // New random symbol
        sprite.texture = PIXI.Texture.from(
          `${this.symbols[Math.floor(Math.random() * this.symbols.length)]}.png`
        );
      }
    });
  }
  
  addToStage() {
    this.app.stage.addChild(this.container);
    this.app.ticker.add(() => this.update());
  }
}

// Usage
const reel1 = new BasicReel(app, 100, 50, 
  ['CHERRY', 'LEMON', 'BAR', 'SEVEN', 'ORANGE', 'WILD']
);

// Spin button
spinBtn.on('pointerdown', () => {
  reel1.startSpin();
  
  // Server se result aane ke baad stop karo
  setTimeout(() => {
    reel1.stopSpin(['SEVEN', 'SEVEN', 'SEVEN']); // 777!
  }, 2000);
});
```

---

# 🌳 STAGE 3: MID-LEVEL (3–5 Years)
## "Production ready banana" — Real World

---

## 3.1 Node.js — Advanced

### Q: Streams kya hote hain? Kab use karte hain?

```javascript
// Streams — Data ko chunks mein process karo
// Problem: 10GB file memory mein nahi aayegi!

const fs = require('fs');
const { Transform } = require('stream');

// ❌ Bad — pura file memory mein
const data = fs.readFileSync('10gb-audit-log.csv'); // OOM crash!

// ✅ Good — streaming approach
const readStream = fs.createReadStream('audit-log.csv');
const writeStream = fs.createWriteStream('report.csv');

// Transform stream — data modify karo
const filterStream = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    
    // Only winning spins
    const winningLines = lines
      .filter(line => {
        const [, , win] = line.split(',');
        return parseFloat(win) > 0;
      })
      .join('\n');
    
    this.push(winningLines);
    callback();
  }
});

// Pipe karo — automatic backpressure handling
readStream
  .pipe(filterStream)
  .pipe(writeStream)
  .on('finish', () => console.log('Report ready!'));

// HTTP mein streaming
app.get('/api/export/spins', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="spins.csv"');
  
  const dbStream = db('spin_records')
    .where({ user_id: req.user.id })
    .stream(); // Knex streaming
  
  // Header
  res.write('id,bet,win,symbol,date\n');
  
  dbStream.on('data', (row) => {
    res.write(`${row.id},${row.bet_amount},${row.win_amount},${row.symbol},${row.created_at}\n`);
  });
  
  dbStream.on('end', () => res.end());
  dbStream.on('error', (err) => res.destroy(err));
});
```

### Q: Event Emitter pattern samjhao

```javascript
const EventEmitter = require('events');

class SlotGameEngine extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Default 10 — increase karo
  }
  
  async spin(userId, betAmount) {
    // Event emit karo
    this.emit('spinStarted', { userId, betAmount, timestamp: Date.now() });
    
    try {
      const result = await this.calculateResult(betAmount);
      
      this.emit('spinCompleted', { userId, result });
      
      if (result.win > betAmount * 100) {
        this.emit('bigWin', { userId, win: result.win, multiplier: result.win / betAmount });
      }
      
      if (result.freeSpins > 0) {
        this.emit('freeSpinsTriggered', { userId, count: result.freeSpins });
      }
      
      return result;
      
    } catch (err) {
      this.emit('spinError', { userId, error: err.message });
      throw err;
    }
  }
}

// Listeners attach karo
const gameEngine = new SlotGameEngine();

// Audit logging
gameEngine.on('spinCompleted', async ({ userId, result }) => {
  await auditLogger.log('SPIN', { userId, result });
});

// Real-time notifications
gameEngine.on('bigWin', ({ userId, win }) => {
  socketManager.broadcastBigWin(userId, win);
  notificationService.send(userId, `Congratulations! ₹${win} jeeta!`);
});

// Analytics
gameEngine.on('spinCompleted', ({ userId, result }) => {
  analytics.track('spin', { userId, ...result });
});

// Once — sirf ek baar
gameEngine.once('bigWin', ({ userId }) => {
  rewardService.giveJackpotBadge(userId);
});
```

---

## 3.2 Database — SQL & Optimization

### Q: N+1 Query problem kya hai? Kaise fix karte hain?

```javascript
// ❌ N+1 Problem
async function getUsersWithBalance() {
  const users = await db('users').select(); // 1 query
  
  for (const user of users) {
    // N queries — 100 users = 101 queries total!
    user.transactions = await db('balance_transactions')
      .where({ user_id: user.id })
      .orderBy('created_at', 'desc')
      .limit(5);
  }
  
  return users;
}

// ✅ Solution 1: JOIN
async function getUsersWithBalanceJoin() {
  return db('users as u')
    .leftJoin('balance_transactions as bt', 'u.id', 'bt.user_id')
    .select('u.id', 'u.username', 'u.balance',
            'bt.amount', 'bt.type', 'bt.created_at')
    .orderBy('bt.created_at', 'desc');
}

// ✅ Solution 2: Separate optimized query (better for large datasets)
async function getUsersWithBalanceOptimized() {
  const users = await db('users').select(); // 1 query
  const userIds = users.map(u => u.id);
  
  // Single query for all transactions
  const transactions = await db('balance_transactions')
    .whereIn('user_id', userIds) // IN clause — 1 query!
    .orderBy('created_at', 'desc');
  
  // Group by user_id in JS
  const txByUser = transactions.reduce((acc, tx) => {
    if (!acc[tx.user_id]) acc[tx.user_id] = [];
    if (acc[tx.user_id].length < 5) acc[tx.user_id].push(tx);
    return acc;
  }, {});
  
  return users.map(user => ({
    ...user,
    transactions: txByUser[user.id] || []
  }));
}

// === INDEXES — Query performance ===
// Without index: Full table scan — O(n)
// With index: B-tree lookup — O(log n)

/*
-- Frequently queried columns pe index banao
CREATE INDEX idx_spin_records_user_id ON spin_records(user_id);
CREATE INDEX idx_spin_records_created_at ON spin_records(created_at DESC);

-- Composite index — multiple columns
CREATE INDEX idx_spin_user_date ON spin_records(user_id, created_at DESC);

-- Partial index — subset of rows
CREATE INDEX idx_active_users ON users(id) WHERE is_active = true;

-- Covering index — extra columns include karo
CREATE INDEX idx_spin_covering ON spin_records(user_id) 
  INCLUDE (bet_amount, win_amount, created_at);
*/

// EXPLAIN ANALYZE — query plan dekho
const plan = await db.raw(`
  EXPLAIN ANALYZE 
  SELECT * FROM spin_records 
  WHERE user_id = ? 
  ORDER BY created_at DESC 
  LIMIT 10
`, [userId]);

console.log(plan.rows);
// Index Scan using idx_spin_user_date — fast!
// Seq Scan — slow, index nahi hai
```

---

## 3.3 Redis — Caching & Sessions

### Q: Redis kab use karte hain? Slot game mein kaise helpful hai?

```javascript
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

// === SLOT GAME REDIS USE CASES ===

class RedisService {
  
  // 1. Session storage
  async saveSession(userId, sessionData) {
    await client.setEx(
      `session:${userId}`,
      1800, // 30 minute TTL
      JSON.stringify(sessionData)
    );
  }
  
  // 2. Balance cache (fast reads)
  async cacheBalance(userId, balance) {
    await client.setEx(`balance:${userId}`, 10, balance.toString()); // 10 sec TTL
  }
  
  async getCachedBalance(userId) {
    const cached = await client.get(`balance:${userId}`);
    return cached ? parseFloat(cached) : null;
  }
  
  // 3. Rate limiting (sliding window)
  async checkSpinRateLimit(userId) {
    const key = `ratelimit:${userId}`;
    const now = Date.now();
    const window = 1000; // 1 second
    const limit = 5;     // Max 5 spins per second
    
    const pipeline = client.multi();
    pipeline.zRemRangeByScore(key, 0, now - window); // Old entries remove
    pipeline.zAdd(key, { score: now, value: now.toString() });
    pipeline.zCard(key);
    pipeline.expire(key, 2);
    
    const results = await pipeline.exec();
    const count = results[2];
    
    return { allowed: count <= limit, count };
  }
  
  // 4. Leaderboard
  async updateLeaderboard(userId, winAmount) {
    await client.zIncrBy('leaderboard:daily', winAmount, userId);
  }
  
  async getLeaderboard(top = 10) {
    const entries = await client.zRangeWithScores(
      'leaderboard:daily', 0, top - 1, { REV: true }
    );
    
    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.value,
      totalWin: entry.score
    }));
  }
  
  // 5. Pub/Sub — Real-time events
  async publishBigWin(userId, amount) {
    await client.publish('big-wins', JSON.stringify({ userId, amount }));
  }
  
  async subscribeToBigWins(callback) {
    const subscriber = client.duplicate();
    await subscriber.connect();
    
    await subscriber.subscribe('big-wins', (message) => {
      callback(JSON.parse(message));
    });
    
    return subscriber;
  }
  
  // 6. Distributed Lock (Spin concurrency prevent)
  async acquireLock(userId, ttlMs = 5000) {
    const lockKey = `lock:${userId}`;
    const lockId = crypto.randomUUID();
    
    const acquired = await client.set(lockKey, lockId, {
      NX: true,  // Only set if not exists
      PX: ttlMs  // Millisecond TTL
    });
    
    return acquired ? lockId : null;
  }
  
  async releaseLock(userId, lockId) {
    // Lua script — atomic check + delete
    const script = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;
    
    await client.eval(script, { keys: [`lock:${userId}`], arguments: [lockId] });
  }
}
```

---

# 🌲 STAGE 4: SENIOR (5–8 Years)
## "System Design & Leadership"

---

## 4.1 Advanced Node.js

### Q: Memory management aur performance tuning kaise karte hain?

```javascript
// === V8 MEMORY STRUCTURE ===
// Young Generation (Small, fast GC):
//   - New Space: Naya allocate objects
//   - Old Space: Survive hone wale objects
// Old Generation (Large, slow GC):
//   - Large Object Space: 1MB+ objects
//   - Code Space: JIT compiled code
//   - Map Space: Object shapes

// Memory leak detect karna
const v8 = require('v8');

function getMemoryStats() {
  const heapStats = v8.getHeapStatistics();
  return {
    heapUsed: `${(heapStats.used_heap_size / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(heapStats.total_heap_size / 1024 / 1024).toFixed(2)} MB`,
    external: `${(heapStats.external_memory / 1024 / 1024).toFixed(2)} MB`,
  };
}

// Periodic memory monitoring
setInterval(() => {
  const stats = getMemoryStats();
  
  // Alert if > 80% heap used
  const used = parseFloat(stats.heapUsed);
  const total = parseFloat(stats.heapTotal);
  
  if (used / total > 0.8) {
    logger.warn('HIGH MEMORY USAGE', stats);
    // Trigger garbage collection hint
    if (global.gc) global.gc();
  }
}, 30000);

// WeakMap — GC ke saath automatically cleanup
const sessionCache = new WeakMap();
// Object jab garbage collect ho, cache se bhi hat jaata hai

// WeakRef — Object ko GC se nahi rokna
class SymbolTextureManager {
  constructor() {
    this.cache = new Map();
  }
  
  get(name) {
    const ref = this.cache.get(name);
    if (ref) {
      const texture = ref.deref(); // WeakRef se value nikalo
      if (texture) return texture; // Still alive
    }
    
    // Load fresh
    const texture = loadTexture(name);
    this.cache.set(name, new WeakRef(texture));
    return texture;
  }
}

// FinalizationRegistry — cleanup on GC
const registry = new FinalizationRegistry((key) => {
  console.log(`Texture ${key} garbage collected`);
  textureCache.delete(key);
});

registry.register(texture, 'wild-texture');
```

### Q: Worker Threads se CPU-intensive tasks handle karo

```javascript
// main.js — Game server
const { Worker } = require('worker_threads');
const os = require('os');

class RTPCalculatorPool {
  constructor() {
    this.workers = [];
    this.queue = [];
    this.maxWorkers = os.cpus().length - 1; // Main thread ke liye 1 core bacho
    
    this.initWorkers();
  }
  
  initWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.addWorker();
    }
  }
  
  addWorker() {
    const worker = new Worker('./workers/rtp-calculator.js');
    const workerObj = { worker, busy: false };
    
    worker.on('message', ({ requestId, result, error }) => {
      workerObj.busy = false;
      
      const pending = this.queue.find(q => q.requestId === requestId);
      if (pending) {
        if (error) pending.reject(new Error(error));
        else pending.resolve(result);
        
        this.queue = this.queue.filter(q => q.requestId !== requestId);
      }
      
      // Next task process karo
      this.processQueue();
    });
    
    worker.on('error', (err) => {
      console.error('Worker error:', err);
      workerObj.busy = false;
      this.workers = this.workers.filter(w => w !== workerObj);
      this.addWorker(); // Replace crashed worker
    });
    
    this.workers.push(workerObj);
  }
  
  async calculate(spinData) {
    return new Promise((resolve, reject) => {
      const requestId = crypto.randomUUID();
      this.queue.push({ requestId, spinData, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    const freeWorker = this.workers.find(w => !w.busy);
    const pendingTask = this.queue[0];
    
    if (freeWorker && pendingTask && !pendingTask.processing) {
      pendingTask.processing = true;
      freeWorker.busy = true;
      freeWorker.worker.postMessage({
        requestId: pendingTask.requestId,
        data: pendingTask.spinData
      });
    }
  }
}

// workers/rtp-calculator.js
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ requestId, data }) => {
  try {
    // CPU-intensive RTP simulation
    const result = simulateMillionSpins(data.gameConfig);
    parentPort.postMessage({ requestId, result });
  } catch (err) {
    parentPort.postMessage({ requestId, error: err.message });
  }
});

function simulateMillionSpins(gameConfig) {
  // 1 million spin simulation
  let totalBet = 0, totalWin = 0;
  
  for (let i = 0; i < 1_000_000; i++) {
    const bet = 1;
    totalBet += bet;
    totalWin += calculateSpinWin(gameConfig, bet);
  }
  
  return {
    rtp: totalWin / totalBet,
    totalSpins: 1_000_000,
    avgWin: totalWin / 1_000_000
  };
}
```

---

## 4.2 PixiJS — Advanced Game Features

### Q: PixiJS mein advanced animations aur effects kaise banate hain?

```javascript
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

// === ADVANCED SLOT EFFECTS ===

class AdvancedSlotEffects {
  constructor(app) {
    this.app = app;
    this.effectsContainer = new PIXI.Container();
    app.stage.addChild(this.effectsContainer);
  }
  
  // 1. Win Line Animation — Payline highlight
  animateWinLine(linePositions, color = 0xFFD700) {
    const graphics = new PIXI.Graphics();
    this.effectsContainer.addChild(graphics);
    
    let progress = 0;
    const ticker = this.app.ticker.add(() => {
      graphics.clear();
      graphics.lineStyle(4, color, 0.8);
      
      // Dashed line effect
      const dashLength = 20;
      const gapLength = 10;
      let totalLength = 0;
      
      for (let i = 0; i < linePositions.length - 1; i++) {
        const start = linePositions[i];
        const end = linePositions[i + 1];
        
        // Draw animated line
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);
      }
      
      // Alpha pulsing
      graphics.alpha = 0.5 + Math.sin(progress * 0.1) * 0.5;
      progress++;
    });
    
    // Auto cleanup after 2 seconds
    setTimeout(() => {
      this.app.ticker.remove(ticker);
      this.effectsContainer.removeChild(graphics);
      graphics.destroy();
    }, 2000);
  }
  
  // 2. Win Counter Animation — Number count up
  async animateWinCounter(fromAmount, toAmount, displayText) {
    return new Promise(resolve => {
      const startTime = Date.now();
      const duration = Math.min(2000, toAmount * 10); // Max 2 sec
      
      const ticker = this.app.ticker.add(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const currentAmount = fromAmount + (toAmount - fromAmount) * eased;
        displayText.text = `₹${currentAmount.toFixed(2)}`;
        
        if (progress >= 1) {
          this.app.ticker.remove(ticker);
          resolve();
        }
      });
    });
  }
  
  // 3. Symbol Win Animation — Bounce + Glow
  animateWinSymbols(symbolSprites) {
    symbolSprites.forEach((sprite, index) => {
      // GSAP sequence
      gsap.timeline()
        .to(sprite.scale, {
          x: 1.2, y: 1.2,
          duration: 0.15,
          delay: index * 0.05, // Stagger
          ease: 'back.out(2)'
        })
        .to(sprite.scale, {
          x: 1.0, y: 1.0,
          duration: 0.1
        })
        .to(sprite, {
          alpha: 0.6,
          duration: 0.2,
          yoyo: true,
          repeat: 3
        });
      
      // Glow effect
      const glow = new PIXI.ColorMatrixFilter();
      glow.brightness(1.5);
      sprite.filters = [glow];
      
      setTimeout(() => {
        sprite.filters = [];
      }, 1500);
    });
  }
  
  // 4. Jackpot Effect — Full screen celebration
  async playJackpotEffect(jackpotAmount) {
    // Screen flash
    const flash = new PIXI.Graphics();
    flash.beginFill(0xFFD700, 0.5);
    flash.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    flash.endFill();
    this.effectsContainer.addChild(flash);
    
    await gsap.to(flash, { alpha: 0, duration: 0.5 }).then();
    this.effectsContainer.removeChild(flash);
    
    // Coin rain
    this.startCoinRain(100);
    
    // Big win text
    const winText = new PIXI.Text(`JACKPOT!\n₹${jackpotAmount.toLocaleString()}`, {
      fontFamily: 'Arial Black',
      fontSize: 72,
      fill: [0xFFD700, 0xFF8C00], // Gradient
      stroke: 0x8B6914,
      strokeThickness: 8,
      align: 'center',
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 10
    });
    
    winText.anchor.set(0.5);
    winText.x = this.app.screen.width / 2;
    winText.y = this.app.screen.height / 2;
    winText.scale.set(0);
    
    this.effectsContainer.addChild(winText);
    
    await gsap.to(winText.scale, {
      x: 1, y: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    }).then();
    
    await new Promise(r => setTimeout(r, 3000));
    
    gsap.to(winText, { alpha: 0, duration: 0.5, onComplete: () => {
      this.effectsContainer.removeChild(winText);
      winText.destroy();
    }});
  }
  
  // 5. Particle System — Custom
  startCoinRain(count) {
    const particleContainer = new PIXI.ParticleContainer(count, {
      position: true, rotation: true, alpha: true, scale: true
    });
    
    this.effectsContainer.addChild(particleContainer);
    
    const coins = Array.from({ length: count }, () => {
      const coin = new PIXI.Sprite(PIXI.Texture.from('coin.png'));
      coin.anchor.set(0.5);
      coin.x = Math.random() * this.app.screen.width;
      coin.y = -20;
      coin.vx = (Math.random() - 0.5) * 3;
      coin.vy = 2 + Math.random() * 5;
      coin.rotation = Math.random() * Math.PI * 2;
      coin.vr = (Math.random() - 0.5) * 0.2;
      particleContainer.addChild(coin);
      return coin;
    });
    
    let ticker;
    ticker = this.app.ticker.add(() => {
      let allDone = true;
      
      coins.forEach(coin => {
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.vy += 0.15; // Gravity
        coin.rotation += coin.vr;
        
        if (coin.y < this.app.screen.height + 20) {
          allDone = false;
        } else {
          coin.alpha = 0;
        }
      });
      
      if (allDone) {
        this.app.ticker.remove(ticker);
        this.effectsContainer.removeChild(particleContainer);
        particleContainer.destroy({ children: true });
      }
    });
  }
}

// === STATE MACHINE — Game flow control ===
const GameState = {
  IDLE: 'IDLE',
  SPINNING: 'SPINNING', 
  RESOLVING: 'RESOLVING',
  WIN_ANIMATION: 'WIN_ANIMATION',
  FREE_SPINS: 'FREE_SPINS',
  BONUS: 'BONUS'
};

class SlotGameStateMachine {
  constructor() {
    this.state = GameState.IDLE;
    
    this.transitions = {
      [GameState.IDLE]: [GameState.SPINNING],
      [GameState.SPINNING]: [GameState.RESOLVING],
      [GameState.RESOLVING]: [GameState.WIN_ANIMATION, GameState.IDLE, GameState.FREE_SPINS],
      [GameState.WIN_ANIMATION]: [GameState.IDLE, GameState.FREE_SPINS],
      [GameState.FREE_SPINS]: [GameState.SPINNING, GameState.IDLE],
    };
  }
  
  transition(newState) {
    const allowed = this.transitions[this.state];
    
    if (!allowed?.includes(newState)) {
      throw new Error(`Invalid transition: ${this.state} → ${newState}`);
    }
    
    console.log(`State: ${this.state} → ${newState}`);
    this.state = newState;
    this.emit('stateChange', newState);
  }
  
  get canSpin() {
    return this.state === GameState.IDLE || this.state === GameState.FREE_SPINS;
  }
}
```

---

# 🏔️ STAGE 5: STAFF/LEAD (8–10+ Years)
## "Architecture, Scale, Mentorship"

---

## 5.1 System Design

### Q: 1 Million concurrent users ke liye slot game design karo

```javascript
// === COMPLETE SYSTEM ARCHITECTURE ===

/**
 * TIER 1: CDN + Edge (Cloudflare)
 * - Static assets (PixiJS bundles, textures)
 * - DDoS protection
 * - Global distribution
 * - Edge caching
 *
 * TIER 2: Load Balancer (AWS ALB)
 * - SSL termination
 * - Health checks
 * - Sticky sessions for WebSocket
 *
 * TIER 3: Application Layer
 * - API Gateway (Kong) — Auth, rate limiting
 * - Game Service (Node.js) — Spin logic
 * - Balance Service (Node.js) — Financial ops
 * - Notification Service — Real-time events
 *
 * TIER 4: Data Layer
 * - PostgreSQL (Primary + Read Replicas) — Source of truth
 * - Redis Cluster — Cache, sessions, pub/sub
 * - Apache Kafka — Event streaming, audit logs
 * - ClickHouse — Analytics, reporting
 *
 * TIER 5: Infrastructure
 * - Kubernetes — Container orchestration
 * - Prometheus + Grafana — Monitoring
 * - ELK Stack — Log management
 * - PagerDuty — Alerting
 */

// Microservice Communication — Event-Driven
class EventBus {
  constructor(kafkaClient) {
    this.producer = kafkaClient.producer();
    this.consumers = new Map();
  }
  
  async publish(topic, event) {
    await this.producer.send({
      topic,
      messages: [{
        key: event.userId,      // Same user ke events same partition mein
        value: JSON.stringify({
          ...event,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          service: process.env.SERVICE_NAME
        })
      }]
    });
  }
  
  async subscribe(topic, groupId, handler) {
    const consumer = this.kafkaClient.consumer({ groupId });
    await consumer.subscribe({ topic, fromBeginning: false });
    
    await consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        
        try {
          await handler(event);
        } catch (err) {
          // Dead letter queue
          await this.publish(`${topic}.dlq`, { ...event, error: err.message });
        }
      }
    });
    
    this.consumers.set(groupId, consumer);
  }
}

// SAGA Pattern — Distributed transactions
class SpinSaga {
  constructor({ balanceService, gameService, auditService, eventBus }) {
    this.steps = [];
    this.compensations = [];
    this.services = { balanceService, gameService, auditService, eventBus };
  }
  
  async execute(spinRequest) {
    const sagaId = crypto.randomUUID();
    const executed = [];
    
    const steps = [
      {
        action: () => this.services.balanceService.deduct(spinRequest.userId, spinRequest.bet),
        compensation: (result) => this.services.balanceService.refund(spinRequest.userId, spinRequest.bet, sagaId),
        name: 'DEDUCT_BALANCE'
      },
      {
        action: () => this.services.gameService.calculateResult(spinRequest),
        compensation: () => {}, // Cannot undo random result
        name: 'CALCULATE_RESULT'
      },
      {
        action: (result) => this.services.balanceService.credit(spinRequest.userId, result.winAmount),
        compensation: (result) => this.services.balanceService.deduct(spinRequest.userId, result.winAmount, sagaId),
        name: 'CREDIT_WIN'
      },
      {
        action: (result) => this.services.auditService.record({ sagaId, ...spinRequest, ...result }),
        compensation: () => {},
        name: 'RECORD_AUDIT'
      }
    ];
    
    let previousResult = null;
    
    for (const step of steps) {
      try {
        previousResult = await step.action(previousResult);
        executed.push({ step, result: previousResult });
      } catch (err) {
        console.error(`Saga failed at ${step.name}:`, err);
        
        // Rollback — reverse order mein compensate karo
        for (const { step: s, result } of executed.reverse()) {
          try {
            await s.compensation(result);
          } catch (compensationErr) {
            // Manual intervention needed
            await alertOps(`Saga ${sagaId} compensation failed at ${s.name}`);
          }
        }
        
        throw err;
      }
    }
    
    return previousResult;
  }
}
```

---

## 5.2 Code Review & Mentorship

### Q: Junior ka code review karte waqt kya dekhte ho?

```javascript
// === CODE REVIEW CHECKLIST ===

/**
 * 1. CORRECTNESS
 * - Logic sahi hai?
 * - Edge cases handle hain? (null, undefined, empty array)
 * - Error handling proper hai?
 *
 * 2. SECURITY
 * - Input validation hai?
 * - SQL injection possible hai?
 * - Sensitive data log to nahi ho raha?
 *
 * 3. PERFORMANCE
 * - N+1 query toh nahi?
 * - Unnecessary loops?
 * - Memory leak potential?
 *
 * 4. READABILITY
 * - Variable names clear hain?
 * - Complex logic explain kiya hai?
 * - Functions single responsibility follow kar rahi hain?
 *
 * 5. TESTABILITY
 * - Unit testable hai code?
 * - Dependencies inject hain?
 */

// ❌ Junior ka code — Review feedback ke saath
async function doStuff(req, res) {  
  // 🔴 Function name unclear hai — "doStuff" kya karta hai?
  // 🔴 Error handling nahi hai
  // 🔴 Input validation nahi
  
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.body.id}`);
  // 🔴 SQL Injection! req.body.id directly use kiya
  // 🔴 SELECT * — unnecessary columns
  
  if (user.balance >= req.body.amount) {
    user.balance -= req.body.amount;
    db.query(`UPDATE users SET balance = ${user.balance} WHERE id = ${req.body.id}`);
    // 🔴 Race condition! Read-modify-write atomic nahi hai
    // 🔴 await missing — fire and forget
    
    console.log(`User ${user.email} withdrew ${req.body.amount} and password is ${user.password}`);
    // 🔴 Sensitive data log ho raha hai!
    
    res.json({ success: true });
  }
  // 🔴 else case handle nahi kiya
}

// ✅ Reviewed & Fixed
async function withdrawBalance(req, res, next) {
  try {
    const { userId, amount } = req.body;
    
    // Validation
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    // Atomic operation with row lock
    const result = await db.transaction(async trx => {
      const user = await trx('users')
        .select('id', 'balance') // Only needed columns
        .where({ id: userId })
        .forUpdate() // Row lock — race condition prevent
        .first();
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      if (user.balance < amount) {
        throw new InsufficientBalanceError(amount, user.balance);
      }
      
      const [updated] = await trx('users')
        .where({ id: userId })
        .update({ balance: trx.raw('balance - ?', [amount]) })
        .returning('balance');
      
      return updated;
    });
    
    logger.info('Withdrawal successful', { userId, amount }); // No sensitive data
    
    res.json({ 
      success: true, 
      newBalance: result.balance 
    });
    
  } catch (err) {
    next(err); // Error middleware handle karega
  }
}
```

---

## 5.3 Interview Confidence Tips

```
╔══════════════════════════════════════════════════════════╗
║           SENIOR INTERVIEW MEIN YAH BOLO               ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  "Iske do approaches hain..."                           ║
║  → Trade-offs dikhana = senior thinking                 ║
║                                                          ║
║  "Isme yeh assumption hai ki..."                        ║
║  → Clarifying questions = good engineer                 ║
║                                                          ║
║  "Maine ek baar aise bug fix kiya tha..."              ║
║  → Real examples = credibility                          ║
║                                                          ║
║  "Pehle simple solution phir optimize karo"             ║
║  → YAGNI principle = pragmatism                        ║
║                                                          ║
║  "Mujhe isme research karni padegi..."                  ║
║  → Intellectual honesty = respect                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 📊 COMPLETE SKILLS MATRIX

| Skill | Fresher | Junior | Mid | Senior | Staff |
|-------|---------|--------|-----|--------|-------|
| HTML/CSS | Basic tags | Flexbox/Grid | Animations | Perf optimization | Architecture |
| JavaScript | Syntax | Async/Await | Closures, OOP | Memory, Workers | Design patterns |
| Node.js | HTTP server | Express basics | Streams | Clustering | Microservices |
| Express | Routes | Middleware | Auth, Validation | Error handling | API Design |
| PixiJS | Sprites | Basic animation | Particles | GPU optimization | Game architecture |
| Database | SQL basics | Joins, Index | N+1, Transactions | Sharding, Partitioning | Data modeling |
| Redis | Basic get/set | Caching | Pub/Sub, Locks | Clustering | Cache strategies |
| Testing | None | Unit tests | Integration | Load testing | TDD, BDD |
| DevOps | None | Docker basics | Docker Compose | Kubernetes | CI/CD, SRE |
| System Design | None | Basic API | Microservices | Distributed systems | Large scale architecture |

---

*Yaad rakho: Senior engineer woh nahi jo sab answers jaanta hai, woh hai jo sahi sawaal poochta hai! 🚀*

*Stack: Node.js 20+ · Express 4 · PixiJS 7 · PostgreSQL 15 · Redis 7 · Kubernetes*