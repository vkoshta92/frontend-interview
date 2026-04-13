# 🚀 JavaScript Interview Guide — Basic se Advanced tak
### Hinglish mein — Samjho, Yaad Karo, Interview Pass Karo!

---

## 📌 Table of Contents

1. [Level 1 — Bilkul Basic (Fresher)](#level-1--bilkul-basic)
2. [Level 2 — Thoda Aur (1-2 Years)](#level-2--thoda-aur)
3. [Level 3 — Mid Level (3-5 Years)](#level-3--mid-level)
4. [Level 4 — Senior Level (5-8 Years)](#level-4--senior-level)
5. [Level 5 — Principal/Staff Engineer (8-10+ Years)](#level-5--principalstaff-engineer)

---

# Level 1 — Bilkul Basic
> *Fresher ya 0-1 year experience wale ke liye*

---

## Q1: JavaScript kya hai? Aur yeh kahan use hoti hai?

**Answer (Hinglish):**

JavaScript ek **programming language** hai jo webpages ko **interactive** banati hai. HTML structure banata hai, CSS sundar dikhata hai, JavaScript **zindagi deta hai** — buttons kaam karte hain, forms validate hote hain, animations chalti hain.

```javascript
// Yeh dekho — simple example
let name = "Rahul";
console.log("Hello, " + name); // Hello, Rahul

// Variables ke 3 tarike
var   oldWay   = "purana tarika";   // avoid karo
let   canChange = "badal sakta hai"; // use karo
const fixed     = "nahi badlega";   // use karo

// Data Types
let number  = 42;           // Number
let text    = "Hello";      // String
let bool    = true;         // Boolean
let nothing = null;         // Null (intentionally empty)
let undef   = undefined;    // Undefined (value assign nahi hua)
let obj     = { name: "Rahul", age: 25 }; // Object
let arr     = [1, 2, 3, 4]; // Array
```

---

## Q2: `var`, `let`, `const` mein kya difference hai?

```javascript
// VAR — function scoped, hoisted (purana, avoid karo)
function example() {
  if (true) {
    var x = 10; // puri function mein available
  }
  console.log(x); // 10 — leakage ho gayi!
}

// LET — block scoped (modern, use karo)
function example2() {
  if (true) {
    let y = 20; // sirf is block mein
  }
  console.log(y); // ❌ ReferenceError — bahar nahi milega
}

// CONST — block scoped + reassign nahi ho sakta
const PI = 3.14;
PI = 3.15; // ❌ TypeError

// TRICK: const se object ke andar values badal sakte ho!
const person = { name: "Rahul" };
person.name = "Amit"; // ✅ Yeh kaam karta hai
person = {};          // ❌ Yeh nahi karta
```

**Interview mein bolna:**
> "var function-scoped hai aur hoisted hota hai, isliye bugs aate hain. let aur const block-scoped hain — let reassign ho sakta hai, const nahi."

---

## Q3: `==` aur `===` mein kya fark hai?

```javascript
// == (loose equality) — type convert karta hai
5 == "5"     // true  ← string ko number bana diya
0 == false   // true  ← false ko 0 bana diya
null == undefined // true

// === (strict equality) — type bhi check karta hai
5 === "5"    // false ← alag type hai
0 === false  // false
null === undefined // false

// Interview tip: ALWAYS === use karo!
```

---

## Q4: Functions kaise likhte hain?

```javascript
// 1. Function Declaration (hoisted hota hai)
function greet(name) {
  return "Hello, " + name;
}
greet("Rahul"); // "Hello, Rahul"

// 2. Function Expression (hoisted nahi hota)
const greet2 = function(name) {
  return "Hello, " + name;
};

// 3. Arrow Function (modern, concise)
const greet3 = (name) => "Hello, " + name;

// Short form — single parameter, single line
const double = n => n * 2;
double(5); // 10

// Multiple lines
const add = (a, b) => {
  const sum = a + b;
  return sum;
};

// Default Parameters
function greetUser(name = "Guest") {
  return `Hello, ${name}!`; // Template literal
}
greetUser();        // "Hello, Guest!"
greetUser("Priya"); // "Hello, Priya!"
```

---

## Q5: Arrays ke important methods

```javascript
const nums = [1, 2, 3, 4, 5];

// map — har element pe kuch karo, naya array milega
const doubled = nums.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter — condition ke hisaab se filter karo
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]

// reduce — sab kuch ek value mein compress karo
const sum = nums.reduce((total, n) => total + n, 0);
// 15

// find — pehla matching element
const found = nums.find(n => n > 3);
// 4

// some — koi ek match karta hai?
const hasEven = nums.some(n => n % 2 === 0); // true

// every — sab match karte hain?
const allPositive = nums.every(n => n > 0); // true

// includes — element hai?
nums.includes(3); // true

// forEach — loop (return nahi karta)
nums.forEach(n => console.log(n));

// IMPORTANT: map/filter/reduce original array nahi badlate!
```

---

## Q6: Objects kaise kaam karte hain?

```javascript
// Object banana
const student = {
  name: "Rahul",
  age: 22,
  marks: [85, 90, 78],
  address: {
    city: "Mumbai",
    state: "Maharashtra"
  },
  // Method
  greet() {
    return `Hi, I'm ${this.name}`; // this = khud object
  }
};

// Access karna
student.name;         // "Rahul" — dot notation
student["age"];       // 22 — bracket notation
student.address.city; // "Mumbai" — nested

// Destructuring — seedha variables mein nikalo
const { name, age, address: { city } } = student;
console.log(name, age, city); // Rahul 22 Mumbai

// Spread operator — copy ya merge
const updated = { ...student, age: 23 }; // age update ho gayi

// Object methods
Object.keys(student);   // ["name", "age", "marks", "address", "greet"]
Object.values(student); // values array
Object.entries(student);// [["name", "Rahul"], ["age", 22], ...]
```

---

# Level 2 — Thoda Aur
> *1-2 years experience — Callbacks, Promises, DOM*

---

## Q7: Callback function kya hoti hai? Callback Hell kya hai?

```javascript
// Callback — ek function jo doosre function ko argument mein dete hain
function fetchData(url, onSuccess, onError) {
  // Kaam karo...
  if (success) onSuccess(data);
  else onError(error);
}

// ❌ CALLBACK HELL — jab nested callbacks ki ladder ban jaaye
getUser(userId, function(user) {
  getOrders(user.id, function(orders) {
    getOrderDetails(orders[0].id, function(details) {
      getPayment(details.paymentId, function(payment) {
        // Yahan tak aate aate code unreadable ho jaata hai!
        // Yahi hai "Pyramid of Doom"
      });
    });
  });
});

// ✅ Solution: Promises use karo (agle question mein)
```

---

## Q8: Promises kya hain? `.then()`, `.catch()`, `.finally()`

```javascript
// Promise ek "vaada" hai — future mein value milegi
// 3 states: pending, fulfilled, rejected

// Promise banana
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Data mil gaya!");
  else reject("Error aa gaya!");
});

// Promise consume karna
myPromise
  .then(data => console.log(data))     // "Data mil gaya!"
  .catch(err => console.log(err))      // error handle
  .finally(() => console.log("Done")); // hamesha chalta hai

// Real example — fetch API
fetch("https://api.example.com/users")
  .then(response => response.json())   // Response ko JSON banao
  .then(users => console.log(users))   // Data use karo
  .catch(error => console.error(error));

// Promise.all — sab ek saath chalao
Promise.all([
  fetch("/api/users"),
  fetch("/api/products"),
  fetch("/api/orders")
]).then(([users, products, orders]) => {
  // Teeno ke results ek saath
});

// Promise.race — jo pehle complete ho
Promise.race([slowFetch(), fastFetch()])
  .then(result => console.log("Winner:", result));
```

---

## Q9: Async/Await — Promise ka sundar tarika

```javascript
// async/await Promise ke upar hi kaam karta hai — sirf syntax better hai

// ❌ Promise chain (thenable)
function getUser() {
  return fetch("/api/user")
    .then(r => r.json())
    .then(user => {
      return fetch(`/api/posts/${user.id}`)
        .then(r => r.json());
    });
}

// ✅ Async/Await (padhne mein seedha lagta hai)
async function getUser() {
  try {
    const response = await fetch("/api/user"); // ruko yahan tak
    const user = await response.json();

    const postsRes = await fetch(`/api/posts/${user.id}`);
    const posts = await postsRes.json();

    return { user, posts };
  } catch (error) {
    console.error("Kuch galat hua:", error);
  } finally {
    console.log("Request complete");
  }
}

// ❌ Common Mistake — sequential jab parallel ho sakta tha
async function slow() {
  const a = await fetchA(); // 1 second wait
  const b = await fetchB(); // 1 second wait
  // Total: 2 seconds — waste!
}

// ✅ Sahi tarika — parallel chalao
async function fast() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]);
  // Total: 1 second — ek saath!
}
```

---

## Q10: DOM Manipulation — HTML ko JavaScript se control karo

```javascript
// Element select karna
const btn = document.getElementById("myBtn");
const title = document.querySelector(".title");     // first match
const items = document.querySelectorAll(".item");   // sab items

