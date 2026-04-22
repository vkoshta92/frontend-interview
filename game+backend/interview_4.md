# 🎰 Casino Backend Engineer — Interview Prep
> PHP · MySQL · Redis · OOPs · DSA · Python · Linux
> ⏱ 2 ghante mein sab padh lo — Basic se Advanced

---

## 🐘 PHP — Core Concepts

### Q1. `==` vs `===` difference? *(Basic)*
- `==` — sirf value compare, type convert karta hai
- `===` — value **aur** type dono same hone chahiye

```php
"5" == 5    // true  (type juggling)
"5" === 5   // false (string vs int)
0 == false  // true
0 === false // false
```
> 💡 Casino mein **hamesha `===`** use karo — bet/money comparison mein type bug = disaster

---

### Q2. `include` vs `require` vs `require_once`? *(Basic)*
| | File nahi mili toh | Script chalegi? |
|---|---|---|
| `include` | Warning | Haan |
| `require` | Fatal Error | Nahi |
| `require_once` | Fatal Error | Nahi (+ ek baar hi load) |

> 💡 DB config ya core classes ke liye hamesha `require_once`

---

### Q3. Sessions vs Cookies? *(Basic)*
- **Session** — server pe store hoti hai, browser mein sirf session ID. Secure ✅
- **Cookie** — client (browser) pe store. User tamper kar sakta hai ❌

> 💡 Player balance, player_id hamesha **session** mein rakho

---

### Q4. Traits kya hote hain? *(Mid)*
Multiple classes mein same code share karna — PHP single inheritance ka workaround.

```php
trait Loggable {
    public function log($msg) {
        echo "[LOG] " . $msg;
    }
}

class GameEngine {
    use Loggable; // inject karo
}
```

---

### Q5. Magic Methods? *(Advanced)*
| Method | Kab call hota hai |
|---|---|
| `__construct` | Object bante waqt |
| `__destruct` | Object destroy hote waqt |
| `__get($name)` | Undefined property read pe |
| `__set($name, $val)` | Undefined property write pe |
| `__call($name, $args)` | Undefined method call pe |
| `__toString()` | Object ko string mein convert karte waqt |

---

### Q6. SQL Injection aur Prepared Statements? *(Advanced)*
```php
// VULNERABLE ❌
$q = "SELECT * FROM users WHERE id = " . $_GET['id'];

// SAFE ✅
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);
```
> 💡 Casino DB mein direct string concat = career khatam. Hamesha prepared statements!

---

### Q7. Memory Leak kaise rokein? *(Advanced)*
- Loop mein `unset($var)` karo large arrays ke baad
- DB result ke baad `$stmt->free_result()`
- Large datasets ke liye **Generators** (`yield`) use karo

```php
function getGameLogs() {
    $offset = 0;
    while ($rows = fetchBatch($offset)) {
        foreach ($rows as $row) yield $row;
        $offset += 1000;
    }
}
```

---

## 🗄️ MySQL — Database

### Q1. INNER JOIN vs LEFT JOIN vs RIGHT JOIN? *(Basic)*
- **INNER JOIN** — sirf matching rows dono tables mein
- **LEFT JOIN** — left ki saari rows + right ki matching (null agar match nahi)
- **RIGHT JOIN** — right ki saari rows + left ki matching

```sql
-- Saare players with bets (even if koi bet nahi ki)
SELECT p.name, b.amount
FROM players p
LEFT JOIN bets b ON p.id = b.player_id;
```

---

### Q2. Index kya hota hai? Types? *(Basic)*
Index = fast search ke liye internal data structure (book ke index jaisa).

| Type | Use Case |
|---|---|
| PRIMARY | Unique + Not Null (auto) |
| UNIQUE | Duplicate nahi allow |
| INDEX/KEY | Normal fast reads |
| FULLTEXT | Text search |
| COMPOSITE | Multiple columns pe |

> ⚠️ Zyada indexes = INSERT/UPDATE slow. Sirf WHERE, JOIN, ORDER BY columns pe lagao.

---

### Q3. ACID Properties? *(Mid — Casino mein CRITICAL)*
| Letter | Matlab | Casino Example |
|---|---|---|
| **A**tomicity | All or Nothing | Bet deduct hua, wager insert nahi — rollback ho |
| **C**onsistency | DB hamesha valid state mein | Balance negative nahi ho sakta |
| **I**solation | Concurrent transactions independent | 2 players ek saath same jackpot nahi le sakte |
| **D**urability | Committed data safe rehta hai | Server crash ke baad bhi bet record safe |

