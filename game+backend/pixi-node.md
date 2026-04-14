# 🎰 Senior Full-Stack Interview Guide
## Express.js · Node.js · PixiJS · Slot Game API
### Hinglish Edition — Basic se Advanced tak (10 Year Senior Level)

> **Target**: 10 साल experience wale Senior Software Engineer ka interview  
> **Stack**: Node.js, Express.js, PixiJS, Slot Game Backend API  
> **Language**: Hinglish (Hindi + English mix)

---

## 📋 TABLE OF CONTENTS

1. [Node.js — Core Concepts](#nodejs)
2. [Express.js — Deep Dive](#expressjs)
3. [Slot Game Backend API](#slot-api)
4. [PixiJS — Frontend Game Engine](#pixijs)
5. [Architecture & System Design](#architecture)
6. [Performance & Optimization](#performance)
7. [Security](#security)
8. [Testing](#testing)
9. [DevOps & Deployment](#devops)
10. [Senior-Level Scenario Questions](#scenarios)

---

<a name="nodejs"></a>
## 🟢 SECTION 1: Node.js — Core Concepts

---

### Q1. Node.js ka Event Loop kya hota hai? Explain karo step by step.

**Answer:**

Node.js single-threaded hai, lekin asynchronous operations handle karne ke liye **Event Loop** use karta hai.

```
   ┌───────────────────────────┐
   │           timers           │  ← setTimeout, setInterval
   ├───────────────────────────┤
   │     pending callbacks      │  ← I/O callbacks previous iteration
   ├───────────────────────────┤
   │       idle, prepare        │  ← internal use
   ├───────────────────────────┤
   │           poll             │  ← fetch new I/O events
   ├───────────────────────────┤
   │           check            │  ← setImmediate
   ├───────────────────────────┤
   │      close callbacks       │  ← socket.on('close')
   └───────────────────────────┘
```

```javascript
// Example: Priority order samjho
console.log('1. Synchronous');

setTimeout(() => console.log('4. setTimeout'), 0);

setImmediate(() => console.log('3. setImmediate'));

Promise.resolve().then(() => console.log('2. Microtask (Promise)'));

// Output:
// 1. Synchronous
// 2. Microtask (Promise)  ← Microtasks sabse pehle
// 3. setImmediate
// 4. setTimeout
```

**Senior tip**: Microtask queue (Promises, queueMicrotask) har phase ke baad run hoti hai, event loop ke next phase se pehle.

---

### Q2. Worker Threads vs Child Process vs Cluster — kab kya use karo?

**Answer:**

```javascript
// ❌ CPU-intensive task — Event Loop block ho jaata hai
app.get('/spin', (req, res) => {
  const result = heavyRTPCalculation(); // 2 seconds block!
  res.json(result);
});

// ✅ Worker Thread — CPU-bound tasks ke liye (same memory space)
const { Worker, isMainThread, parentPort } = require('worker_threads');

// main.js
if (isMainThread) {
  app.get('/spin', (req, res) => {
    const worker = new Worker('./rtp-worker.js', {
      workerData: { betAmount: req.body.bet, userId: req.body.userId }
    });
    worker.on('message', (result) => res.json(result));
    worker.on('error', (err) => res.status(500).json({ error: err.message }));
  });
}

// rtp-worker.js
const { workerData, parentPort } = require('worker_threads');
const result = calculateRTP(workerData.betAmount); // CPU heavy
parentPort.postMessage(result);
```

```javascript
// ✅ Cluster — Multiple CPU cores use karne ke liye
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length; // 8 cores = 8 workers
  console.log(`Primary ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork(); // Auto restart
  });
} else {
  // Har worker apna Express server run karta hai
  require('./app').listen(3000);
  console.log(`Worker ${process.pid} started`);
}
```

| Feature | Worker Thread | Child Process | Cluster |
|---------|--------------|---------------|---------|
| Use case | CPU-bound | Separate program | Load distribution |
| Memory | Shared | Separate | Separate |
| Communication | SharedArrayBuffer | IPC/Pipe | IPC |
| Slot game use | RNG/RTP calc | Payment service | API scaling |

---

### Q3. Memory Leaks kaise detect aur fix karte hain Node.js mein?

**Answer:**

```javascript
// ❌ Common memory leak — Slot game mein frequently hota hai
class SlotGameRoom {
  constructor() {
    this.activeSessions = new Map(); // kabhi clear nahi hota!
    this.eventListeners = [];
  }
  
  addPlayer(socket) {
    // Leak: Player disconnect hone ke baad bhi session rehta hai
    this.activeSessions.set(socket.id, {
      userId: socket.userId,
      balance: socket.balance,
      spinHistory: [] // grows indefinitely!
    });
    
    // Leak: EventListener remove nahi hota
    socket.on('spin', this.handleSpin.bind(this));
  }
}

// ✅ Fixed Version
class SlotGameRoom {
  constructor() {
    this.activeSessions = new Map();
    this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min
  }
  
  addPlayer(socket) {
    const session = {
      userId: socket.userId,
      balance: socket.balance,
      spinHistory: new CircularBuffer(100), // Max 100 entries
      lastActivity: Date.now()
    };
    
    this.activeSessions.set(socket.id, session);
    
    const spinHandler = (data) => this.handleSpin(socket, data);
    socket.on('spin', spinHandler);
    
    // Cleanup on disconnect
    socket.on('disconnect', () => {
      socket.off('spin', spinHandler); // Listener remove karo
      this.activeSessions.delete(socket.id);
      console.log(`Session cleaned: ${socket.id}`);
    });
  }
  
  // Periodic cleanup for zombie sessions
  startCleanupJob() {
    setInterval(() => {
      const now = Date.now();
      for (const [id, session] of this.activeSessions) {
        if (now - session.lastActivity > this.SESSION_TIMEOUT) {
          this.activeSessions.delete(id);
        }
      }
    }, 5 * 60 * 1000); // Har 5 min
  }
}
```

```bash
# Memory leak detect karne ke liye
node --inspect app.js
# Chrome DevTools: chrome://inspect → Memory → Heap Snapshot

# Production mein
node --max-old-space-size=4096 app.js  # 4GB heap
```

---

<a name="expressjs"></a>
## 🚂 SECTION 2: Express.js — Deep Dive

---

### Q4. Middleware chain kaise kaam karta hai? Custom error middleware banao slot game ke liye.

**Answer:**

```javascript
// Middleware execution order: Left to right, top to bottom
app.use(requestLogger)        // 1st
app.use(authenticate)         // 2nd
app.use(rateLimiter)          // 3rd
app.use('/api/slot', router)  // 4th — route match
// Error middleware — 4 params hone chahiye
app.use(globalErrorHandler)   // Last
```

```javascript
// === COMPLETE MIDDLEWARE SETUP FOR SLOT GAME ===

// 1. Request Logger Middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  req.requestId = crypto.randomUUID();
  
  res.on('finish', () => {
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      userId: req.user?.id
    }));
  });
  
  next();
};

// 2. JWT Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedError('Token missing');
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Token blacklist check (logout ke baad bhi valid nahi)
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) throw new UnauthorizedError('Token invalidated');
    
    req.user = payload;
    next();
  } catch (err) {
    next(err); // Error middleware ko pass karo
  }
};