// Content change karna
title.textContent = "Naya Title";  // ✅ Safe (no HTML)
title.innerHTML = "<b>Bold</b>";   // ⚠️ XSS risk

// Style change karna
btn.style.backgroundColor = "blue";
btn.classList.add("active");
btn.classList.remove("disabled");
btn.classList.toggle("hidden");

// Event Listeners
btn.addEventListener("click", function(event) {
  console.log("Button dabaya!", event.target);
  event.preventDefault(); // default action rokna (form submit, link)
  event.stopPropagation(); // bubbling rokna
});

// Naya element banana
const div = document.createElement("div");
div.textContent = "Naya div";
div.className = "card";
document.body.appendChild(div);

// Element remove karna
div.remove();
// ya
div.parentNode.removeChild(div);

// Event Delegation — parent pe listener, children handle karo
document.querySelector("#list").addEventListener("click", (e) => {
  if (e.target.matches(".item")) {
    console.log("Item clicked:", e.target.textContent);
  }
});
```

---

# Level 3 — Mid Level
> *3-5 years — Closures, Prototype, Event Loop, this*

---

## Q11: Closure kya hota hai? (Bohot important question!)

```javascript
// Closure = function + uska outer scope ka access
// Jab ek function apne outer function ke variables yaad rakhta hai
// even after outer function return ho gayi