```sql
START TRANSACTION;
UPDATE wallets SET balance = balance - 100 WHERE player_id = 5;
INSERT INTO bets (player_id, amount) VALUES (5, 100);
COMMIT; -- ya ROLLBACK on error
```

---

### Q4. EXPLAIN kya hota hai? *(Advanced)*
```sql
EXPLAIN SELECT * FROM bets WHERE player_id = 5 AND status = 'won';
```
Dekho:
- `type: ALL` = full table scan = **BAD** 🔴
- `type: ref / range` = index use ho raha = **GOOD** 🟢
- `Extra: Using filesort` = optimize karo

> 💡 Slow query log: `SET slow_query_log = 1;`

---

### Q5. Deadlock kya hai? Kaise avoid karein? *(Advanced)*
Deadlock = 2 transactions ek dusre ke lock ka wait karein — infinite wait.

**Avoid karo:**
- Hamesha same order mein tables lock karo
- Transactions chhote rakho, jaldi COMMIT karo
- Application mein **retry logic** rakho

---

### Q6. InnoDB vs MyISAM? *(Advanced)*
| | InnoDB | MyISAM |
|---|---|---|
| Transactions | ✅ Yes | ❌ No |
| Row-level locking | ✅ Yes | ❌ Table-level |
| Foreign Keys | ✅ Yes | ❌ No |
| Crash Recovery | ✅ Yes | ❌ Limited |

> 💡 Casino ke liye **hamesha InnoDB** — transactions aur concurrent players ke liye must.

---

## ⚡ Redis — Cache & Message Broker

### Q1. Redis kya hai? MySQL se kaise alag? *(Basic)*
- Redis = **in-memory** key-value store — RAM mein, isliye microseconds fast
- MySQL = disk-based, relational, complex queries
- Redis use: caching, sessions, leaderboards, rate limiting, pub/sub

> 💡 Player session = Redis | Transaction history = MySQL

---

### Q2. Redis Data Structures? *(Basic)*
| Type | Command Example | Casino Use |
|---|---|---|
| String | `SET player:5:balance 1000` | Balance cache |
| Hash | `HSET player:5 name "Rahul"` | Player profile |
| List | `LPUSH, RPOP` | Job queue |
| Set | `SADD active_players 5` | Online players |
| **Sorted Set** | `ZADD leaderboard 5000 player:5` | **Leaderboard** ⭐ |

> 💡 Casino leaderboard = **Sorted Set (ZSET)** — real-time rankings ke liye perfect!

---

### Q3. Cache Invalidation Strategies? *(Mid)*
- **TTL** — `EXPIRE key 3600` — 1 ghante baad auto delete
- **Write-through** — DB update ke saath Redis bhi update karo
- **Cache-aside (Lazy Loading)** — miss pe DB se fetch, phir Redis mein daalo
- **Explicit delete** — update pe manually `DEL key`

```php
$balance = $redis->get("player:5:balance");
if (!$balance) {
    $balance = $db->query("SELECT balance FROM wallets WHERE id=5");
    $redis->setex("player:5:balance", 300, $balance); // 5 min TTL
}
```

---

### Q4. Pub/Sub kya hai? *(Advanced)*
Publisher channel pe message bhejta hai → saare Subscribers ko milta hai.

```php
// Publisher (Game Server)
$redis->publish('game:slot:result', json_encode(['player_id'=>5, 'win'=>500]));

// Subscriber (Notification Server)
$redis->subscribe(['game:slot:result'], function($msg) {
    sendPushNotification($msg);
});
```
> 💡 Casino use: real-time results, jackpot alerts, live notifications

---

### Q5. Race Condition — Redis mein kaise solve karein? *(Advanced)*
```php
// Lua Script — Atomic bet deduction
$redis->eval("
  local bal = tonumber(redis.call('GET', KEYS[1]))
  if bal >= tonumber(ARGV[1]) then
    redis.call('DECRBY', KEYS[1], ARGV[1])
    return 1
  end
  return 0
", ['player:5:balance', 100], 1);
```
> 💡 Lua script = atomic — casino bet deduction ke liye best approach!

---

## 🔷 OOPs — Object Oriented Programming

### Q1. OOP ke 4 Pillars? *(Basic)*

| Pillar | Matlab | Casino Example |
|---|---|---|
| **Encapsulation** | Data + methods ek class mein band | Player balance private, sirf deposit() se change ho |
| **Abstraction** | Complexity hide karo | spinSlot() call karo, RNG logic andar chhupo |
| **Inheritance** | Parent se properties lo | `SlotGame extends BaseGame` |
| **Polymorphism** | Same method naam, alag behavior | `SlotGame::play()` aur `PokerGame::play()` alag kaam karein |

