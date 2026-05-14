# 🎰 Complete Game Developer Master Roadmap
### Vishnu | PixiJS → Full Stack Game Developer

---

## 📊 Current Level Assessment

| Skill | Level | Status |
|-------|-------|--------|
| PixiJS / Frontend | Expert | ✅ Done |
| RTP Math | Strong | ✅ Done |
| Node.js + Express | Basic | 🔄 Improve karna hai |
| Database (MySQL/MongoDB) | Basic | 🔄 Improve karna hai |
| Game Features (Wild, Cascade etc) | Intermediate | 🔄 Seekh raha hai |
| Backend Game APIs | Beginner | ❌ Sikhna hai |
| Game Security | Beginner | ❌ Sikhna hai |
| Game Architecture | Beginner | ❌ Sikhna hai |
| WebSockets (Multiplayer) | Beginner | ❌ Sikhna hai |

---

## 🗺️ Master Roadmap — Phase by Phase

```
Phase 1 (Month 1-2)  → Backend Game APIs + Security
Phase 2 (Month 3-4)  → Game Architecture + Advanced Features  
Phase 3 (Month 5-6)  → Multiplayer + Tournaments
Phase 4 (Month 7-12) → Master Level — Independent Game Studio
```

---

# PHASE 1 — Backend Game APIs + Security
## ⏱️ Month 1-2

---

## 1.1 Why Backend Zaroori Hai?

Frontend pe sirf animation aur UI hoti hai.
**Real game logic backend pe honi chahiye** — warna player cheat kar sakta hai.

```
❌ Wrong Approach:
Player → Frontend result calculate karta hai → Server ko bolta hai "maine jeeta"

✅ Correct Approach:
Player → Spin request bhejta hai → Server result calculate karta hai → Frontend sirf dikhata hai
```

---

## 1.2 Spin API — Basic Structure

### Folder Structure:
```
slot-game-backend/
├── src/
│   ├── controllers/
│   │   └── gameController.js
│   ├── services/
│   │   ├── spinService.js
│   │   ├── rtpService.js
│   │   └── winService.js
│   ├── models/
│   │   ├── Player.js
│   │   └── SpinHistory.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       └── gameRoutes.js
├── app.js
└── package.json
```

---

### Basic Spin API:

```javascript
// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { spinReel, getBalance } = require('../controllers/gameController');
const auth = require('../middleware/authMiddleware');

router.post('/spin', auth, spinReel);
router.get('/balance', auth, getBalance);

module.exports = router;
```

```javascript
// controllers/gameController.js
const spinService = require('../services/spinService');
const Player = require('../models/Player');

async function spinReel(req, res) {
  try {
    const { betAmount } = req.body;
    const playerId = req.player.id;

    // Step 1: Player balance check karo
    const player = await Player.findById(playerId);
    if (player.balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Step 2: Bet deduct karo pehle
    await Player.updateBalance(playerId, -betAmount);

    // Step 3: Server pe spin karo
    const spinResult = await spinService.doSpin(betAmount);

    // Step 4: Win amount add karo
    if (spinResult.totalWin > 0) {
      await Player.updateBalance(playerId, spinResult.totalWin);
    }

    // Step 5: History save karo
    await SpinHistory.create({
      playerId,
      betAmount,
      result: spinResult.grid,
      winAmount: spinResult.totalWin,
      timestamp: new Date()
    });

    // Step 6: Frontend ko result bhejo
    res.json({
      success: true,
      grid: spinResult.grid,
      wins: spinResult.wins,
      totalWin: spinResult.totalWin,
      newBalance: player.balance - betAmount + spinResult.totalWin
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spin failed' });
  }
}

module.exports = { spinReel };
```

---

## 1.3 Spin Service — Server Side RNG