function counter() {
  let count = 0; // yeh variable band ho jaata hai closure mein

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const myCounter = counter(); // counter() return ho gayi
myCounter.increment(); // 1
myCounter.increment(); // 2
myCounter.decrement(); // 1
myCounter.getCount();  // 1
// count variable directly access nahi ho sakta — private hai!

// Real use case: Data encapsulation
function createBankAccount(initialBalance) {
  let balance = initialBalance; // PRIVATE!

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds!";
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(1000);
account.deposit(500);    // 1500
account.withdraw(200);   // 1300
account.balance;         // undefined — directly access nahi hoga!

// ❌ Classic closure bug (var ke saath)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (sab 3 print karte hain!)

// ✅ Fix — let use karo
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
```

---

## Q12: `this` keyword — Sabse confusing concept!

```javascript
// `this` ka value depend karta hai KI KON CALL KAR RAHA HAI

// 1. Global context
console.log(this); // Browser mein: Window object

// 2. Object method
const obj = {
  name: "Rahul",
  greet() {
    return this.name; // this = obj
  }
};
obj.greet(); // "Rahul"

// 3. Regular function — this kho jaata hai
const obj2 = {
  name: "Rahul",
  greet() {
    function inner() {
      return this.name; // this = undefined (strict mode) ya Window
    }
    return inner();
  }
};
obj2.greet(); // undefined ❌

// ✅ Fix — Arrow function use karo
const obj3 = {
  name: "Rahul",
  greet() {
    const inner = () => this.name; // arrow function lexical this leta hai
    return inner();
  }
};
obj3.greet(); // "Rahul" ✅

// 4. call, apply, bind — this manually set karo
function introduce(city, country) {
  return `${this.name} from ${city}, ${country}`;
}
const person = { name: "Priya" };

introduce.call(person, "Mumbai", "India");     // Priya from Mumbai, India
introduce.apply(person, ["Mumbai", "India"]);  // same, array mein args
const boundFn = introduce.bind(person);        // naya function return karta hai
boundFn("Delhi", "India");                     // Priya from Delhi, India

// 5. Constructor
function Person(name) {
  this.name = name; // this = naya object
}
const p = new Person("Amit");
p.name; // "Amit"
```

---

## Q13: Event Loop — JavaScript ka dil

```javascript
// JavaScript SINGLE THREADED hai — ek time pe ek kaam
// Lekin async kaam kaise hota hai? Event Loop se!

// Call Stack — synchronous code yahan execute hota hai
// Web APIs — browser ke async kaam (setTimeout, fetch)
// Task Queue (Macrotask) — setTimeout, setInterval, I/O
// Microtask Queue — Promises, queueMicrotask
// Rule: Microtasks PEHLE, phir Macrotasks

console.log("1 — Sync");

setTimeout(() => console.log("2 — Macrotask"), 0);

Promise.resolve().then(() => console.log("3 — Microtask"));

console.log("4 — Sync");

// Output order:
// 1 — Sync
// 4 — Sync
// 3 — Microtask   ← Promise pehle!
// 2 — Macrotask   ← setTimeout baad mein!

// WHY? Kyunki:
// 1. Sync code pehle: 1, 4
// 2. Microtask queue drain hoti hai: 3
// 3. Macrotask queue se ek kaam: 2

// Advanced example
async function main() {
  console.log("A");
  await Promise.resolve(); // yahan suspend
  console.log("B");        // microtask
}

main();
console.log("C");

// Output: A, C, B
```

---

## Q14: Prototype aur Prototype Chain

```javascript
// Har JavaScript object ka ek prototype hota hai
// Jab property nahi milti, JS prototype chain mein dhundhti hai

const animal = {
  breathe() { return `${this.name} breathes`; }
};

const dog = Object.create(animal); // dog ka prototype = animal
dog.name = "Rex";
dog.bark = function() { return `${this.name} says Woof!`; };

dog.bark();    // Rex says Woof! (khud ka method)
dog.breathe(); // Rex breathes (prototype se mila)

// Chain: dog → animal → Object.prototype → null

// Class syntax (modern, same thing andar se)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);         // Parent constructor call
    this.breed = breed;
  }
  bark() { return `${this.name} barks! Breed: ${this.breed}`; }
}