---

### Q2. Abstract Class vs Interface? *(Basic)*
| | Abstract Class | Interface |
|---|---|---|
| Implementation | Partial de sakti hai | Sirf signatures |
| Inheritance | Single (ek hi extend) | Multiple implement ho sakti |
| Constructor | Haan | Nahi |

```php
interface Playable {
    public function play(): Result;
    public function cashOut(): float;
}

abstract class BaseGame implements Playable {
    protected function validateBet(float $amount): bool { ... }
}

class SlotGame extends BaseGame {
    public function play(): Result { ... } // must implement
}
```

---

### Q3. SOLID Principles? *(Advanced)*
| Letter | Principle | Example |
|---|---|---|
| **S** | Single Responsibility | `GameLogger` sirf log kare |
| **O** | Open/Closed | New game = new class, purani mat chhedo |
| **L** | Liskov Substitution | Child class parent ki jagah use ho sake |
| **I** | Interface Segregation | `Playable` aur `Streamable` alag rakho |
| **D** | Dependency Inversion | Interface pe depend karo, concrete class pe nahi |

---

### Q4. Design Patterns — Singleton, Factory, Observer *(Advanced)*

**Singleton** — ek hi instance (DB connection):
```php
class DB {
    private static $instance = null;
    private function __construct() {}
    public static function getInstance(): self {
        if (!self::$instance) self::$instance = new self();
        return self::$instance;
    }
}
```

**Factory** — object creation centralize karo:
```php
class GameFactory {
    public static function create(string $type): BaseGame {
        return match($type) {
            'slot'  => new SlotGame(),
            'poker' => new PokerGame(),
        };
    }
}
```

**Observer** — event pe notify karo (jackpot alert):
```php
class JackpotEvent {
    private array $observers = [];
    public function attach(Observer $o) { $this->observers[] = $o; }
    public function notify() { foreach($this->observers as $o) $o->update(); }
}
```

---

## 📐 DSA — Data Structures & Algorithms

### Q1. Array vs LinkedList vs HashMap? *(Basic)*
| | Search | Insert/Delete | Use Case |
|---|---|---|---|
| Array | O(1) by index | O(n) | Game history, ordered list |
| LinkedList | O(n) | O(1) | Undo queue, transaction log |
| HashMap | O(1) avg | O(1) avg | Session store, config lookup |

---

### Q2. Stack vs Queue? *(Basic)*
- **Stack (LIFO)** — Last In First Out → undo last bet, browser history
  - PHP: `array_push()` / `array_pop()`
- **Queue (FIFO)** — First In First Out → player waiting queue, job processing
  - PHP: `array_push()` / `array_shift()`

> 💡 Redis LIST = perfect Queue for async job processing

---

### Q3. Big O Notation? *(Mid)*
| Notation | Naam | Example |
|---|---|---|
| O(1) | Constant | Array[0], HashMap lookup |
| O(log n) | Logarithmic | Binary Search |
| O(n) | Linear | Single loop |
| O(n log n) | Log-linear | MergeSort, QuickSort |
| O(n²) | Quadratic | Nested loops — **AVOID!** |

> ⚠️ Casino real-time game mein O(n²) = lag = angry players = complaints

---

### Q4. Binary Search? *(Mid)*
Sorted array mein efficiently search — har baar half eliminate karo. Time: **O(log n)**

```php
function binarySearch(array $arr, int $target): int {
    $low = 0; $high = count($arr) - 1;
    while ($low <= $high) {
        $mid = intdiv($low + $high, 2);
        if ($arr[$mid] === $target) return $mid;
        elseif ($arr[$mid] < $target) $low = $mid + 1;
        else $high = $mid - 1;
    }
    return -1;
}
```

---

### Q5. Sliding Window — Rate Limiting? *(Advanced)*
```php
function isRateLimited(string $playerId, int $limit = 10): bool {
    $key = "ratelimit:{$playerId}";
    $now = microtime(true);
    $window = 60; // 1 minute

    $redis->zremrangebyscore($key, 0, $now - $window);
    $count = $redis->zcard($key);
    if ($count >= $limit) return true;

    $redis->zadd($key, $now, $now);
    $redis->expire($key, $window);
    return false;
}
```
> 💡 Player ko 1 minute mein max 10 bets — sliding window perfect!

---

## 🐍 Python — Scripting