// 3. Rate Limiter — Per user spin limit
const spinRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5,         // Max 5 spins per second
  keyGenerator: (req) => req.user.id, // Per user
  handler: (req, res) => {
    res.status(429).json({
      error: 'TOO_FAST',
      message: 'Itni jaldi spin mat karo!',
      retryAfter: 1
    });
  }
});

// 4. Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Expected errors
  }
}

class InsufficientBalanceError extends AppError {
  constructor(required, available) {
    super('Insufficient balance', 402, 'INSUFFICIENT_BALANCE');
    this.required = required;
    this.available = available;
  }
}

class UnauthorizedError extends AppError {
  constructor(msg) {
    super(msg, 401, 'UNAUTHORIZED');
  }
}

// 5. Global Error Handler — Express ka last middleware
const globalErrorHandler = (err, req, res, next) => {
  // Log karo
  logger.error({
    requestId: req.requestId,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    userId: req.user?.id
  });
  
  // Operational errors — client ko batao
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      ...(err instanceof InsufficientBalanceError && {
        required: err.required,
        available: err.available
      })
    });
  }
  
  // Programming errors — generic message
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Kuch gadbad ho gayi, thodi der baad try karo'
  });
  
  // Critical error — process restart karo
  if (!err.isOperational) {
    process.emit('uncaughtException', err);
  }
};

// App setup
const app = express();
app.use(express.json({ limit: '10kb' })); // Large payload attack prevent
app.use(requestLogger);
app.use('/api', authenticate);
app.use('/api/slot/spin', spinRateLimiter);
app.use('/api/slot', slotRouter);
app.use(globalErrorHandler); // LAST mein
```

---

### Q5. Express mein Request Validation kaise karte ho? Zod/Joi se production-grade validation dikhao.

**Answer:**

```javascript
const { z } = require('zod');

// Slot Spin Request Schema
const SpinRequestSchema = z.object({
  betAmount: z
    .number()
    .positive('Bet amount positive honi chahiye')
    .min(0.10, 'Minimum bet ₹0.10')
    .max(10000, 'Maximum bet ₹10,000')
    .multipleOf(0.01, '2 decimal places tak hi'),
  
  lines: z
    .number()
    .int()
    .min(1)
    .max(25)
    .default(20),
  
  gameId: z
    .string()
    .uuid('Valid game UUID chahiye'),
  
  clientSeed: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only')
    .optional()
});

// Validation Middleware Factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    
    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        received: issue.received
      }));
      
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        errors
      });
    }
    
    req[source] = result.data; // Sanitized data replace karo
    next();
  };
};

// Usage
router.post('/spin',
  validate(SpinRequestSchema),
  authenticate,
  spinRateLimiter,
  slotController.spin
);
```

---

<a name="slot-api"></a>
## 🎰 SECTION 3: Slot Game Backend API — Complete Implementation

---

### Q6. Slot Game ka Provably Fair RNG system kaise design karte hain?

**Answer:**

```javascript
// === PROVABLY FAIR SLOT GAME ENGINE ===
const crypto = require('crypto');

class ProvablyFairRNG {
  /**
   * Provably Fair = Player verify kar sake ki game fixed nahi thi
   * 
   * How it works:
   * 1. Server seed generate karta hai (hashed version dikhata hai)
   * 2. Player apna client seed provide karta hai
   * 3. Nonce (spin count) — replay attacks prevent karta hai
   * 4. Result = HMAC(serverSeed, clientSeed:nonce)
   */
  
  static generateServerSeed() {
    return crypto.randomBytes(32).toString('hex'); // 64 char hex
  }
  
  static hashServerSeed(serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  }
  
  static generateResult(serverSeed, clientSeed, nonce) {
    const hmac = crypto.createHmac('sha512', serverSeed);
    hmac.update(`${clientSeed}:${nonce}`);
    const hash = hmac.digest('hex');
    
    // Hash ko numbers mein convert karo
    const results = [];
    for (let i = 0; i < 5; i++) { // 5 reels
      const chunk = hash.substring(i * 8, (i + 1) * 8);
      const decimal = parseInt(chunk, 16);
      const symbolIndex = decimal % 10; // 10 symbols per reel
      results.push(symbolIndex);
    }
    
    return { hash, results };
  }
  
  // Verify karna — Player khud verify kar sakta hai
  static verify(serverSeed, clientSeed, nonce, expectedHash) {
    const { hash } = this.generateResult(serverSeed, clientSeed, nonce);
    return hash === expectedHash;
  }
}

// === PAYTABLE & RTP ENGINE ===
class SlotPaytableEngine {
  constructor(config) {
    // RTP = Return to Player (e.g., 96% = har ₹100 mein ₹96 wapas)
    this.targetRTP = config.targetRTP || 0.96;
    
    // Symbol weights (higher = more frequent = lower paying)
    this.symbols = {
      WILD:    { weight: 2,  multipliers: [0, 0, 50, 100, 500] },
      SCATTER: { weight: 3,  multipliers: [0, 2,  5,  20,  100] },
      SEVEN:   { weight: 5,  multipliers: [0, 0, 10,  50,  200] },
      CHERRY:  { weight: 10, multipliers: [0, 2,  5,  15,   50] },
      BAR:     { weight: 15, multipliers: [0, 0,  3,  10,   30] },
      LEMON:   { weight: 20, multipliers: [0, 0,  2,   5,   15] },
      ORANGE:  { weight: 25, multipliers: [0, 0,  2,   4,   10] },
      PLUM:    { weight: 20, multipliers: [0, 0,  1,   3,    8] },
    };
    
    this.reels = this.buildReelStrips();
    this.paylines = this.definePaylines();
  }
  
  buildReelStrips() {
    // Weight ke hisaab se reel strip banao
    const strip = [];
    for (const [symbol, config] of Object.entries(this.symbols)) {
      for (let i = 0; i < config.weight; i++) {
        strip.push(symbol);
      }
    }
    
    // 5 reels, har reel mein same strip shuffle karke
    return Array.from({ length: 5 }, () => 
      [...strip].sort(() => Math.random() - 0.5)
    );
  }
  
  definePaylines() {
    // 20 standard paylines (3x5 grid positions)
    return [
      [1, 1, 1, 1, 1], // Line 1: Middle row
      [0, 0, 0, 0, 0], // Line 2: Top row
      [2, 2, 2, 2, 2], // Line 3: Bottom row
      [0, 1, 2, 1, 0], // Line 4: V shape
      [2, 1, 0, 1, 2], // Line 5: Inverted V
      // ... 15 more lines
    ];
  }
  
  spin(reelPositions) {
    // reelPositions = [pos1, pos2, pos3, pos4, pos5] from RNG
    const grid = reelPositions.map((pos, reelIndex) => {
      const reel = this.reels[reelIndex];
      return [
        reel[pos % reel.length],
        reel[(pos + 1) % reel.length],
        reel[(pos + 2) % reel.length]
      ];
    });
    
    return this.calculateWins(grid);
  }
  
  calculateWins(grid) {
    let totalWin = 0;
    const winningLines = [];
    
    for (let lineIndex = 0; lineIndex < this.paylines.length; lineIndex++) {
      const payline = this.paylines[lineIndex];
      const lineSymbols = payline.map((row, reel) => grid[reel][row]);
      
      const win = this.evaluateLine(lineSymbols, lineIndex);
      if (win.amount > 0) {
        winningLines.push(win);
        totalWin += win.amount;
      }
    }
    
    // Scatter check (anywhere on grid)
    const scatterWin = this.checkScatters(grid);
    if (scatterWin.amount > 0) winningLines.push(scatterWin);
    
    return { grid, totalWin, winningLines };
  }
  