const rex = new Dog("Rex", "Labrador");
rex.bark();    // Rex barks! Breed: Labrador
rex.speak();   // Rex makes a sound (inherited)
rex instanceof Dog;    // true
rex instanceof Animal; // true

// Prototype methods check
rex.hasOwnProperty("name");  // true — khud ka
rex.hasOwnProperty("speak"); // false — prototype ka
```

---

## Q15: Spread, Rest, Destructuring

```javascript
// SPREAD — array/object failao
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1,2,3,4,5,6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // {a:1, b:2, c:3, d:4}

// Shallow copy
const copy = [...arr1]; // [1,2,3] — naya array
const objCopy = { ...obj1 }; // {a:1, b:2} — naya object

// REST — baaki sab ek mein
function sum(...numbers) {      // rest parameter
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5); // 15

// Array Destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first=10, second=20, rest=[30,40,50]

// Object Destructuring
const { name, age = 25, address: { city } } = user;
// name, age (default 25 agar nahi hai), city (nested)

// Rename karna
const { name: userName, age: userAge } = user;

// Function params mein
function display({ name, age, role = "user" }) {
  return `${name}, ${age}, ${role}`;
}
```

---

# Level 4 — Senior Level
> *5-8 years — Design Patterns, Performance, Advanced Async*

---

## Q16: Debounce aur Throttle — Performance optimization

```javascript
// DEBOUNCE — "Ruko, user type kar raha hai"
// Last call ke baad N milliseconds wait karo, tab execute karo
// Use case: Search input, form validation

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);            // Pichla timer cancel karo
    timer = setTimeout(() => {
      fn.apply(this, args);         // Delay ke baad execute karo
    }, delay);
  };
}

