# 🎮 Backend Game Developer Interview Prep (Node.js + Express + MongoDB + SQL)

---

# 🧠 1. JavaScript Fundamentals (Must Clear Basics)

## Q1: var, let, const difference?

* var → function scoped
* let/const → block scoped

```js
{
  let a = 10;
}
// console.log(a) ❌ error
```

---

## Q2: Event Loop kya hota hai?

👉 JS single-threaded hai but async handle karta hai via:

* Call Stack
* Callback Queue
* Event Loop

```js
console.log("start");

setTimeout(() => console.log("timeout"), 0);

console.log("end");

// Output:
// start
// end
// timeout
```

---

# ⚙️ 2. Node.js Core

## Q3: Node.js blocking vs non-blocking?

```js
// blocking
const data = fs.readFileSync("file.txt");

// non-blocking
fs.readFile("file.txt", (err, data) => {});
```

---

## Q4: Streams kya hote hain?

```js
const stream = fs.createReadStream("file.txt");

stream.on("data", chunk => {
  console.log(chunk);
});
```

---

# 🚀 3. Express.js (API Design)

## Q5: Middleware kya hota hai?

```js
app.use((req, res, next) => {
  console.log("Request aayi");
  next();
});
```

---

## Q6: REST API best practices

* Proper status codes
* Validation
* Error handling

```js
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("Not found");
    res.json(user);
  } catch (e) {
    res.status(500).send("Server error");
  }
});
```

---

# 🗄️ 4. Database (MongoDB + SQL)

## Q7: MongoDB vs SQL?

| MongoDB         | SQL                |
| --------------- | ------------------ |
| NoSQL           | Relational         |
| Flexible schema | Fixed schema       |
| Fast reads      | Strong consistency |

---

## Q8: Indexing kya hota hai?

```js
db.users.createIndex({ email: 1 });
```

👉 Query fast hoti hai

---

## Q9: SQL Transactions (VERY IMPORTANT 🔥)

```sql
START TRANSACTION;

UPDATE users SET balance = balance - 100 WHERE id = 1;
UPDATE wallet SET amount = amount + 100 WHERE user_id = 2;

COMMIT;
```

---

# 🧱 5. System Design (Game Backend)

## Q10: Real-time game kaise design karoge?

👉 Components:

* API Server (Node.js)
* WebSocket server
* Redis (state + pub/sub)
* DB (Mongo + SQL)

Flow:

1. Player joins
2. Game state Redis me
3. Updates via WebSocket

---

# 🔴 6. Redis (VERY IMPORTANT)

## Q11: Redis kyu use karte hain?

* Caching
* Leaderboard
* Pub/Sub

```js
await redis.set("game:1", JSON.stringify(game));
```

---

## Q12: Leaderboard kaise banega?

```js
await redis.zAdd("leaderboard", [
  { score: 500, value: "user1" }
]);
```

---

# 🔌 7. WebSockets (Real-time 🔥)

```js
io.on("connection", socket => {
  socket.on("join", gameId => {
    socket.join(gameId);
  });

  socket.on("move", data => {
    io.to(data.gameId).emit("update", data);
  });
});
```

---

# 🧮 8. DSA (Game Logic)

## Q13: Fast lookup kaise karoge?

👉 Use HashMap

```js
const players = new Map();
players.set("id1", { score: 100 });
```

---

## Q14: Queue (Turn-based game)

```js
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(x) { this.items.push(x); }
  dequeue() { return this.items.shift(); }
}
```

---

# 🔐 9. Security

## Q15: JWT Authentication

```js
const token = jwt.sign({ id: user._id }, "secret");
```

---

## Q16: SQL Injection kaise rokoge?

❌ Wrong:

```js
"SELECT * FROM users WHERE email = '" + email + "'"
```

✅ Correct:

```js
db.query("SELECT * FROM users WHERE email = ?", [email]);
```

---

# ⚡ 10. Performance Optimization

## Q17: Slow API kaise optimize karoge?

* Caching (Redis)
* DB indexing
* Avoid N+1 queries

---

# 🐞 11. Debugging & Production

## Q18: Production issue kaise handle karte ho?

* Logs (Winston)
* PM2 monitoring
* Error tracking

---

# 🐧 12. Linux Basics

```bash
ps aux
top
pm2 start app.js
```

---

# 🧠 13. Advanced (Senior Level 🔥🔥🔥)

## Q19: 10K concurrent users handle kaise karoge?

* Load balancer
* Horizontal scaling
* Redis caching

---

## Q20: Data consistency kaise maintain karoge?

* Transactions
* Locks
* Event queues

---

## Q21: Real-time game me cheating kaise rokoge?

* Server-side validation
* No client trust
* Secure APIs

---

# 🎯 14. MUST KNOW (Interview Crack Points)

* Redis (VERY IMPORTANT)
* WebSockets
* Transactions
* System design
* DSA

---

# 🏁 FINAL TIP

Agar tu ye sab confidently explain kar diya:
👉 Tu easily **Senior Backend Developer (Game Dev)** crack kar lega

---