  evaluateLine(symbols, lineIndex) {
    let count = 1;
    const firstSymbol = symbols[0];
    
    // WILD substitute karta hai
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol || symbols[i] === 'WILD' || firstSymbol === 'WILD') {
        count++;
      } else break;
    }
    
    const multiplier = this.symbols[firstSymbol]?.multipliers[count] || 0;
    return {
      line: lineIndex,
      symbol: firstSymbol,
      count,
      amount: multiplier,
      positions: symbols
    };
  }
  
  checkScatters(grid) {
    let scatterCount = 0;
    grid.forEach(reel => reel.forEach(sym => {
      if (sym === 'SCATTER') scatterCount++;
    }));
    
    const multiplier = this.symbols.SCATTER.multipliers[scatterCount] || 0;
    return {
      type: 'SCATTER',
      count: scatterCount,
      amount: multiplier,
      freeSpins: scatterCount >= 3 ? (scatterCount - 2) * 5 : 0
    };
  }
}

// === SLOT GAME CONTROLLER ===
class SlotGameController {
  constructor({ rng, payTable, balanceService, auditLogger, redis }) {
    this.rng = rng;
    this.payTable = payTable;
    this.balanceService = balanceService;
    this.auditLogger = auditLogger;
    this.redis = redis;
  }
  
  async spin(req, res, next) {
    const { betAmount, lines, gameId, clientSeed } = req.body;
    const userId = req.user.id;
    
    // Distributed lock — ek baar mein ek hi spin!
    const lockKey = `spin_lock:${userId}`;
    const lockAcquired = await this.redis.set(
      lockKey, '1', 'NX', 'PX', 5000 // 5 second lock
    );
    
    if (!lockAcquired) {
      return next(new AppError('Spin already in progress', 409, 'SPIN_IN_PROGRESS'));
    }
    
    try {
      const totalBet = betAmount * lines;
      
      // 1. Balance check & deduct (atomic operation)
      const newBalance = await this.balanceService.deductWithLock(userId, totalBet);
      
      // 2. Get/create server seed for this session
      const { serverSeed, nonce } = await this.getSpinSeed(userId, gameId);
      
      // 3. Generate provably fair result
      const { hash, results: reelPositions } = ProvablyFairRNG.generateResult(
        serverSeed, 
        clientSeed || userId, 
        nonce
      );
      
      // 4. Calculate outcome
      const outcome = this.payTable.spin(reelPositions);
      const winAmount = outcome.totalWin * betAmount;
      
      // 5. Credit winnings
      if (winAmount > 0) {
        await this.balanceService.credit(userId, winAmount);
      }
      
      // 6. Record in DB & audit log
      const spinRecord = await this.saveSpinRecord({
        userId, gameId, betAmount, lines, totalBet,
        serverSeedHash: ProvablyFairRNG.hashServerSeed(serverSeed),
        clientSeed, nonce, hash,
        outcome, winAmount,
        balanceBefore: newBalance + totalBet,
        balanceAfter: newBalance + winAmount
      });
      
      // 7. Increment nonce for next spin
      await this.redis.incr(`nonce:${userId}:${gameId}`);
      
      // 8. Response
      res.json({
        spinId: spinRecord.id,
        grid: outcome.grid,
        winningLines: outcome.winningLines,
        winAmount,
        totalWin: outcome.totalWin,
        balance: newBalance + winAmount,
        freeSpins: outcome.winningLines.find(l => l.freeSpins)?.freeSpins || 0,
        provability: {
          serverSeedHash: ProvablyFairRNG.hashServerSeed(serverSeed),
          clientSeed,
          nonce,
          hash // Player verify kar sakta hai
        }
      });
      
    } catch (err) {
      next(err);
    } finally {
      await this.redis.del(lockKey); // Lock release karo
    }
  }
  
  async getSpinSeed(userId, gameId) {
    const seedKey = `server_seed:${userId}:${gameId}`;
    let serverSeed = await this.redis.get(seedKey);
    
    if (!serverSeed) {
      serverSeed = ProvablyFairRNG.generateServerSeed();
      await this.redis.set(seedKey, serverSeed);
    }
    
    const nonce = await this.redis.incr(`nonce:${userId}:${gameId}`);
    return { serverSeed, nonce };
  }
}
```

---

### Q7. Slot Game ka Balance Service kaise banate ho race condition avoid karke?

**Answer:**

```javascript
// ❌ Race condition — Do simultaneous spins balance negative kar sakti hain
async function badDeductBalance(userId, amount) {
  const user = await db.findUser(userId);
  if (user.balance < amount) throw new Error('Insufficient');
  
  // Gap yahan! Dono requests same balance read karte hain
  await db.updateUser(userId, { balance: user.balance - amount });
}

// ✅ Atomic operations with database-level locking
class BalanceService {
  
  // Option 1: PostgreSQL row-level lock
  async deductWithLock(userId, amount) {
    return await db.transaction(async (trx) => {
      // SELECT FOR UPDATE — row lock lagata hai
      const user = await trx('users')
        .where({ id: userId })
        .forUpdate() // 🔒 Lock!
        .first();
      
      if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      if (user.balance < amount) {
        throw new InsufficientBalanceError(amount, user.balance);
      }
      
      const [updated] = await trx('users')
        .where({ id: userId })
        .update({ 
          balance: trx.raw('balance - ?', [amount]),
          updated_at: new Date()
        })
        .returning('balance');
      
      // Transaction log
      await trx('balance_transactions').insert({
        user_id: userId,
        type: 'DEBIT',
        amount: -amount,
        balance_after: updated.balance,
        created_at: new Date()
      });
      
      return updated.balance;
    });
  }
  