const searchHandler = debounce((query) => {
  console.log("Searching for:", query);
  fetchResults(query);
}, 300);

// User type karta raha... sirf last keystroke ke 300ms baad search hoga
input.addEventListener("input", e => searchHandler(e.target.value));


// THROTTLE — "Ek baar chalao, rest cool down"
// N milliseconds mein max ek baar execute karo
// Use case: Scroll, resize, mousemove

function throttle(fn, limit) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= limit) {  // Enough time gaya?
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

const scrollHandler = throttle(() => {
  updateParallax();
}, 16); // ~60fps

window.addEventListener("scroll", scrollHandler);

/*
Comparison:
Debounce: User type karta hai → → → → EXECUTE (sirf end mein)
Throttle: User scroll karta hai → EXECUTE → skip → skip → EXECUTE
*/
```

---

## Q17: Memoization — Costly calculations yaad rakho

```javascript
// Memoization = result cache karo, same input pe calculate mat karo

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Cache se mila!");
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci without memo — BAHUT SLOW (exponential)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // bar bar repeat hota hai!
}

// Fibonacci with memo — FAST
const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fastFib(n - 1) + fastFib(n - 2);
});

fastFib(40); // Bahut fast!
fastFib(40); // Cache se mila — instant!

// React.memo — component re-render rokna
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(d => <Item key={d.id} item={d} />)}</div>;
});
// Sirf tab re-render hoga jab data prop change ho
```

---

## Q18: Memory Leaks — Kaise avoid karen?

```javascript
// ❌ LEAK 1: Timer clear nahi kiya
function startPolling() {
  const data = new Array(100000).fill("*"); // bada object
  setInterval(() => {
    console.log(data.length); // data ko hold kiye hai hamesha!
  }, 1000);
  // Timer kabhi clear nahi → data kabhi GC nahi hoga
}

// ✅ FIX: Cleanup karo
function startPolling() {
  const data = new Array(100000).fill("*");
  const timer = setInterval(() => console.log(data.length), 1000);
  return () => clearInterval(timer); // cleanup function return karo
}
const stopPolling = startPolling();
// Jab chahiye: stopPolling() — timer band, memory free

// ❌ LEAK 2: Event listener remove nahi ki
class MyComponent {
  init() {
    this.handler = () => this.update();
    window.addEventListener("resize", this.handler); // LEAK!
  }
}

// ✅ FIX
class MyComponent {
  init() {
    this.handler = () => this.update();
    window.addEventListener("resize", this.handler);
  }
  destroy() {
    window.removeEventListener("resize", this.handler); // CLEANUP!
  }
}

// ❌ LEAK 3: Global variables
function processUser(user) {
  globalUsers = user; // Oops — global variable! Kabhi GC nahi hoga
}

// ✅ FIX: Use WeakMap (weakly held — GC kar sakta hai)
const userCache = new WeakMap();
function processUser(user) {
  userCache.set(user, computeData(user));
}
```

---

## Q19: Design Patterns — Architecture ke liye

```javascript
// ===== OBSERVER PATTERN =====
// Publisher/Subscriber — events ko dekhte rehna

class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, new Set());
    this.#events.get(event).add(listener);
    return () => this.off(event, listener); // unsubscribe function
  }

  emit(event, ...args) {
    this.#events.get(event)?.forEach(fn => fn(...args));
  }

  off(event, listener) {
    this.#events.get(event)?.delete(listener);
  }
}