```javascript
// services/spinService.js

// Symbol weights — jitna zyada weight, utna zyada aayega
const SYMBOL_WEIGHTS = {
  'A':       5,   // Rare — high value
  'K':       8,
  'Q':       10,
  'J':       12,
  '10':      15,
  'WILD':    3,   // Bahut rare
  'SCATTER': 3,
  'BONUS':   4,
};

const PAYTABLE = {
  'A':    { 3: 50,  4: 200,  5: 1000 },
  'K':    { 3: 30,  4: 100,  5: 500  },
  'Q':    { 3: 20,  4: 80,   5: 300  },
  'J':    { 3: 15,  4: 60,   5: 200  },
  '10':   { 3: 10,  4: 40,   5: 100  },
  'WILD': { 3: 100, 4: 500,  5: 5000 },
};

// Weighted random symbol
function getRandomSymbol() {
  const symbols = Object.keys(SYMBOL_WEIGHTS);
  const weights = Object.values(SYMBOL_WEIGHTS);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let random = Math.random() * totalWeight;

  for (let i = 0; i < symbols.length; i++) {
    random -= weights[i];
    if (random <= 0) return symbols[i];
  }

  return symbols[symbols.length - 1];
}

// Grid generate karo — 5 reels x 3 rows
function generateGrid() {
  const grid = [];
  for (let reel = 0; reel < 5; reel++) {
    const reelSymbols = [];
    for (let row = 0; row < 3; row++) {
      reelSymbols.push(getRandomSymbol());
    }
    grid.push(reelSymbols);
  }
  return grid;
}

// Main spin function
async function doSpin(betAmount) {
  const grid = generateGrid();
  const wins = checkAllWins(grid);
  const totalWin = calculateTotalWin(wins, betAmount);

  return { grid, wins, totalWin };
}

module.exports = { doSpin };
```

---

## 1.4 Win Check — Server Side

```javascript
// services/winService.js

const PAYLINES = [
  [1, 1, 1, 1, 1], // Middle row
  [0, 0, 0, 0, 0], // Top row
  [2, 2, 2, 2, 2], // Bottom row
  [0, 1, 2, 1, 0], // V shape
  [2, 1, 0, 1, 2], // Inverted V
  [0, 0, 1, 2, 2], // Diagonal down
  [2, 2, 1, 0, 0], // Diagonal up
  [1, 0, 0, 0, 1], // W shape
  [1, 2, 2, 2, 1], // M shape
  [0, 1, 1, 1, 0], // Cup shape
];

function checkAllWins(grid) {
  const wins = [];

  PAYLINES.forEach((payline, lineIndex) => {
    // Payline ke symbols nikalo
    const symbols = payline.map((row, reel) => grid[reel][row]);

    const win = checkLineWin(symbols, lineIndex, payline);
    if (win) wins.push(win);
  });

  // Scatter wins alag check karo
  const scatterWin = checkScatterWin(grid);
  if (scatterWin) wins.push(scatterWin);

  return wins;
}

function checkLineWin(symbols, lineIndex, payline) {
  // Pehla non-wild symbol dhundo
  let firstSymbol = null;
  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i] !== 'WILD') {
      firstSymbol = symbols[i];
      break;
    }
  }

  // Agar sab wild hain
  if (!firstSymbol) firstSymbol = 'WILD';

  // Count karo kitne match hain
  let matchCount = 0;
  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i] === firstSymbol || symbols[i] === 'WILD') {
      matchCount++;
    } else break;
  }

  if (matchCount >= 3 && PAYTABLE[firstSymbol]) {
    return {
      type: 'payline',
      lineIndex,
      symbol: firstSymbol,
      count: matchCount,
      payout: PAYTABLE[firstSymbol][matchCount] || 0,
      positions: payline.slice(0, matchCount).map((row, reel) => ({ reel, row }))
    };
  }

  return null;
}

function checkScatterWin(grid) {
  let scatterCount = 0;
  const positions = [];

  grid.forEach((reel, reelIndex) => {
    reel.forEach((sym, rowIndex) => {
      if (sym === 'SCATTER') {
        scatterCount++;
        positions.push({ reel: reelIndex, row: rowIndex });
      }
    });
  });

  if (scatterCount >= 3) {
    return {
      type: 'scatter',
      count: scatterCount,
      freeSpins: scatterCount === 3 ? 10 : scatterCount === 4 ? 15 : 20,
      positions
    };
  }

  return null;
}

function calculateTotalWin(wins, betAmount) {
  return wins.reduce((total, win) => {
    if (win.type === 'payline') {
      return total + (win.payout * betAmount);
    }
    return total;
  }, 0);
}

module.exports = { checkAllWins, calculateTotalWin };
```