  // Option 2: Redis Lua script — atomic operations
  async deductWithRedisLua(userId, amount) {
    const luaScript = `
      local balance = tonumber(redis.call('GET', KEYS[1]))
      local amount = tonumber(ARGV[1])
      
      if balance == nil then
        return redis.error_reply('USER_NOT_FOUND')
      end
      
      if balance < amount then
        return redis.error_reply('INSUFFICIENT_BALANCE')
      end
      
      local newBalance = balance - amount
      redis.call('SET', KEYS[1], newBalance)
      return newBalance
    `;
    
    try {
      const newBalance = await redis.eval(
        luaScript, 1, 
        `balance:${userId}`, 
        amount.toString()
      );
      return parseFloat(newBalance);
    } catch (err) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        throw new InsufficientBalanceError(amount, await this.getBalance(userId));
      }
      throw err;
    }
  }
  
  // Option 3: Optimistic locking with version
  async deductOptimistic(userId, amount) {
    const MAX_RETRIES = 3;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const user = await db('users').where({ id: userId }).first();
      
      if (user.balance < amount) {
        throw new InsufficientBalanceError(amount, user.balance);
      }
      
      const updated = await db('users')
        .where({ id: userId, version: user.version }) // Version check!
        .update({
          balance: user.balance - amount,
          version: user.version + 1
        });
      
      if (updated === 0) {
        // Koi aur update kar gaya — retry
        await sleep(10 * (attempt + 1)); // Exponential backoff
        continue;
      }
      
      return user.balance - amount;
    }
    
    throw new AppError('Concurrent update conflict', 409, 'CONFLICT');
  }
}
```

---

### Q8. WebSocket se Real-time Slot Game events kaise handle karte ho?

**Answer:**

```javascript
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class SlotGameSocketManager {
  constructor(server, redis) {
    this.io = new Server(server, {
      cors: { origin: process.env.ALLOWED_ORIGINS?.split(',') },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'] // WebSocket first, polling fallback
    });
    
    this.redis = redis;
    this.setupMiddleware();
    this.setupEvents();
  }
  
  setupMiddleware() {
    // Auth middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Active session check
        const activeSocket = await this.redis.get(`socket:${payload.id}`);
        if (activeSocket && activeSocket !== socket.id) {
          // Pehle wala socket disconnect karo
          this.io.to(activeSocket).emit('FORCE_DISCONNECT', {
            reason: 'Dusri jagah se login kiya'
          });
        }
        
        socket.userId = payload.id;
        socket.username = payload.username;
        next();
      } catch (err) {
        next(new Error('Authentication failed'));
      }
    });
  }
  
  setupEvents() {
    this.io.on('connection', async (socket) => {
      console.log(`Player connected: ${socket.userId}`);
      
      // Session register karo Redis mein
      await this.redis.setex(`socket:${socket.userId}`, 3600, socket.id);
      
      // Game room join karo
      socket.on('JOIN_GAME', async ({ gameId }) => {
        await this.handleJoinGame(socket, gameId);
      });
      
      // Spin event
      socket.on('SPIN', async (data) => {
        await this.handleSpin(socket, data);
      });
      
      // Disconnect cleanup
      socket.on('disconnect', async (reason) => {
        await this.handleDisconnect(socket, reason);
      });
      
      // Ping/pong latency measurement
      socket.on('PING', () => {
        socket.emit('PONG', { serverTime: Date.now() });
      });
    });
  }
  
  async handleSpin(socket, data) {
    const startTime = Date.now();
    
    try {
      // Emit "spinning" state immediately
      socket.emit('SPIN_STARTED', { 
        spinId: crypto.randomUUID(),
        timestamp: startTime
      });
      
      // Server-side spin execute karo
      const result = await slotController.executeSpin({
        userId: socket.userId,
        ...data
      });
      
      // Result emit karo
      socket.emit('SPIN_RESULT', {
        ...result,
        latency: Date.now() - startTime
      });
      
      // Big wins ko broadcast karo (optional)
      if (result.winAmount > result.betAmount * 100) {
        this.io.emit('BIG_WIN', {
          username: socket.username,
          winAmount: result.winAmount,
          gameName: data.gameId,
          timestamp: Date.now()
        });
      }
      
    } catch (err) {
      socket.emit('SPIN_ERROR', {
        error: err.errorCode || 'SPIN_FAILED',
        message: err.message
      });
    }
  }
  
  async handleDisconnect(socket, reason) {
    console.log(`${socket.userId} disconnected: ${reason}`);
    await this.redis.del(`socket:${socket.userId}`);
    
    // Pending bet cancel karo agar koi ho
    await this.cancelPendingBets(socket.userId);
  }
}
```

---

<a name="pixijs"></a>
## 🎮 SECTION 4: PixiJS — Frontend Game Engine

---

### Q9. PixiJS mein Slot Reel animation kaise banate ho? Complete implementation dikhao.

**Answer:**

```javascript
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

class SlotGameRenderer {
  constructor() {
    // PIXI Application setup
    this.app = new PIXI.Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x1a1a2e,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    document.getElementById('game-container').appendChild(this.app.view);
    
    this.reels = [];
    this.symbolTextures = {};
    this.isSpinning = false;
    
    this.init();
  }
  
  async init() {
    await this.loadAssets();
    this.createBackground();
    this.createReels();
    this.createUI();
    this.app.ticker.add(this.gameLoop.bind(this));
  }
  
  async loadAssets() {
    // Asset loading with progress
    const loader = PIXI.Assets;
    
    const assets = {
      WILD: '/assets/symbols/wild.png',
      SEVEN: '/assets/symbols/seven.png',
      CHERRY: '/assets/symbols/cherry.png',
      BAR: '/assets/symbols/bar.png',
      LEMON: '/assets/symbols/lemon.png',
      ORANGE: '/assets/symbols/orange.png',
      WILD_ANIM: '/assets/animations/wild_effect.json', // Spine/spritesheet
      WIN_EFFECT: '/assets/particles/win_burst.json'
    };
    
    for (const [key, url] of Object.entries(assets)) {
      this.symbolTextures[key] = await loader.load(url);
    }
    
    // Spritesheet load karo
    await PIXI.Assets.load('/assets/spritesheets/symbols.json');
  }
  
  createReels() {
    const REEL_COUNT = 5;
    const REEL_WIDTH = 180;
    const SYMBOL_HEIGHT = 160;
    const VISIBLE_SYMBOLS = 3;
    const START_X = 200;
    const START_Y = 100;
    
    for (let i = 0; i < REEL_COUNT; i++) {
      const reel = {
        container: new PIXI.Container(),
        symbols: [],
        position: 0,        // Current scroll position
        previousPosition: 0,
        blur: new PIXI.BlurFilter()
      };
      
      // Blur filter — spin ke time use hoga
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      reel.container.filters = [reel.blur];
      
      // Container position
      reel.container.x = START_X + i * (REEL_WIDTH + 10);
      reel.container.y = START_Y;
      
      // Mask — reel boundaries ke bahar symbols hide karo
      const mask = new PIXI.Graphics();
      mask.beginFill(0xffffff);
      mask.drawRect(0, 0, REEL_WIDTH, SYMBOL_HEIGHT * VISIBLE_SYMBOLS);
      mask.endFill();
      reel.container.mask = mask;
      reel.container.addChild(mask);
      
      // Create symbols (extra symbols for seamless scroll)
      for (let j = 0; j < VISIBLE_SYMBOLS + 3; j++) {
        const symbol = this.createSymbol(this.getRandomSymbol());
        symbol.y = j * SYMBOL_HEIGHT;
        reel.container.addChild(symbol);
        reel.symbols.push(symbol);
      }
      
      this.app.stage.addChild(reel.container);
      this.reels.push(reel);
    }
  }
  
  createSymbol(symbolName) {
    const container = new PIXI.Container();
    
    // Background tile
    const bg = new PIXI.Graphics();
    bg.beginFill(0x2d2d44);
    bg.lineStyle(2, 0x4a4a6a);
    bg.drawRoundedRect(0, 0, 175, 155, 10);
    bg.endFill();
    container.addChild(bg);
    
    // Symbol sprite
    const sprite = new PIXI.Sprite(this.symbolTextures[symbolName]);
    sprite.width = 120;
    sprite.height = 120;
    sprite.x = 27.5;
    sprite.y = 17.5;
    container.addChild(sprite);
    
    container.symbolName = symbolName;
    container.sprite = sprite;
    
    return container;
  }
  
  // GSAP se smooth spin animation
  async spin(serverResult) {
    if (this.isSpinning) return;
    this.isSpinning = true;
    
    const SPIN_DURATION = 0.8; // seconds per reel
    const REEL_DELAY = 0.15;   // stagger between reels
    
    // Spin start sound
    this.audioManager.play('reelSpin');
    
    const spinPromises = this.reels.map((reel, index) => {
      return new Promise((resolve) => {
        // Initial acceleration
        gsap.to(reel, {
          position: reel.position + 20, // Quick start
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            // Fast spinning
            gsap.to(reel, {
              position: reel.position + 50,
              duration: SPIN_DURATION + index * REEL_DELAY,
              ease: 'none',
              onComplete: () => {
                // Decelerate to final position
                this.stopReelAt(reel, index, serverResult[index], resolve);
              }
            });
          }
        });
      });
    });
    