const emitter = new EventEmitter();
const unsub = emitter.on("userLogin", user => console.log(`${user} logged in`));
emitter.emit("userLogin", "Rahul"); // Rahul logged in
unsub(); // unsubscribe

// ===== SINGLETON PATTERN =====
// Sirf EK instance banana

class Database {
  static #instance = null;

  constructor(config) {
    if (Database.#instance) return Database.#instance;
    this.connection = this.#connect(config);
    Database.#instance = this;
  }

  #connect(config) { return { connected: true, ...config }; }
  static getInstance(config) {
    if (!Database.#instance) new Database(config);
    return Database.#instance;
  }
}

const db1 = Database.getInstance({ host: "localhost" });
const db2 = Database.getInstance();
db1 === db2; // true — same instance!

// ===== FACTORY PATTERN =====
class UserFactory {
  static create(type, data) {
    const configs = {
      admin:  { ...data, role: "admin",  perms: ["read","write","delete"] },
      editor: { ...data, role: "editor", perms: ["read","write"] },
      viewer: { ...data, role: "viewer", perms: ["read"] },
    };
    if (!configs[type]) throw new Error(`Unknown type: ${type}`);
    return configs[type];
  }
}
const admin = UserFactory.create("admin", { name: "Priya" });
```

---

## Q20: Error Handling — Production-grade

```javascript
// Custom Error classes
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Expected error hai
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400, "VALIDATION_ERROR");
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

// Async error handling
async function getUser(id) {
  if (!id) throw new ValidationError("ID required", "id");

  const user = await db.findById(id);
  if (!user) throw new NotFoundError("User");

  return user;
}

// Global error handler (Express mein)
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    });
  }
  // Unexpected error
  console.error("UNEXPECTED ERROR:", err);
  res.status(500).json({ error: "INTERNAL_ERROR", message: "Kuch galat hua" });
});

// Result type pattern (TypeScript style)
function safeDiv(a, b) {
  if (b === 0) return { ok: false, error: "Zero se divide nahi kar sakte" };
  return { ok: true, value: a / b };
}

const result = safeDiv(10, 0);
if (result.ok) console.log(result.value);
else console.log(result.error);
```

---

# Level 5 — Principal/Staff Engineer
> *8-10+ years — Engine Internals, System Design, Architecture*

---

## Q21: V8 Engine kaise kaam karta hai? Optimization kaise kare?

```javascript
// V8 ka Pipeline:
// Source Code → Parser → AST → Ignition (bytecode) → TurboFan (JIT)

// Hidden Classes — V8 objects ko internally optimize karta hai

// ❌ BAD — Multiple hidden classes bante hain
const p1 = {};
p1.x = 1; // Shape: {x}
p1.y = 2; // Shape: {x, y}  ← naya shape!

const p2 = {};
p2.y = 2; // Shape: {y}     ← alag order, alag shape!
p2.x = 1; // Shape: {y, x}  ← V8 optimize nahi kar sakta

// ✅ GOOD — Ek hi hidden class
const p1 = { x: 1, y: 2 }; // Shape: {x, y}
const p2 = { x: 3, y: 4 }; // Same shape! V8 khush hai

// Inline Caching — V8 frequently called functions optimize karta hai
// Monomorphic (ek type) = FASTEST
// Polymorphic (2-4 types) = OK
// Megamorphic (5+ types) = SLOW

// ❌ SLOW — Har call mein alag type
function process(shape) {
  return shape.area(); // Circle, Square, Triangle, Pentagon...
}

// ✅ FAST — Ek hi type hamesha
function processRect(rect) {
  return rect.width * rect.height; // Sirf Rectangle
}

// Deoptimization — V8 optimize karta hai, phir bail out
function add(a, b) { return a + b; }
add(1, 2);     // V8 sochta hai: "Yeh integers hain, optimize karta hun"
add(1.5, 2.5); // V8: "Oh no, floats hain!" → Deoptimize!