### Q1. List vs Tuple vs Dict vs Set? *(Basic)*
| Type | Syntax | Mutable | Unique |
|---|---|---|---|
| List | `[1,2,3]` | ✅ | ❌ |
| Tuple | `(1,2,3)` | ❌ | ❌ |
| Dict | `{"a":1}` | ✅ | Keys unique |
| Set | `{1,2,3}` | ✅ | ✅ |

---

### Q2. Generators (`yield`)? *(Mid)*
Poora data memory mein nahi laata — ek-ek item deta hai.

```python
def game_log_stream(file_path):
    with open(file_path) as f:
        for line in f:
            yield line.strip()

for log in game_log_stream('casino.log'):
    process(log)
```
> 💡 10GB log file ke liye generators = low memory

---

### Q3. Decorators? *(Advanced)*
Function ke upar wrap karke extra behavior add karo.

```python
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time()-start:.3f}s")
        return result
    return wrapper

@timer
def process_bets(bets):
    pass
```

---

## 🐧 Linux — Server Commands

### Q1. Must-Know Commands? *(Basic)*
```bash
# Files
ls -la              # hidden files bhi dikhao
chmod 755 file      # permissions set karo
chown user file     # owner change karo

# Processes
ps aux              # saari processes
kill -9 PID         # force kill
top                 # live monitor

# Logs — casino mein sabse zyada kaam
tail -f /var/log/apache2/error.log   # live log stream
grep "ERROR" app.log | tail -100     # errors filter
grep -c "bet_placed" game.log        # count occurrences

# Disk & Memory
df -h               # disk space
free -m             # RAM usage
```

---

### Q2. Cron Job? *(Mid)*
```bash
crontab -e    # edit karo

# Format: min  hour  day  month  weekday  command

# Roz raat 11:59 pe daily report
59 23 * * * /usr/bin/php /var/www/casino/reports/daily.php

# Har 5 min jackpot check
*/5 * * * * /usr/bin/php /var/www/casino/jackpot/check.php

# Sunday 2 AM weekly cleanup
0 2 * * 0 /usr/bin/python3 /scripts/cleanup_old_sessions.py
```

---

### Q3. Debugging Tools? *(Advanced)*
```bash
# Port check
netstat -tlnp | grep :8080
lsof -i :3306           # MySQL port kaun use kar raha

# API test
curl -X POST https://api.casino.com/bet \
  -H "Content-Type: application/json" \
  -d '{"player_id":5,"amount":100}'

# Redis check
redis-cli ping          # PONG aana chahiye
redis-cli INFO memory   # memory stats
```

---

## 🏗️ System Design — Casino Specific

### Q1. 1000 Concurrent Players ke liye Architecture? *(Advanced)*
```
Browser / App
     ↓
Nginx Load Balancer
     ↓
PHP-FPM Workers (multiple)
     ↓          ↓
  Redis       MySQL
(sessions,   (Master → Slave)
 cache,       writes → master
 queue)       reads  → slave
     ↓
WebSocket Server (real-time results push)
```

**Flow:** Bet Request → Validate (Redis) → Queue → Process → DB Update → Push Result

---

### Q2. Double-Spend Problem — Wallet? *(Advanced)*
```sql
-- Optimistic Locking
UPDATE wallets
SET balance = balance - 100, version = version + 1
WHERE player_id = 5
  AND balance >= 100
  AND version = 7;  -- current version check

-- Affected rows = 0 mane conflict → retry karo!
```

---

### Q3. DB Slow hai Production mein — Debug Steps? *(Advanced)*
```
1. SHOW PROCESSLIST;          → koi query hang hai?
2. Slow query log check karo  → mysqldumpslow -s t slow.log
3. EXPLAIN lagao slow query pe → full scan hai?
4. Missing index add karo
5. Redis caching add karo frequently read data pe
6. SELECT * → sirf needed columns select karo
7. Connection pool check → max_connections hit?
```

---

## 🚀 Last Minute Tips

- ✅ **Casino context** mein answers do — bet, wallet, leaderboard example zaroor dena
- ✅ **Security** mention karo — SQL injection, prepared statements, session security
- ✅ **ACID + Transactions** confidently explain karo — casino ka sabse critical topic
- ✅ **Redis** ke use cases batao — caching, pub/sub, rate limiting, leaderboard
- ✅ **Design Patterns** ek real example ke saath batao — Singleton (DB), Factory (Game), Observer (Jackpot)
- ✅ Kuch nahi pata toh honestly kaho + thought process explain karo — interviewers yahi chahte hain

---

> 🎯 **Bhai tu prepared hai. Jaa aur crack kar! All the best! 🔥**