    await Promise.all(spinPromises);
    
    // Winning animation
    if (serverResult.winAmount > 0) {
      await this.playWinAnimation(serverResult);
    }
    
    this.isSpinning = false;
  }
  
  stopReelAt(reel, reelIndex, targetSymbols, resolve) {
    // Target symbols set karo reel mein
    targetSymbols.forEach((symbolName, row) => {
      reel.symbols[row + 1].symbolName = symbolName;
      reel.symbols[row + 1].sprite.texture = this.symbolTextures[symbolName];
    });
    
    // Bounce effect — elastic ease
    gsap.to(reel, {
      position: Math.ceil(reel.position),
      duration: 0.4,
      ease: 'back.out(1.5)',
      onComplete: () => {
        this.audioManager.play('reelStop');
        resolve();
      }
    });
  }
  
  // Game loop — smooth position update
  gameLoop(delta) {
    for (const reel of this.reels) {
      reel.previousPosition = reel.position;
      
      // Symbol positions update karo
      for (let j = 0; j < reel.symbols.length; j++) {
        const symbol = reel.symbols[j];
        symbol.y = (reel.position + j) % reel.symbols.length * 160 - 160;
      }
      
      // Blur intensity — speed ke hisaab se
      const blur = (reel.position - reel.previousPosition) * 8;
      reel.blur.blurY = Math.min(Math.abs(blur), 20);
    }
  }
  
  async playWinAnimation(result) {
    for (const winLine of result.winningLines) {
      // Winning symbols highlight karo
      this.highlightWinLine(winLine);
      
      // Particle effect
      this.spawnWinParticles(result.winAmount);
      
      // Counter animation
      await this.animateWinCounter(result.winAmount);
    }
  }
  
  highlightWinLine(winLine) {
    // Winning symbols glow effect
    winLine.positions.forEach((row, reelIndex) => {
      const symbol = this.reels[reelIndex].symbols[row + 1];
      
      // Glow filter add karo
      const glow = new PIXI.GlowFilter({
        distance: 15,
        outerStrength: 3,
        color: 0xFFD700 // Gold
      });
      symbol.filters = [glow];
      
      // Scale animation
      gsap.to(symbol.scale, {
        x: 1.1, y: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 3
      });
      
      // Remove after animation
      setTimeout(() => {
        symbol.filters = [];
        symbol.scale.set(1);
      }, 2000);
    });
  }
  
  spawnWinParticles(winAmount) {
    // Win amount ke hisaab se particle intensity
    const particleCount = Math.min(Math.floor(winAmount / 10), 200);
    
    // PixiJS Particle Container — regular Container se 10x faster
    const particles = new PIXI.ParticleContainer(particleCount, {
      scale: true,
      position: true,
      rotation: true,
      alpha: true
    });
    
    this.app.stage.addChild(particles);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new PIXI.Sprite(PIXI.Texture.from('coin'));
      particle.x = this.app.screen.width / 2;
      particle.y = this.app.screen.height / 2;
      particle.anchor.set(0.5);
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed - 5;
      
      particles.addChild(particle);
    }
    
    // Particle animation loop
    const particleTicker = (delta) => {
      for (const particle of particles.children) {
        particle.x += particle.vx;
        particle.vy += 0.2; // Gravity
        particle.y += particle.vy;
        particle.rotation += 0.1;
        particle.alpha -= 0.01;
        
        if (particle.alpha <= 0) {
          particles.removeChild(particle);
        }
      }
      
      if (particles.children.length === 0) {
        this.app.ticker.remove(particleTicker);
        this.app.stage.removeChild(particles);
      }
    };
    
    this.app.ticker.add(particleTicker);
  }
}
```

---

### Q10. PixiJS Performance Optimization — Senior level tips

**Answer:**

```javascript
class PerformanceOptimizedSlot {
  
  // 1. Object Pooling — Garbage collection minimize karo
  setupObjectPool() {
    this.symbolPool = [];
    const POOL_SIZE = 50;
    
    for (let i = 0; i < POOL_SIZE; i++) {
      this.symbolPool.push(new PIXI.Sprite());
    }
  }
  
  getFromPool() {
    return this.symbolPool.pop() || new PIXI.Sprite();
  }
  
  returnToPool(sprite) {
    sprite.visible = false;
    sprite.filters = null;
    this.symbolPool.push(sprite);
  }
  
  // 2. Texture Atlas — HTTP requests minimize karo
  async loadTextureAtlas() {
    // Ek JSON file mein sab textures — single HTTP request!
    await PIXI.Assets.load('/assets/slot-atlas.json');
    
    // Individual textures atlas se access karo
    const wildTexture = PIXI.Texture.from('wild.png');
    const sevenTexture = PIXI.Texture.from('seven.png');
  }
  
  // 3. RenderTexture — Complex graphics cache karo
  cacheBackground() {
    const graphics = new PIXI.Graphics();
    // Complex background draw karo...
    
    // Render karo aur cache karo
    const renderTexture = PIXI.RenderTexture.create({
      width: 1280,
      height: 720,
      resolution: window.devicePixelRatio
    });
    
    this.app.renderer.render(graphics, { renderTexture });
    
    // Ab graphics ko destroy karo — texture use karo
    const bgSprite = new PIXI.Sprite(renderTexture);
    graphics.destroy();
    
    return bgSprite;
  }
  
  // 4. Culling — Visible objects hi render karo
  applyCulling() {
    const screenBounds = this.app.screen;
    
    this.app.ticker.add(() => {
      this.allSprites.forEach(sprite => {
        const bounds = sprite.getBounds();
        sprite.renderable = bounds.right > 0 && 
                           bounds.left < screenBounds.width &&
                           bounds.bottom > 0 && 
                           bounds.top < screenBounds.height;
      });
    });
  }
  
  // 5. Shared Geometry — Same shape ke liye memory share karo
  createOptimizedSymbols() {
    // Shared geometry for all symbol backgrounds
    const geometry = new PIXI.Geometry()
      .addAttribute('aVertexPosition', [-87.5, -77.5, 87.5, -77.5, 87.5, 77.5, -87.5, 77.5], 2)
      .addAttribute('aUvs', [0, 0, 1, 0, 1, 1, 0, 1], 2)
      .addIndex([0, 1, 2, 0, 2, 3]);
    
    // Har symbol ke liye same geometry reuse karo
    this.symbols = this.symbolNames.map(name => {
      const mesh = new PIXI.Mesh(geometry, new PIXI.MeshMaterial(
        PIXI.Texture.from(name)
      ));
      return mesh;
    });
  }
  
  // 6. Delta time — Frame rate independent animation
  gameLoop(delta) {
    // delta = actual time since last frame / 60fps time
    // 60fps pe delta = 1, 30fps pe delta = 2
    
    const SPEED = 5;
    this.reelPosition += SPEED * delta; // Frame rate independent!
  }
  