// Numbers ko consistent rakho — hamesha int ya hamesha float
```

---

## Q22: Generators aur Iterators — Custom iteration

```javascript
// Iterator — next() method wala object
// Generator — function* jo iterator return karta hai

function* countdown(start) {
  while (start > 0) {
    yield start; // "Ruko yahan, value dedo"
    start--;
  }
  return "Blast off!"; // Final value
}

const gen = countdown(3);
gen.next(); // { value: 3, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 1, done: false }
gen.next(); // { value: "Blast off!", done: true }

// for...of ke saath
for (const num of countdown(5)) {
  console.log(num); // 5, 4, 3, 2, 1
}

// Infinite sequence (memory efficient!)
function* naturals() {
  let n = 1;
  while (true) yield n++; // Infinite! But lazy
}

function* take(gen, n) {
  for (const val of gen) {
    if (n-- === 0) return;
    yield val;
  }
}

[...take(naturals(), 5)]; // [1, 2, 3, 4, 5]

// Async Generator — Paginated API fetch
async function* fetchPages(baseUrl) {
  let page = 1;
  while (true) {
    const res = await fetch(`${baseUrl}?page=${page}`);
    const data = await res.json();
    if (!data.items.length) return;
    yield data.items;
    page++;
  }
}

for await (const items of fetchPages("/api/products")) {
  console.log("Page mila:", items.length, "items");
  // Memory efficient — ek page at a time
}
```

---

## Q23: TypeScript Advanced — Jo senior se poochha jaata hai

```typescript
// CONDITIONAL TYPES
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// INFER — type extract karo
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type FuncReturn = ReturnType<() => string>; // string
type PromiseValue = UnpackPromise<Promise<number>>; // number

// MAPPED TYPES — sabhi keys transform karo
type ReadOnly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Deep Readonly (nested bhi)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// DISCRIMINATED UNIONS — type-safe error handling
type ApiResult<T> =
  | { success: true; data: T; statusCode: 200 }
  | { success: false; error: string; statusCode: 400 | 404 | 500 };

async function fetchUser(id: string): Promise<ApiResult<User>> {
  // ...
}

const result = await fetchUser("1");
if (result.success) {
  result.data.name; // TypeScript jaanta hai yeh User hai
} else {
  result.error;     // TypeScript jaanta hai yeh string hai
}

// TEMPLATE LITERAL TYPES
type Direction = "top" | "right" | "bottom" | "left";
type CSSProp = `margin-${Direction}` | `padding-${Direction}`;
// "margin-top" | "margin-right" | "margin-bottom" | ...
```

---

## Q24: System Design — Real-world architecture

### Design karo: Real-time Chat System (WhatsApp jaisa)

```
Architecture:

[User A]──WebSocket──[Load Balancer]──[Chat Server 1]──[Redis Pub/Sub]──[Chat Server 2]──WebSocket──[User B]
                                              │                                   │
                                        [Message DB]                      [Message DB]
                                        (Cassandra)                       (Cassandra)
                                              │
                                        [Media Storage]
                                           (S3)

Flow:
1. User A message bhejta hai via WebSocket
2. Chat Server message receive karta hai
3. Message DB mein save hota hai (Cassandra — write-heavy ke liye best)
4. Redis Pub/Sub mein publish hota hai
5. User B ka Chat Server subscribe karta hai
6. User B ko WebSocket se message deliver hota hai
7. Acknowledgment wapas jaata hai

Scaling considerations:
- WebSocket connections: 1 server = ~50k concurrent connections
- Message Queue (Kafka): Agar server down ho toh messages lose na hon
- Read receipts: Separate lightweight service
- Media: Client-side compression → S3 direct upload → CDN
- End-to-end encryption: Signal Protocol
```

```javascript
// WebSocket Server (Node.js + ws)
import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({ port: 8080 });
const pub = createClient();
const sub = createClient();
const connections = new Map(); // userId → WebSocket