---

## 1.5 Security — Bahut Important!

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.player = decoded;
    next();

  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
```

```javascript
// Security Rules — yaad rakhna!

// ✅ 1. Bet amount server pe validate karo
if (betAmount < MIN_BET || betAmount > MAX_BET) {
  return res.status(400).json({ error: 'Invalid bet' });
}

// ✅ 2. Balance check pehle karo — race condition avoid karo
// Database transaction use karo
await db.transaction(async (trx) => {
  const player = await Player.findById(playerId, trx);
  if (player.balance < betAmount) throw new Error('Insufficient');
  await Player.deductBalance(playerId, betAmount, trx);
});

// ✅ 3. Result server pe generate karo — kabhi frontend pe nahi
// Frontend sirf display karta hai

// ✅ 4. Rate limiting lagao — spam prevent karo
const rateLimit = require('express-rate-limit');
const spinLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 2,         // Max 2 spins per second
});
app.use('/api/spin', spinLimiter);

// ✅ 5. Har spin ka log rakho — audit ke liye
await SpinHistory.create({ playerId, betAmount, result, winAmount });
```

---

# PHASE 2 — Game Architecture + Advanced Features
## ⏱️ Month 3-4

---

## 2.1 Game State Machine

```javascript
// State machine — game ka dil

const GAME_STATES = {
  IDLE: 'IDLE',           // Spin button available
  SPINNING: 'SPINNING',   // Reels spin ho rahi hain
  WIN_SHOW: 'WIN_SHOW',   // Win animation
  FREE_SPINS: 'FREE_SPINS', // Free spins chal rahi hain
  BONUS: 'BONUS',         // Bonus game
  CASCADE: 'CASCADE',     // Cascade ho raha hai
};

class GameStateMachine {
  constructor() {
    this.state = GAME_STATES.IDLE;
  }

  transition(newState) {
    const allowed = {
      [GAME_STATES.IDLE]:       [GAME_STATES.SPINNING],
      [GAME_STATES.SPINNING]:   [GAME_STATES.WIN_SHOW, GAME_STATES.CASCADE, GAME_STATES.FREE_SPINS, GAME_STATES.IDLE],
      [GAME_STATES.WIN_SHOW]:   [GAME_STATES.IDLE, GAME_STATES.CASCADE],
      [GAME_STATES.CASCADE]:    [GAME_STATES.WIN_SHOW, GAME_STATES.IDLE],
      [GAME_STATES.FREE_SPINS]: [GAME_STATES.SPINNING, GAME_STATES.IDLE],
      [GAME_STATES.BONUS]:      [GAME_STATES.IDLE],
    };

    if (allowed[this.state]?.includes(newState)) {
      console.log(`State: ${this.state} → ${newState}`);
      this.state = newState;
      return true;
    }

    console.error(`Invalid transition: ${this.state} → ${newState}`);
    return false;
  }

  is(state) {
    return this.state === state;
  }
}
```

---

## 2.2 RTP Calculation

```javascript
// RTP = Return to Player
// Agar RTP 96% hai — player ne 100 bet kiya → 96 wapas milega average