  // 7. Memory monitoring
  monitorMemory() {
    setInterval(() => {
      const renderer = this.app.renderer;
      const textureCount = Object.keys(PIXI.utils.BaseTextureCache).length;
      const gpuMemory = renderer.gl?.getExtension('WEBGL_memory_info');
      
      console.log({
        textures: textureCount,
        poolSize: this.symbolPool.length,
        gpuMemory: gpuMemory?.getCurrentAvailableVidMemSizeARB
      });
    }, 5000);
  }
}
```

---

<a name="architecture"></a>
## 🏗️ SECTION 5: Architecture & System Design

---

### Q11. 1 Million concurrent players ke liye Slot Game architecture design karo

**Answer:**

```
┌─────────────────── CLIENT LAYER ───────────────────┐
│  Web Browser (PixiJS)  │  Mobile App  │  Desktop   │
└────────────────────────┬───────────────────────────┘
                         │ HTTPS / WSS
┌────────────────────────▼───────────────────────────┐
│              CDN (CloudFront / Cloudflare)          │
│         Static assets, DDoS protection             │
└────────────────────────┬───────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────┐
│            Load Balancer (AWS ALB/NLB)              │
│         Round robin + health checks                │
└──────┬──────────┬──────────┬────────────┬──────────┘
       │          │          │            │
  ┌────▼──┐  ┌───▼───┐  ┌───▼───┐   ┌───▼───┐
  │ Game  │  │ Game  │  │ Game  │   │ Game  │
  │ Pod 1 │  │ Pod 2 │  │ Pod 3 │   │ Pod N │
  │(Node) │  │(Node) │  │(Node) │   │(Node) │
  └────┬──┘  └───┬───┘  └───┬───┘   └───┬───┘
       └──────────┴──────────┴───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌──────▼─────┐   ┌─────▼──────┐
   │  Redis  │    │ PostgreSQL │   │  Kafka/    │
   │ Cluster │    │  Primary  │   │  RabbitMQ  │
   │(Session │    │(Sharded)  │   │(Audit Log) │
   │Balance) │    └───────────┘   └────────────┘
   └─────────┘
```

```javascript
// Microservices breakdown:

const services = {
  'api-gateway': {
    responsibility: 'Auth, routing, rate limiting',
    tech: 'Express + Kong',
    instances: 10
  },
  
  'game-service': {
    responsibility: 'Spin logic, RNG, paytable',
    tech: 'Node.js + Worker Threads',
    instances: 50,
    scaling: 'Auto-scale based on active sessions'
  },
  
  'balance-service': {
    responsibility: 'Deposits, withdrawals, balance updates',
    tech: 'Node.js + PostgreSQL',
    instances: 20,
    critical: true, // High availability
    database: 'Read replicas + Write primary'
  },
  
  'session-service': {
    responsibility: 'WebSocket connections, player state',
    tech: 'Node.js + Socket.io + Redis',
    instances: 30,
    sticky_sessions: true // Same player same server
  },
  
  'notification-service': {
    responsibility: 'Big wins, bonuses, emails',
    tech: 'Node.js + Kafka consumer',
    instances: 5
  },
  
  'audit-service': {
    responsibility: 'Regulatory compliance, fraud detection',
    tech: 'Node.js + ClickHouse',
    instances: 10,
    retention: '7 years'
  }
};
```

---

### Q12. Database Design — Slot Game ka schema banao

**Answer:**

```sql
-- Users table
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  version     INTEGER NOT NULL DEFAULT 0,  -- Optimistic locking
  kyc_status  VARCHAR(20) DEFAULT 'PENDING',
  country     CHAR(2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast balance queries
CREATE INDEX idx_users_id ON users(id) WHERE balance > 0;

-- Spin records (partitioned by date — performance ke liye)
CREATE TABLE spin_records (
  id              UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  game_id         UUID NOT NULL,
  bet_amount      DECIMAL(10, 2) NOT NULL,
  lines_played    SMALLINT NOT NULL,
  total_bet       DECIMAL(10, 2) NOT NULL,
  win_amount      DECIMAL(10, 2) NOT NULL DEFAULT 0,
  grid            JSONB NOT NULL,
  winning_lines   JSONB,
  server_seed_hash CHAR(64) NOT NULL,
  client_seed     VARCHAR(64),
  nonce           INTEGER NOT NULL,
  result_hash     CHAR(128) NOT NULL,
  free_spin       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE spin_records_2024_01 
  PARTITION OF spin_records 
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Balance transactions (immutable audit log)
CREATE TABLE balance_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(20) NOT NULL, -- DEBIT, CREDIT, DEPOSIT, WITHDRAWAL
  amount          DECIMAL(15, 2) NOT NULL,
  balance_before  DECIMAL(15, 2) NOT NULL,
  balance_after   DECIMAL(15, 2) NOT NULL,
  reference_id    UUID,  -- spin_id, payment_id, etc.
  reference_type  VARCHAR(50),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Never update, only insert!
REVOKE UPDATE, DELETE ON balance_transactions FROM app_user;

-- Game definitions
CREATE TABLE games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  rtp         DECIMAL(5, 4) NOT NULL,  -- 0.9600 = 96%
  min_bet     DECIMAL(10, 2) NOT NULL,
  max_bet     DECIMAL(10, 2) NOT NULL,
  lines       SMALLINT NOT NULL,
  config      JSONB NOT NULL,  -- Paytable, reel strips
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

<a name="performance"></a>
## ⚡ SECTION 6: Performance & Optimization

---

### Q13. Caching strategy kya hogi Slot Game ke liye?

**Answer:**

```javascript
class CacheStrategy {
  constructor(redis) {
    this.redis = redis;
    this.localCache = new Map(); // L1: In-memory
    // Redis = L2: Distributed
    // DB = L3: Source of truth
  }
  
  // Cache-aside pattern
  async getGameConfig(gameId) {
    // L1: Local cache check
    if (this.localCache.has(gameId)) {
      return this.localCache.get(gameId);
    }
    
    // L2: Redis check
    const cached = await this.redis.get(`game:${gameId}`);
    if (cached) {
      const config = JSON.parse(cached);
      this.localCache.set(gameId, config);
      return config;
    }
    
    // L3: Database se fetch
    const config = await db('games').where({ id: gameId }).first();
    
    // Cache mein store karo
    await this.redis.setex(`game:${gameId}`, 3600, JSON.stringify(config));
    this.localCache.set(gameId, config);
    
    return config;
  }
  
  // Write-through cache for balance
  async updateBalance(userId, newBalance) {
    // DB aur Cache dono update karo atomically
    await Promise.all([
      db('users').where({ id: userId }).update({ balance: newBalance }),
      this.redis.set(`balance:${userId}`, newBalance.toString(), 'EX', 300)
    ]);
  }
  
  // Cache invalidation
  async invalidateUserCache(userId) {
    const keys = [
      `balance:${userId}`,
      `session:${userId}`,
      `spin_history:${userId}`
    ];
    
    await this.redis.del(...keys);
    this.localCache.delete(`user:${userId}`);
  }
  
  // TTL strategies
  cacheTTLs = {
    gameConfig: 3600,    // 1 hour — rarely changes
    userBalance: 5,      // 5 seconds — real-time critical
    leaderboard: 60,     // 1 minute
    rtpStats: 86400,     // 1 day
    activeSession: 1800  // 30 minutes
  };
}
```

---

<a name="security"></a>
## 🔒 SECTION 7: Security

---

### Q14. Slot Game mein kaise cheating prevent karte hain?

**Answer:**

```javascript
class SecurityMiddleware {
  
  // 1. Request signature verification
  verifyRequestSignature(req, res, next) {
    const { signature, timestamp, nonce } = req.headers;
    const body = JSON.stringify(req.body);
    
    // Timestamp check — 30 second window
    if (Math.abs(Date.now() - parseInt(timestamp)) > 30000) {
      return res.status(401).json({ error: 'REQUEST_EXPIRED' });
    }
    
    // Nonce replay attack prevention
    if (this.usedNonces.has(nonce)) {
      return res.status(401).json({ error: 'REPLAY_ATTACK' });
    }
    
    // Signature verify karo
    const expectedSig = crypto
      .createHmac('sha256', process.env.CLIENT_SECRET)
      .update(`${timestamp}:${nonce}:${body}`)
      .digest('hex');
    
    if (!crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    )) {
      return res.status(401).json({ error: 'INVALID_SIGNATURE' });
    }
    
    this.usedNonces.add(nonce);
    setTimeout(() => this.usedNonces.delete(nonce), 60000);
    next();
  }
  
  // 2. Bet manipulation detection
  async detectAnomalies(userId, betAmount, result) {
    const recentSpins = await redis.lrange(`spins:${userId}`, 0, 99);
    const parsed = recentSpins.map(JSON.parse);
    
    // Pattern 1: Sudden bet jump
    const avgBet = parsed.reduce((s, r) => s + r.bet, 0) / parsed.length;
    if (betAmount > avgBet * 10) {
      await this.flagForReview(userId, 'SUDDEN_BET_JUMP', { betAmount, avgBet });
    }
    
    // Pattern 2: Impossible win rate
    const winRate = parsed.filter(r => r.win > 0).length / parsed.length;
    if (winRate > 0.8 && parsed.length > 50) {
      await this.flagForReview(userId, 'ABNORMAL_WIN_RATE', { winRate });
    }
    
    // Pattern 3: Spin too fast (bot detection)
    if (parsed.length > 1) {
      const timeDiff = Date.now() - parsed[0].timestamp;
      if (timeDiff < 500) { // 500ms se kam
        await this.flagForReview(userId, 'BOT_SUSPECTED', { timeDiff });
      }
    }
  }
  
  // 3. Input sanitization
  sanitizeSpinRequest(req, res, next) {
    // SQL injection prevent karo
    const dangerousPattern = /[\'";\-\-\/\*]/g;
    
    if (req.body.clientSeed && dangerousPattern.test(req.body.clientSeed)) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }
    
    // Type coercion attack prevent
    if (typeof req.body.betAmount !== 'number') {
      return res.status(400).json({ error: 'INVALID_BET_TYPE' });
    }
    
    // Negative bet prevent
    if (req.body.betAmount <= 0) {
      return res.status(400).json({ error: 'NEGATIVE_BET' });
    }
    
    next();
  }
}
```

---

<a name="testing"></a>
## 🧪 SECTION 8: Testing

---

### Q15. Slot Game ke liye complete testing strategy batao

**Answer:**

```javascript
// === UNIT TESTS ===
describe('SlotPaytableEngine', () => {
  let engine;
  
  beforeEach(() => {
    engine = new SlotPaytableEngine({ targetRTP: 0.96 });
  });
  
  test('WILD should substitute for any symbol', () => {
    const grid = [
      ['WILD', 'SEVEN', 'SEVEN', 'SEVEN', 'SEVEN']
    ];
    const result = engine.evaluateLine(grid[0], 0);
    
    expect(result.symbol).toBe('SEVEN');
    expect(result.count).toBe(5);
    expect(result.amount).toBeGreaterThan(0);
  });
  
  test('Minimum 3 scatters should trigger free spins', () => {
    const grid = [
      ['SCATTER', 'LEMON', 'ORANGE'],
      ['CHERRY', 'SCATTER', 'BAR'],
      ['ORANGE', 'LEMON', 'SCATTER'],
      ['CHERRY', 'BAR', 'LEMON'],
      ['ORANGE', 'CHERRY', 'BAR']
    ];
    
    const result = engine.checkScatters(grid);
    expect(result.count).toBe(3);
    expect(result.freeSpins).toBe(5);
  });
  
  // RTP test — statistical test (1M spins)
  test('RTP should be within 1% of target after 1M spins', () => {
    const SPINS = 1_000_000;
    const BET = 1;
    let totalWin = 0;
    
    for (let i = 0; i < SPINS; i++) {
      const reelPos = Array.from({ length: 5 }, () => 
        Math.floor(Math.random() * 100)
      );
      const result = engine.spin(reelPos);
      totalWin += result.totalWin;
    }
    
    const actualRTP = totalWin / (SPINS * BET);
    expect(actualRTP).toBeCloseTo(0.96, 1); // ±0.01
  }, 30000); // 30 second timeout
});

// === INTEGRATION TESTS ===
describe('Spin API Integration', () => {
  let app, authToken;
  
  beforeAll(async () => {
    app = createTestApp();
    authToken = await loginTestUser();
  });
  
  test('Complete spin flow', async () => {
    // Deposit balance first
    await request(app)
      .post('/api/balance/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 100 });
    
    const response = await request(app)
      .post('/api/slot/spin')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        betAmount: 1,
        lines: 20,
        gameId: TEST_GAME_ID,
        clientSeed: 'testClientSeed123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      spinId: expect.any(String),
      grid: expect.arrayContaining([expect.arrayContaining([expect.any(String)])]),
      winAmount: expect.any(Number),
      balance: expect.any(Number),
      provability: {
        serverSeedHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        hash: expect.stringMatching(/^[a-f0-9]{128}$/)
      }
    });
  });
  
  test('Insufficient balance should return 402', async () => {
    const response = await request(app)
      .post('/api/slot/spin')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ betAmount: 99999, lines: 20, gameId: TEST_GAME_ID });
    
    expect(response.status).toBe(402);
    expect(response.body.error).toBe('INSUFFICIENT_BALANCE');
  });
  
  test('Concurrent spins should not cause race condition', async () => {
    // 10 simultaneous spin requests
    const promises = Array.from({ length: 10 }, () =>
      request(app)
        .post('/api/slot/spin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ betAmount: 0.10, lines: 1, gameId: TEST_GAME_ID })
    );
    
    const results = await Promise.all(promises);
    
    // Only one should succeed if balance is low
    const successes = results.filter(r => r.status === 200);
    const conflicts = results.filter(r => r.status === 409);
    
    expect(successes.length + conflicts.length).toBe(10);
    
    // Balance should never go negative
    const balance = await getTestUserBalance();
    expect(balance).toBeGreaterThanOrEqual(0);
  });
});

// === LOAD TESTING (Artillery) ===
// artillery.yml
const artilleryConfig = `
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10    # 10 users/second
      name: Warm up
    - duration: 300
      arrivalRate: 100   # 100 users/second
      name: Load test
    - duration: 60
      arrivalRate: 500   # Spike test
      name: Spike

scenarios:
  - name: Slot spin
    weight: 80
    flow:
      - post:
          url: /api/auth/login
          json:
            username: "testuser"
            password: "password"
          capture:
            json: "$.token"
            as: authToken
      - post:
          url: /api/slot/spin
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            betAmount: 1
            lines: 20
            gameId: "test-game-id"
          expect:
            - statusCode: 200
            - contentType: json
`;
```

---

<a name="devops"></a>
## 🚀 SECTION 9: DevOps & Deployment

---

### Q16. Docker + Kubernetes mein Slot Game deploy karo

**Answer:**

```dockerfile
# Dockerfile — Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app

# Package files pehle copy karo (cache layers)
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001

WORKDIR /app

# Security: Non-root user
COPY --from=builder --chown=nodeapp:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules

USER nodeapp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/app.js"]
```

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: slot-game-api
  labels:
    app: slot-game-api
spec:
  replicas: 10
  selector:
    matchLabels:
      app: slot-game-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # Upgrade ke time extra pods
      maxUnavailable: 0  # Zero downtime
  template:
    spec:
      containers:
        - name: slot-api
          image: slot-game-api:1.2.3
          ports:
            - containerPort: 3000
          
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          
          # Environment variables from secrets
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: slot-secrets
                  key: jwt-secret
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: slot-secrets
                  key: db-password
          
          # Liveness probe
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            failureThreshold: 3
          
          # Readiness probe
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: slot-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: slot-game-api
  minReplicas: 5
  maxReplicas: 100
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

<a name="scenarios"></a>
## 🎯 SECTION 10: Senior-Level Scenario Questions

---

### Q17. Production mein suddenly RTP drop ho gaya 96% se 80% — kya karoge?

**Answer:**

```javascript
// Incident Response Plan

// Step 1: Immediate — Detect & Alert
const rtpMonitor = {
  async checkRTP() {
    const last1000Spins = await db('spin_records')
      .select(db.raw('SUM(win_amount) / SUM(total_bet) as actual_rtp'))
      .where('created_at', '>', new Date(Date.now() - 3600000))
      .first();
    
    const actualRTP = parseFloat(last1000Spins.actual_rtp);
    const targetRTP = 0.96;
    const tolerance = 0.05; // 5% deviation allowed
    
    if (Math.abs(actualRTP - targetRTP) > tolerance) {
      // Alert!
      await pagerduty.trigger({
        severity: 'critical',
        summary: `RTP deviation detected: ${(actualRTP * 100).toFixed(2)}% vs target ${(targetRTP * 100).toFixed(2)}%`,
        details: { actualRTP, targetRTP, timestamp: new Date() }
      });
    }
  }
};

// Step 2: Investigation
async function investigateRTPDrop() {
  // 1. Game wise breakdown
  const byGame = await db('spin_records')
    .select('game_id')
    .select(db.raw('SUM(win_amount) / SUM(total_bet) as rtp'))
    .select(db.raw('COUNT(*) as spin_count'))
    .where('created_at', '>', new Date(Date.now() - 3600000))
    .groupBy('game_id')
    .orderBy('rtp');
  
  // 2. Specific game ka paytable check
  // 3. RNG seed pattern check — collision to nahi?
  // 4. Recent deployments check
  const recentDeploys = await deploymentLog.getRecent(24);
  
  // 5. Suspicious players check
  const suspiciousPlayers = await db('spin_records')
    .select('user_id')
    .select(db.raw('SUM(win_amount) / SUM(total_bet) as player_rtp'))
    .where('created_at', '>', new Date(Date.now() - 3600000))
    .groupBy('user_id')
    .having(db.raw('SUM(win_amount) / SUM(total_bet) > 0.99'))
    .orderBy('player_rtp', 'desc');
  
  return { byGame, recentDeploys, suspiciousPlayers };
}

// Step 3: Fix options
const fixes = {
  immediate: 'Affected game temporarily disable karo',
  short_term: 'Hotfix deploy karo — paytable fix',
  preventive: 'RTP monitoring dashboard + automated alerts',
  post_mortem: '48 hours mein RCA document'
};
```

---

### Q18. Ek player ka payment process hua lekin balance credit nahi hua — kaise fix karoge?

**Answer:**

```javascript
// Idempotency pattern — payment gateway se aaya webhook

class PaymentWebhookHandler {
  async handlePaymentSuccess(webhookData) {
    const { paymentId, userId, amount, timestamp } = webhookData;
    
    // Idempotency check — same payment do baar process mat karo!
    const existingTransaction = await db('payment_transactions')
      .where({ payment_id: paymentId })
      .first();
    
    if (existingTransaction) {
      console.log(`Duplicate webhook ignored: ${paymentId}`);
      return { status: 'ALREADY_PROCESSED' };
    }
    
    // Database transaction — atomic operation
    await db.transaction(async (trx) => {
      // 1. Payment record create karo
      await trx('payment_transactions').insert({
        id: crypto.randomUUID(),
        payment_id: paymentId,
        user_id: userId,
        amount,
        status: 'PROCESSING',
        raw_webhook: JSON.stringify(webhookData),
        created_at: new Date()
      });
      
      // 2. Balance credit karo
      const [user] = await trx('users')
        .where({ id: userId })
        .increment('balance', amount)
        .returning(['balance']);
      
      // 3. Balance transaction log
      await trx('balance_transactions').insert({
        user_id: userId,
        type: 'DEPOSIT',
        amount,
        balance_after: user.balance,
        reference_id: paymentId,
        reference_type: 'PAYMENT'
      });
      
      // 4. Payment record update karo
      await trx('payment_transactions')
        .where({ payment_id: paymentId })
        .update({ status: 'COMPLETED' });
    });
    
    // 5. Real-time notification
    await this.notifyUser(userId, {
      type: 'DEPOSIT_SUCCESS',
      amount,
      newBalance: await balanceService.getBalance(userId)
    });
    
    return { status: 'SUCCESS' };
  }
  
  // Reconciliation job — missed payments fix karo
  async reconcile() {
    // Payment gateway se transactions fetch karo
    const gatewayTransactions = await paymentGateway.getTransactions({
      from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'SUCCESS'
    });
    
    for (const gTx of gatewayTransactions) {
      const localTx = await db('payment_transactions')
        .where({ payment_id: gTx.id, status: 'COMPLETED' })
        .first();
      
      if (!localTx) {
        // Missed! Process karo
        console.error(`Reconciliation: Missing transaction ${gTx.id}`);
        await this.handlePaymentSuccess(gTx);
        await alertTeam(`Reconciled missing payment: ${gTx.id}`);
      }
    }
  }
}
```

---

## 📊 Quick Reference Cheat Sheet

| Topic | Senior Answer Points |
|-------|---------------------|
| Event Loop | 6 phases, Microtask priority, I/O non-blocking |
| Memory Leak | WeakMap/WeakSet, Event listener cleanup, Circular buffers |
| Race Condition | DB row lock, Redis Lua, Optimistic locking + retry |
| Scaling | Cluster, Worker Threads, Horizontal scaling, Load balancer |
| Security | JWT + blacklist, Rate limiting, Request signing, Idempotency |
| PixiJS Perf | Object pooling, Texture atlas, ParticleContainer, Culling |
| RNG | HMAC-SHA512, Provably fair, Server + Client seed |
| Database | Partitioning, Read replicas, Connection pooling |
| Caching | Multi-layer (L1/L2/L3), TTL strategy, Cache invalidation |
| Testing | Unit + Integration + Load testing, RTP statistical test |

---

> 💡 **Senior tip**: Interview mein sirf answer mat do — **trade-offs** bhi batao.  
> "Hum yeh approach use kar sakte hain, lekin iska downside yeh hai..."  
> Yahi senior engineer ko junior se alag karta hai! 🚀

---

*Last updated: 2025 | Stack: Node.js 20+, Express 4, PixiJS 7, PostgreSQL 15, Redis 7*