wss.on("connection", async (ws, req) => {
  const userId = extractUserId(req); // JWT se
  connections.set(userId, ws);

  // User ke messages subscribe karo
  await sub.subscribe(`user:${userId}`, (message) => {
    ws.send(message);
  });

  ws.on("message", async (rawData) => {
    const { to, text } = JSON.parse(rawData);

    const message = {
      from: userId, to, text,
      id: generateId(),
      timestamp: Date.now()
    };

    // Save to DB
    await saveMessage(message);

    // Recipient ko deliver karo via Redis
    await pub.publish(`user:${to}`, JSON.stringify(message));
  });

  ws.on("close", async () => {
    connections.delete(userId);
    await sub.unsubscribe(`user:${userId}`);
  });
});
```

---

## Q25: LRU Cache — FAANG ka favorite question

```javascript
// Least Recently Used Cache
// Most recently used → end mein
// Least recently used → start mein → evict hota hai

class LRUCache {
  #capacity;
  #cache = new Map(); // Map insertion order maintain karta hai!

  constructor(capacity) {
    this.#capacity = capacity;
  }

  get(key) {
    if (!this.#cache.has(key)) return -1;

    // MRU banao — delete karo aur end mein add karo
    const value = this.#cache.get(key);
    this.#cache.delete(key);
    this.#cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key); // Pehle hatao
    } else if (this.#cache.size >= this.#capacity) {
      // LRU evict karo — Map ka pehla element
      const lruKey = this.#cache.keys().next().value;
      this.#cache.delete(lruKey);
    }
    this.#cache.set(key, value); // End mein add
  }

  get size() { return this.#cache.size; }
}

// Test
const cache = new LRUCache(3);
cache.put("a", 1); // [a]
cache.put("b", 2); // [a, b]
cache.put("c", 3); // [a, b, c]
cache.get("a");    // [b, c, a] ← a became MRU
cache.put("d", 4); // [c, a, d] ← b evicted (was LRU)
cache.get("b");    // -1 (evicted!)
cache.get("c");    // 3 ✅
```

---

## 🎯 Interview Tips — Last Minute

### Kya bolna hai interviewer ko:

1. **Problem clarify karo** — "Kya main ek example se shuru kar sakta hun?"
2. **Brute force pehle** — "Ek simple solution hai, phir optimize karte hain"
3. **Edge cases socho** — null, empty array, negative numbers
4. **Time/Space complexity** — "Yeh O(n) time aur O(1) space mein kaam karega"
5. **Test karo** — "Ab main isse test karta hun"

### Frequently asked by companies:

| Company | Focus |
|---------|-------|
| Google  | Algorithms + System Design |
| Amazon  | Leadership Principles + DSA |
| Meta    | React Internals + System Design |
| Microsoft | OOP + DSA + Azure |
| Flipkart | Full Stack + Node.js + DSA |
| Swiggy/Zomato | Real-time systems + Node.js |
| Razorpay | Payments + Security + Node.js |
| CRED | Frontend Performance + React |

---

## ⚡ Quick Reference — Ek Nazar Mein

| Concept | Yaad rakho |
|---------|-----------|
| `var` vs `let` vs `const` | var = function scope; let/const = block scope |
| `==` vs `===` | == type convert karta; === nahi |
| Closure | Function apne outer scope ko yaad rakhta hai |
| `this` | Call site pe depend karta hai; arrow function mein lexical |
| Promise states | pending → fulfilled/rejected |
| Event Loop priority | Sync → Microtask (Promise) → Macrotask (setTimeout) |
| Debounce | Last event ke baad wait karo |
| Throttle | Har N ms mein sirf ek baar |
| Prototype chain | Property nahi mili → upar dhundo |
| Memoize | Result cache karo, repeat computation mat karo |

---

*Guide complete hua! Basic se Senior tak — ab interview crack karo! 💪*
*Hindi + English = Hinglish mein samjhaya gaya hai*