// RTP simulate karo — 1 million spins
async function simulateRTP(spins = 1000000) {
  let totalBet = 0;
  let totalWin = 0;
  const betAmount = 1;

  for (let i = 0; i < spins; i++) {
    const result = await doSpin(betAmount);
    totalBet += betAmount;
    totalWin += result.totalWin;
  }

  const rtp = (totalWin / totalBet) * 100;
  console.log(`RTP: ${rtp.toFixed(2)}%`);
  return rtp;
}

// RTP adjust karne ke liye — symbol weights adjust karo
// Wild zyada → RTP badhega
// High value symbols zyada → RTP badhega
```

---

## 2.3 Database Schema

```sql
-- Players table
CREATE TABLE players (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  balance     DECIMAL(15, 2) DEFAULT 0.00,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spin history
CREATE TABLE spin_history (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  player_id   INT NOT NULL,
  bet_amount  DECIMAL(10, 2) NOT NULL,
  win_amount  DECIMAL(10, 2) DEFAULT 0,
  grid        JSON NOT NULL,
  wins        JSON,
  free_spins  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Free spins tracking
CREATE TABLE free_spins (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  player_id   INT NOT NULL,
  spins_left  INT NOT NULL,
  multiplier  INT DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Jackpot table
CREATE TABLE jackpots (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  type        ENUM('MINI', 'MINOR', 'MAJOR', 'GRAND'),
  amount      DECIMAL(15, 2) NOT NULL,
  winner_id   INT,
  won_at      TIMESTAMP,
  FOREIGN KEY (winner_id) REFERENCES players(id)
);
```

---

## 2.4 Free Spins — Server Side

```javascript
// services/freeSpinService.js

async function startFreeSpins(playerId, spinsCount) {
  // DB mein save karo
  await FreeSpins.create({
    playerId,
    spinsLeft: spinsCount,
    multiplier: 1
  });
}

async function doFreeSpin(playerId) {
  const freeSpinData = await FreeSpins.findByPlayer(playerId);

  if (!freeSpinData || freeSpinData.spinsLeft <= 0) {
    return { error: 'No free spins left' };
  }

  // Spin karo — bet 0 hai free spin mein
  const result = await doSpin(freeSpinData.betAmount);

  // Multiplier apply karo
  const winWithMultiplier = result.totalWin * freeSpinData.multiplier;

  // Spins left update karo
  await FreeSpins.update(playerId, {
    spinsLeft: freeSpinData.spinsLeft - 1,
    multiplier: freeSpinData.multiplier + 1 // Progressive multiplier
  });

  // Balance update karo
  if (winWithMultiplier > 0) {
    await Player.updateBalance(playerId, winWithMultiplier);
  }

  // Retrigger check
  const scatterWin = result.wins.find(w => w.type === 'scatter');
  if (scatterWin) {
    await FreeSpins.addSpins(playerId, scatterWin.freeSpins);
  }

  return {
    ...result,
    totalWin: winWithMultiplier,
    spinsLeft: freeSpinData.spinsLeft - 1,
    multiplier: freeSpinData.multiplier
  };
}
```

---

# PHASE 3 — Multiplayer + Tournaments
## ⏱️ Month 5-6

---

## 3.1 WebSockets — Real Time

```javascript
// WebSocket — real time communication
// Use case: Leaderboard live update, tournament results

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Player spin karta hai
  socket.on('spin', async (data) => {
    const { betAmount, playerId } = data;

    const result = await spinService.doSpin(betAmount);

    // Sirf us player ko result bhejo
    socket.emit('spinResult', result);

    // Agar bada win hua — sab ko dikhao (jackpot etc)
    if (result.totalWin > 10000) {
      io.emit('bigWin', {
        playerId,
        winAmount: result.totalWin
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});
```

---

## 3.2 Tournament System

```javascript
// Tournament — sabka ek hi time pe competition

class Tournament {
  constructor(config) {
    this.id = config.id;
    this.startTime = config.startTime;
    this.endTime = config.endTime;
    this.prizePool = config.prizePool;
    this.leaderboard = []; // { playerId, points }
  }

  addPoints(playerId, winAmount) {
    const existing = this.leaderboard.find(p => p.playerId === playerId);

    if (existing) {
      existing.points += winAmount;
    } else {
      this.leaderboard.push({ playerId, points: winAmount });
    }

    // Sort by points
    this.leaderboard.sort((a, b) => b.points - a.points);

    // Live leaderboard update
    io.emit('leaderboardUpdate', this.leaderboard.slice(0, 10));
  }

  distributeRewards() {
    const prizes = [0.4, 0.25, 0.15, 0.1, 0.1]; // Top 5 ka share

    this.leaderboard.slice(0, 5).forEach((player, index) => {
      const prize = this.prizePool * prizes[index];
      Player.updateBalance(player.playerId, prize);
    });
  }
}
```

---

# PHASE 4 — Master Level
## ⏱️ Month 7-12

---

## 4.1 What Master Level Means

```
✅ Complete game banana — frontend + backend
✅ RTP accurately set karna
✅ Security bulletproof karna
✅ Scalable architecture
✅ Multiple game types
✅ Tournament system
✅ Analytics dashboard
✅ Mobile optimized
✅ Performance optimized
```

---

## 4.2 Projects Jo Banana Hai

### Project 1 — Basic Slot (Month 1-2)
```
Frontend: PixiJS — 5x3 grid, 10 paylines
Backend: Node + Express — spin API, balance
DB: MySQL — players, spin history
Features: Wild, Scatter, Free Spins
```

### Project 2 — Advanced Slot (Month 3-4)
```
Frontend: Cascading reels, animations
Backend: RTP calculation, Hold & Spin
DB: Complete schema
Features: All wild types, jackpot
```

### Project 3 — Full Game Platform (Month 5-6)
```
Frontend: Multiple games
Backend: WebSockets, tournaments
DB: Leaderboards, analytics
Features: Everything
```

### Project 4 — Your Own Game (Month 7-12)
```
Complete original game
Deploy on server
Portfolio mein add karo
International clients ke liye
```

---

## 4.3 Resources

### Free Resources:
- **MDN Docs** — JavaScript fundamentals
- **PixiJS Docs** — pixijs.com
- **Node.js Docs** — nodejs.org
- **MySQL Docs** — mysql.com

### YouTube:
- Traversy Media — Node + Express
- Fireship — Quick concepts
- The Coding Train — Game logic

### Practice:
- **LeetCode** — Array/Object problems (Array, HashMap only)
- **HackerRank** — JavaScript challenges

---

## 4.4 Salary Journey

| Timeline | Role | Salary |
|----------|------|--------|
| Now | Game Developer (Bonanza) | 4.7 LPA |
| 1 Year | Game Developer (ZVKY) | 9.5 LPA |
| 2 Years | Senior Game Developer (Noida) | 12-14 LPA |
| 4 Years | Lead Game Developer | 20-25 LPA |
| 6 Years | Principal / Architect | 35-50 LPA |
| 8-10 Years | International / Own Studio | 1 Cr+ |

---

## 4.5 Daily Practice Plan

```
Monday    → Game Feature implement karo (1 feature)
Tuesday   → Backend API banao
Wednesday → Bug fix + code review khud ka
Thursday  → New concept seekho
Friday    → Project mein add karo
Saturday  → Full mini project
Sunday    → Rest 😄
```

---

## ⚡ Quick Revision — Important Points

1. **Result server pe generate karo** — kabhi frontend pe nahi
2. **Balance DB transaction mein update karo** — race condition avoid karo
3. **Har spin log karo** — audit trail zaroori hai
4. **RTP simulate karo** — 1 million spins chalao adjust karne ke liye
5. **State machine use karo** — game flow clean rahega
6. **Security pehle** — JWT, rate limiting, input validation
7. **PixiJS sirf display** — logic backend mein

---

*🎰 Game Developer Master Roadmap — Vishnu | 2025*
*PixiJS Expert → Full Stack Game Developer → International Level*