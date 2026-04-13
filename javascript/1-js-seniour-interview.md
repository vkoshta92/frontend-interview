# 🚀 JavaScript Senior Software Engineer Interview Guide
### 10 Years Experience Level | FAANG & Big Tech Ready

---

## 📌 Table of Contents

1. [JavaScript Core & Engine Internals](#1-javascript-core--engine-internals)
2. [Asynchronous JavaScript & Event Loop](#2-asynchronous-javascript--event-loop)
3. [Closures, Scope & Hoisting](#3-closures-scope--hoisting)
4. [Prototypes, Inheritance & OOP](#4-prototypes-inheritance--oop)
5. [Memory Management & Performance](#5-memory-management--performance)
6. [Design Patterns](#6-design-patterns)
7. [Functional Programming](#7-functional-programming)
8. [DOM, Browser APIs & Web Performance](#8-dom-browser-apis--web-performance)
9. [Security](#9-security)
10. [System Design & Architecture](#10-system-design--architecture)
11. [TypeScript Deep Dive](#11-typescript-deep-dive)
12. [Testing Strategies](#12-testing-strategies)
13. [Node.js & Backend JavaScript](#13-nodejs--backend-javascript)
14. [Real Project Tasks (Coding Challenges)](#14-real-project-tasks-coding-challenges)
15. [Behavioral & Leadership Questions](#15-behavioral--leadership-questions)
16. [Company-Specific Focus Areas](#16-company-specific-focus-areas)

---

## 1. JavaScript Core & Engine Internals

### Q1: How does the JavaScript V8 engine compile and optimize code?

**Answer:**

V8 uses a multi-tier compilation pipeline:

1. **Parsing** → AST (Abstract Syntax Tree) is generated
2. **Ignition (Interpreter)** → Generates bytecode from AST; fast startup
3. **Sparkplug** → Quick baseline compiler (no optimization)
4. **Maglev** → Mid-tier optimizing compiler (new in V8)
5. **TurboFan** → Full optimizing JIT compiler using type feedback

**Key Optimizations:**
- **Inline Caching (IC):** V8 remembers the type of object at a call site and skips property lookup next time
- **Hidden Classes (Shapes):** V8 creates internal "shapes" for objects with same structure. Always initialize object properties in the same order.
- **Deoptimization:** If a function receives unexpected types, V8 "bails out" back to bytecode

```javascript
// ❌ BAD - V8 creates multiple hidden classes
function badPoint(x, y) {
  const p = {};
  p.x = x;    // Shape A: {x}
  p.y = y;    // Shape B: {x, y}
  return p;
}

// ✅ GOOD - Single hidden class, V8 optimizes well
function goodPoint(x, y) {
  return { x, y }; // Shape: {x, y} created once
}

// ❌ BAD - polymorphic call site (V8 can't optimize)
function getArea(shape) {
  return shape.width * shape.height; // called with Circle, Rect, Triangle...
}

// ✅ GOOD - monomorphic (same shape always)
class Rectangle {
  constructor(w, h) { this.width = w; this.height = h; }
  area() { return this.width * this.height; } // V8 inlines this
}
```

---

### Q2: What is the Temporal Dead Zone (TDZ) and how does it differ from `var` hoisting?

**Answer:**

```javascript
// var - hoisted and initialized to undefined
console.log(a); // undefined (NOT ReferenceError)
var a = 5;

// let/const - hoisted but NOT initialized → TDZ
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 5;

// TDZ exists from block start until the declaration line is reached
{
  // TDZ for `c` starts here
  typeof c; // ❌ ReferenceError (typeof doesn't save you inside TDZ)
  let c = 10; // TDZ ends here
}

// Function declarations are fully hoisted (name + body)
greet(); // ✅ Works: "Hello"
function greet() { console.log("Hello"); }

// Function expressions are NOT fully hoisted
sayHi(); // ❌ TypeError: sayHi is not a function
var sayHi = function() { console.log("Hi"); };
```

---

### Q3: Explain `==` vs `===` with the Abstract Equality Comparison algorithm

**Answer:**

`===` (Strict): Same type AND same value — no coercion.

`==` (Abstract): Follows the ECMAScript spec's Abstract Equality Comparison:

```javascript
// Type coercion rules for ==
null == undefined  // true (special rule)
null == 0          // false
null == false      // false

NaN == NaN         // false (NaN is never equal to anything)

// Number vs String: string is converted to number
"5" == 5           // true  (ToNumber("5") = 5)
"" == 0            // true  (ToNumber("") = 0)
"0" == false       // true  → "0" == 0 → 0 == 0

// Object vs Primitive: ToPrimitive called
[] == false        // true  → "" == false → "" == 0 → 0 == 0
[] == ![]          // true  (![] = false) → [] == false → true
{} == "[object Object]" // true via toString

// The famous JS "wat" cases
"" == false        // true
" " == 0           // true
[] == 0            // true

// Best practice: ALWAYS use ===
```

---

## 2. Asynchronous JavaScript & Event Loop

### Q4: Explain the Event Loop, Call Stack, Task Queue, and Microtask Queue in detail

**Answer:**

```
┌─────────────────────────┐
│       Call Stack        │ ← Executes synchronous code
└────────────┬────────────┘
             │ empty?
             ▼
┌─────────────────────────┐
│   Microtask Queue       │ ← Promise callbacks, queueMicrotask, MutationObserver
│   (drained completely)  │   ALL microtasks run before next task
└────────────┬────────────┘
             │ empty?
             ▼
┌─────────────────────────┐
│   Task Queue (Macrotask)│ ← setTimeout, setInterval, I/O, UI events
│   (one task at a time)  │
└─────────────────────────┘
```

```javascript
console.log("1");                        // sync

setTimeout(() => console.log("2"), 0);  // macrotask

Promise.resolve()
  .then(() => {
    console.log("3");                    // microtask
    return Promise.resolve();
  })
  .then(() => console.log("4"));        // microtask (chained)

queueMicrotask(() => console.log("5")); // microtask

console.log("6");                        // sync

// Output: 1, 6, 3, 5, 4, 2
// Explanation:
// Sync runs first: 1, 6
// Microtask queue drained: 3 (then 5 added), then 5, then 4
// Macrotask: 2
```

**Tricky Senior Question:**
```javascript
async function main() {
  console.log("A");
  await Promise.resolve();
  console.log("B");        // microtask
}

main();
console.log("C");

// Output: A, C, B
// `await` suspends the function and schedules the rest as a microtask
```

---

### Q5: Implement `Promise.all`, `Promise.race`, `Promise.allSettled`, `Promise.any` from scratch

```javascript
// Promise.all — rejects if any rejects
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = [];
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (--remaining === 0) resolve(results);
      }).catch(reject);
    });
  });
};

// Promise.race — settles with first settled promise
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject));
  });
};

// Promise.allSettled — always resolves with all results
Promise.myAllSettled = function(promises) {
  return Promise.myAll(
    promises.map(p =>
      Promise.resolve(p)
        .then(value => ({ status: "fulfilled", value }))
        .catch(reason => ({ status: "rejected", reason }))
    )
  );
};

// Promise.any — resolves with first fulfilled, rejects if all reject
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    let rejections = 0;
    const errors = [];
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(resolve)
        .catch(err => {
          errors[i] = err;
          if (++rejections === promises.length)
            reject(new AggregateError(errors, "All promises rejected"));
        });
    });
  });
};
```

---

### Q6: What are the pitfalls of async/await and how do you handle them?

```javascript
// ❌ PITFALL 1: Sequential when parallel is possible
async function fetchUserData(id) {
  const user = await getUser(id);        // waits
  const posts = await getPosts(id);      // waits unnecessarily
  return { user, posts };
}

// ✅ FIXED: Run in parallel
async function fetchUserData(id) {
  const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
  return { user, posts };
}

// ❌ PITFALL 2: Lost errors in forEach
async function processItems(items) {
  items.forEach(async (item) => {        // forEach doesn't await
    await processItem(item);             // errors swallowed!
  });
}

// ✅ FIXED
async function processItems(items) {
  await Promise.all(items.map(item => processItem(item)));
  // OR sequential:
  for (const item of items) {
    await processItem(item);
  }
}

// ❌ PITFALL 3: Unhandled rejection
async function risky() {
  const p = asyncOperation(); // promise created but not awaited yet
  await someOtherThing();
  await p;                    // error here is unhandled if someOtherThing throws
}

// ✅ FIXED: Always handle
async function safe() {
  const [result1, result2] = await Promise.allSettled([
    asyncOperation(),
    someOtherThing()
  ]);
}

// ❌ PITFALL 4: try/catch missing async errors in callbacks
async function withCallback() {
  try {
    someLibrary.on("event", async (data) => {
      await riskyOperation(data); // error NOT caught by outer try/catch!
    });
  } catch (e) {
    // Won't catch async errors from callback
  }
}

// ✅ FIXED: Handle inside callback
someLibrary.on("event", async (data) => {
  try {
    await riskyOperation(data);
  } catch (e) {
    handleError(e);
  }
});
```

---

## 3. Closures, Scope & Hoisting

### Q7: Classic closure interview trap — and multiple solutions

```javascript
// ❌ Classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is function-scoped, single binding)

// ✅ Solution 1: let (block-scoped, new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// ✅ Solution 2: IIFE (creates new scope)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}

// ✅ Solution 3: Factory function
function makeLogger(i) {
  return () => console.log(i);
}
for (var i = 0; i < 3; i++) {
  setTimeout(makeLogger(i), 100);
}

// ✅ Solution 4: bind
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 100);
}
```

---

### Q8: Implement a `memoize` function with closure

```javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    // Create a cache key from arguments
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Cache hit:", key);
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveAdd = memoize((a, b) => {
  console.log("Computing...");
  return a + b;
});

expensiveAdd(1, 2); // Computing... 3
expensiveAdd(1, 2); // Cache hit: [1,2] → 3
expensiveAdd(3, 4); // Computing... 7

// Advanced: with TTL (Time-to-Live)
function memoizeWithTTL(fn, ttl = 5000) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const value = fn.apply(this, args);
    cache.set(key, { value, timestamp: Date.now() });
    return value;
  };
}

// Advanced: memoize with WeakMap for object args (no memory leak)
function memoizeWeak(fn) {
  const cache = new WeakMap();
  return function(obj) { // Works for single object arg
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
```

---

## 4. Prototypes, Inheritance & OOP

### Q9: Explain the prototype chain and implement classical inheritance without `class`

```javascript
// How prototype chain works
const obj = {};
// obj → Object.prototype → null

const arr = [];
// arr → Array.prototype → Object.prototype → null

function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // super() equivalent
  this.breed = breed;
}

// Set up inheritance chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const rex = new Dog("Rex", "German Shepherd");
console.log(rex.speak()); // Rex makes a sound (from Animal.prototype)
console.log(rex.bark());  // Rex barks! (from Dog.prototype)
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true

// Equivalent with class (syntactic sugar, same prototype chain)
class AnimalClass {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class DogClass extends AnimalClass {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() { return `${this.name} barks!`; }
}

// Object.create for prototype delegation (not classical inheritance)
const animalProto = {
  speak() { return `${this.name} makes a sound`; }
};

const cat = Object.create(animalProto);
cat.name = "Whiskers";
cat.speak(); // Whiskers makes a sound
```

---

### Q10: Implement `new` operator from scratch

```javascript
function myNew(Constructor, ...args) {
  // 1. Create a new object with Constructor's prototype
  const obj = Object.create(Constructor.prototype);

  // 2. Call constructor with `this` bound to new object
  const result = Constructor.apply(obj, args);

  // 3. If constructor returns an object, return it; otherwise return obj
  return (result !== null && typeof result === "object") ? result : obj;
}

// Test
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const p = myNew(Person, "Alice", 30);
console.log(p.greet());        // Hi, I'm Alice
console.log(p instanceof Person); // true
```

---

## 5. Memory Management & Performance

### Q11: What are memory leaks in JavaScript? Give real examples and fixes.

```javascript
// ❌ LEAK 1: Forgotten timers
function startPolling() {
  const data = new Array(1000000).fill("*"); // large object
  setInterval(() => {
    console.log(data.length); // holds reference to data forever
  }, 1000);
  // Timer never cleared → data never GC'd
}

// ✅ FIX
function startPolling() {
  const data = new Array(1000000).fill("*");
  const timer = setInterval(() => console.log(data.length), 1000);
  return () => clearInterval(timer); // expose cleanup
}

// ❌ LEAK 2: Detached DOM nodes
let detachedNode;
function createLeak() {
  const div = document.createElement("div");
  div.innerHTML = "<p>Lots of content...</p>";
  document.body.appendChild(div);
  detachedNode = div; // global reference!
  document.body.removeChild(div); // removed from DOM but JS still holds ref
}

// ✅ FIX: Use WeakRef or nullify reference
function fixedCreate() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  document.body.removeChild(div);
  // No global reference → eligible for GC
}

// ❌ LEAK 3: Closures capturing large objects
function processData() {
  const hugeData = new Array(1000000).fill(Math.random());

  return {
    getFirst: () => hugeData[0], // holds entire hugeData in closure
    getLength: () => hugeData.length
  };
}

// ✅ FIX: Extract only needed data
function processDataFixed() {
  const hugeData = new Array(1000000).fill(Math.random());
  const first = hugeData[0];
  const length = hugeData.length;
  // hugeData eligible for GC after function returns

  return {
    getFirst: () => first,
    getLength: () => length
  };
}

// ❌ LEAK 4: Event listeners not removed
class Component {
  setup() {
    this.handler = () => this.update();
    window.addEventListener("resize", this.handler); // never removed!
  }
}

// ✅ FIX
class ComponentFixed {
  setup() {
    this.handler = () => this.update();
    window.addEventListener("resize", this.handler);
  }
  destroy() {
    window.removeEventListener("resize", this.handler);
  }
}

// ❌ LEAK 5: Map/Set with object keys (use WeakMap/WeakSet)
const cache = new Map();
function process(obj) {
  if (!cache.has(obj)) cache.set(obj, expensiveComputation(obj));
  return cache.get(obj);
  // obj can never be GC'd as long as cache exists
}

// ✅ FIX
const weakCache = new WeakMap(); // keys held weakly, GC can collect
function processFixed(obj) {
  if (!weakCache.has(obj)) weakCache.set(obj, expensiveComputation(obj));
  return weakCache.get(obj);
}
```

---

## 6. Design Patterns

### Q12: Implement the Observer/EventEmitter pattern

```javascript
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, new Set());
    this.#events.get(event).add(listener);
    return () => this.off(event, listener); // return unsubscribe fn
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    this.#events.get(event)?.delete(listener);
  }

  emit(event, ...args) {
    this.#events.get(event)?.forEach(listener => {
      try { listener(...args); }
      catch (e) { console.error(`Error in listener for ${event}:`, e); }
    });
  }

  removeAllListeners(event) {
    if (event) this.#events.delete(event);
    else this.#events.clear();
  }
}

// Usage
const emitter = new EventEmitter();

const unsubscribe = emitter.on("data", (payload) => {
  console.log("Received:", payload);
});

emitter.once("connect", () => console.log("Connected!")); // fires once

emitter.emit("data", { id: 1, name: "Alice" });
emitter.emit("connect"); // logs "Connected!"
emitter.emit("connect"); // nothing (once removed it)

unsubscribe(); // remove listener
emitter.emit("data", {}); // nothing logged
```

---

### Q13: Implement the Module Pattern, Singleton, and Factory

```javascript
// ======= SINGLETON =======
class DatabaseConnection {
  static #instance = null;
  #connection;

  constructor(config) {
    if (DatabaseConnection.#instance) return DatabaseConnection.#instance;
    this.#connection = this.#connect(config);
    DatabaseConnection.#instance = this;
  }

  #connect(config) {
    console.log("Connecting to DB...", config);
    return { connected: true, config };
  }

  static getInstance(config) {
    if (!DatabaseConnection.#instance) new DatabaseConnection(config);
    return DatabaseConnection.#instance;
  }

  query(sql) {
    return `Result for: ${sql}`;
  }
}

const db1 = DatabaseConnection.getInstance({ host: "localhost" });
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true — same instance

// ======= FACTORY =======
class UserFactory {
  static create(type, data) {
    const factories = {
      admin: (d) => ({ ...d, role: "admin", permissions: ["read", "write", "delete"] }),
      editor: (d) => ({ ...d, role: "editor", permissions: ["read", "write"] }),
      viewer: (d) => ({ ...d, role: "viewer", permissions: ["read"] }),
    };

    const factory = factories[type];
    if (!factory) throw new Error(`Unknown user type: ${type}`);
    return factory(data);
  }
}

const admin = UserFactory.create("admin", { name: "Alice", email: "a@b.com" });
// { name: "Alice", email: "a@b.com", role: "admin", permissions: [...] }

// ======= MODULE PATTERN =======
const ShoppingCart = (() => {
  let items = [];      // private
  let discount = 0;    // private

  return {
    add(item) { items.push(item); },
    remove(id) { items = items.filter(i => i.id !== id); },
    setDiscount(d) { discount = d; },
    getTotal() {
      const subtotal = items.reduce((sum, i) => sum + i.price, 0);
      return subtotal * (1 - discount);
    },
    getItems() { return [...items]; } // return copy, not reference
  };
})();
```

---

### Q14: Implement Debounce and Throttle

```javascript
// DEBOUNCE — fires after N ms of inactivity
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null;
  let lastResult;

  return function(...args) {
    const callNow = leading && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      if (trailing && !leading) lastResult = fn.apply(this, args);
    }, delay);

    if (callNow) lastResult = fn.apply(this, args);
    return lastResult;
  };
}

// THROTTLE — fires at most once per N ms
function throttle(fn, limit) {
  let inThrottle = false;
  let lastResult;

  return function(...args) {
    if (!inThrottle) {
      lastResult = fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
}

// Advanced throttle with trailing call
function throttleAdvanced(fn, limit) {
  let lastCall = 0;
  let timeoutId = null;

  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      lastCall = now;
      return fn.apply(this, args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Usage
const searchHandler = debounce((query) => fetchResults(query), 300);
window.addEventListener("input", e => searchHandler(e.target.value));

const scrollHandler = throttle(() => updateParallax(), 16); // ~60fps
window.addEventListener("scroll", scrollHandler);
```

---

## 7. Functional Programming

### Q15: Implement `compose`, `pipe`, `curry`, and `partial application`

```javascript
// COMPOSE — right to left
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// PIPE — left to right
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Example
const transform = pipe(
  x => x * 2,
  x => x + 1,
  x => `Result: ${x}`
);
console.log(transform(5)); // "Result: 11"

// CURRY — transform f(a,b,c) to f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);    // 6
add(1, 2)(3);    // 6
add(1)(2, 3);    // 6
add(1, 2, 3);    // 6

// PARTIAL APPLICATION
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const multiply = (a, b, c) => a * b * c;
const double = partial(multiply, 2);
const triple = partial(multiply, 3);
double(4, 5); // 40
triple(4, 5); // 60

// Real-world: compose API middleware
const withLogging = fn => async (...args) => {
  console.log("Calling with:", args);
  const result = await fn(...args);
  console.log("Result:", result);
  return result;
};

const withRetry = (fn, retries = 3) => async (...args) => {
  for (let i = 0; i < retries; i++) {
    try { return await fn(...args); }
    catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2 ** i * 100));
    }
  }
};

const robustFetch = pipe(
  withLogging,
  fn => withRetry(fn, 3)
)(fetch);
```

---

## 8. DOM, Browser APIs & Web Performance

### Q16: What is the Critical Rendering Path and how do you optimize it?

**Answer:**

```
HTML → DOM
CSS  → CSSOM       → Render Tree → Layout → Paint → Composite
```

**Optimization techniques:**

```javascript
// ❌ BAD: Forced synchronous layout (Layout thrashing)
function badResize(elements) {
  elements.forEach(el => {
    const height = el.offsetHeight;   // READ — forces layout
    el.style.height = height * 2 + "px"; // WRITE — invalidates layout
    // READ after WRITE = forced synchronous layout!
  });
}

// ✅ GOOD: Batch reads then writes
function goodResize(elements) {
  const heights = elements.map(el => el.offsetHeight); // all READs
  elements.forEach((el, i) => {
    el.style.height = heights[i] * 2 + "px";           // all WRITEs
  });
}

// ✅ BEST: Use requestAnimationFrame
function animatedResize(elements) {
  requestAnimationFrame(() => {
    const heights = elements.map(el => el.offsetHeight);
    requestAnimationFrame(() => {
      elements.forEach((el, i) => {
        el.style.height = heights[i] * 2 + "px";
      });
    });
  });
}

// Virtual DOM diff concept (simplified React-like)
function diff(oldVNode, newVNode) {
  if (!oldVNode) return { type: "CREATE", node: newVNode };
  if (!newVNode) return { type: "REMOVE" };
  if (typeof oldVNode !== typeof newVNode ||
      oldVNode.type !== newVNode.type) return { type: "REPLACE", node: newVNode };

  if (typeof newVNode === "string") {
    return oldVNode !== newVNode ? { type: "TEXT", content: newVNode } : null;
  }

  const propPatches = diffProps(oldVNode.props, newVNode.props);
  const childPatches = diffChildren(oldVNode.children, newVNode.children);
  return { type: "UPDATE", propPatches, childPatches };
}

// IntersectionObserver for lazy loading
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      lazyLoader.unobserve(img);
    }
  });
}, { rootMargin: "100px" });

document.querySelectorAll("img[data-src]").forEach(img => lazyLoader.observe(img));
```

---

## 9. Security

### Q17: XSS, CSRF, and security best practices

```javascript
// ❌ XSS vulnerability
element.innerHTML = userInput; // NEVER do this!

// ✅ Safe alternatives
element.textContent = userInput; // text only, no HTML parsing
element.innerText = userInput;

// Sanitize if you need HTML
import DOMPurify from "dompurify";
element.innerHTML = DOMPurify.sanitize(userInput);

// ❌ CSRF — request made by attacker's site using victim's cookies
// Attacker's page:
// <img src="https://bank.com/transfer?to=attacker&amount=1000">

// ✅ CSRF Protection
// 1. SameSite cookies
// Set-Cookie: session=abc; SameSite=Strict; Secure; HttpOnly

// 2. CSRF tokens
async function csrfFetch(url, options = {}) {
  const token = document.cookie.match(/csrfToken=([^;]+)/)?.[1];
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

// Content Security Policy (CSP)
// HTTP Header: Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM'

// Subresource Integrity
// <script src="https://cdn.com/lib.js"
//   integrity="sha384-abc123..."
//   crossorigin="anonymous"></script>

// SQL Injection prevention (Node.js)
// ❌ DANGEROUS
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ SAFE — parameterized queries
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
```

---

## 10. System Design & Architecture

### Q18: Design a real-time collaborative document editor (like Google Docs)

```
Architecture:

┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ OT Engine│  │ WebSocket│  │   UI / Quill.js  │   │
│  │(Conflict)│  │  Client  │  │   Rich Text Ed.  │   │
│  └──────────┘  └────┬─────┘  └─────────────────┘   │
└───────────────────────┼─────────────────────────────┘
                        │ WebSocket
┌───────────────────────┼─────────────────────────────┐
│                 API GATEWAY / LB                     │
│              (Sticky sessions for WS)                │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│              DOCUMENT SERVICE CLUSTER                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  Operation Transformer (OT / CRDT)            │    │
│  │  - Transforms concurrent edits                │    │
│  │  - Maintains operation history                │    │
│  └──────────────────────────────────────────────┘    │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐     │
│  │  Redis Pub │  │ Presence │  │  Auth Service │     │
│  │    /Sub    │  │ Tracker  │  │   (JWT/OAuth) │     │
│  └────────────┘  └──────────┘  └──────────────┘     │
└───────────────────────────────────────────────────────┘
           │               │                │
┌──────────▼──┐  ┌─────────▼────┐  ┌───────▼──────────┐
│  PostgreSQL  │  │    Redis     │  │   S3 / Blob      │
│  (Documents) │  │  (Sessions,  │  │   (Snapshots,    │
│  (Versions)  │  │  Pub/Sub,    │  │    Media files)  │
│              │  │  Lock)       │  │                  │
└──────────────┘  └──────────────┘  └──────────────────┘
```

```javascript
// Operational Transformation (OT) — simplified
class Operation {
  constructor(type, position, content, version) {
    this.type = type;       // "insert" | "delete"
    this.position = position;
    this.content = content;
    this.version = version;
  }
}

function transform(op1, op2) {
  // Transform op1 against concurrent op2
  if (op1.type === "insert" && op2.type === "insert") {
    if (op2.position <= op1.position) {
      return new Operation(op1.type, op1.position + op2.content.length, op1.content, op1.version);
    }
    return op1;
  }
  if (op1.type === "insert" && op2.type === "delete") {
    if (op2.position < op1.position) {
      return new Operation(op1.type, op1.position - op2.content.length, op1.content, op1.version);
    }
    return op1;
  }
  // ... more cases
}

// CRDT alternative — Yjs example (production-grade)
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const ydoc = new Y.Doc();
const wsProvider = new WebsocketProvider("wss://docs.example.com", "room-123", ydoc);
const ytext = ydoc.getText("content");

ytext.observe(event => {
  // Automatically conflict-free! Update your UI here
  updateEditor(ytext.toString());
});
```

---

### Q19: Design a front-end caching strategy

```javascript
// Multi-level cache architecture
class CacheManager {
  constructor() {
    this.memoryCache = new Map();  // L1: fastest, limited
    this.memoryTTL = new Map();
  }

  // L1: Memory Cache
  setMemory(key, value, ttl = 60000) {
    this.memoryCache.set(key, value);
    this.memoryTTL.set(key, Date.now() + ttl);
  }

  getMemory(key) {
    if (this.memoryTTL.get(key) < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return this.memoryCache.get(key) ?? null;
  }

  // L2: IndexedDB (persistent, large)
  async setDB(key, value) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("AppCache", 1);
      req.onsuccess = e => {
        const tx = e.target.result.transaction("cache", "readwrite");
        tx.objectStore("cache").put({ key, value, ts: Date.now() });
        tx.oncomplete = resolve;
      };
      req.onerror = reject;
    });
  }

  // Stale-While-Revalidate pattern
  async swr(key, fetchFn, { maxAge = 60, staleWhileRevalidate = 300 } = {}) {
    const cached = this.getMemory(key);
    const age = cached ? (Date.now() - cached.timestamp) / 1000 : Infinity;

    if (cached && age < maxAge) return cached.data;     // Fresh: return cache

    if (cached && age < staleWhileRevalidate) {
      // Stale but acceptable: return stale data AND revalidate in background
      fetchFn().then(fresh => this.setMemory(key, { data: fresh, timestamp: Date.now() }));
      return cached.data;
    }

    // Too old or no cache: fetch and cache
    const fresh = await fetchFn();
    this.setMemory(key, { data: fresh, timestamp: Date.now() });
    return fresh;
  }
}

// Service Worker caching strategies
// In service-worker.js:
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Cache First (static assets)
  if (url.pathname.startsWith("/static/")) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          caches.open("static-v1").then(cache => cache.put(event.request, response.clone()));
          return response;
        })
      )
    );
  }

  // Network First (API calls)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then(response => { /* cache response */ return response; })
        .catch(() => caches.match(event.request)) // fallback to cache
    );
  }
});
```

---

## 11. TypeScript Deep Dive

### Q20: Advanced TypeScript patterns

```typescript
// CONDITIONAL TYPES
type IsArray<T> = T extends any[] ? true : false;
type FlattenArray<T> = T extends (infer U)[] ? U : T;

type A = IsArray<string[]>;   // true
type B = IsArray<string>;     // false
type C = FlattenArray<string[]>; // string

// MAPPED TYPES
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Deep Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// TEMPLATE LITERAL TYPES
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type CSSProperty = `${string}-${string}`;
type ApiEndpoint = `/api/v${number}/${string}`;

// INFER KEYWORD
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// DISCRIMINATED UNIONS
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function fetchUser(id: string): Promise<Result<User>> {
  // ...
}

const result = await fetchUser("1");
if (result.success) {
  console.log(result.data); // TypeScript knows this is User
} else {
  console.log(result.error); // TypeScript knows this is Error
}

// UTILITY TYPES (implement from scratch)
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;
type MyRequired<T> = { [K in keyof T]-?: T[K] };  // -? removes optional
type MyPartial<T> = { [K in keyof T]+?: T[K] };   // +? adds optional

// FUNCTION OVERLOADS
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement("a"); // TypeScript knows it's HTMLAnchorElement
link.href = "https://example.com"; // ✅ TypeScript is happy
```

---

## 12. Testing Strategies

### Q21: Testing philosophy and implementation

```javascript
// Unit Testing with Jest
// Test the "pure" logic in isolation

// Function to test
function calculateDiscount(price, userType, quantity) {
  if (price < 0) throw new Error("Price must be positive");
  let discount = 0;
  if (userType === "premium") discount += 0.1;
  if (quantity >= 10) discount += 0.05;
  if (quantity >= 100) discount += 0.1;
  return price * (1 - discount);
}

// Test suite
describe("calculateDiscount", () => {
  test("no discount for regular user, small quantity", () => {
    expect(calculateDiscount(100, "regular", 1)).toBe(100);
  });

  test("10% discount for premium user", () => {
    expect(calculateDiscount(100, "premium", 1)).toBe(90);
  });

  test("5% discount for quantity >= 10", () => {
    expect(calculateDiscount(100, "regular", 10)).toBe(95);
  });

  test("stacks discounts correctly", () => {
    expect(calculateDiscount(100, "premium", 100)).toBe(75);
  });

  test("throws on negative price", () => {
    expect(() => calculateDiscount(-1, "regular", 1)).toThrow("Price must be positive");
  });
});

// Integration Testing — API with MSW (Mock Service Worker)
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users/:id", (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, name: "Alice" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches user data", async () => {
  const user = await fetchUser("1");
  expect(user.name).toBe("Alice");
});

// E2E with Playwright
test("user can complete checkout", async ({ page }) => {
  await page.goto("/shop");
  await page.click("[data-testid=product-1]");
  await page.click("[data-testid=add-to-cart]");
  await page.click("[data-testid=checkout]");
  await page.fill("#card-number", "4111111111111111");
  await page.fill("#expiry", "12/28");
  await page.fill("#cvv", "123");
  await page.click("[data-testid=pay-button]");
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});

// Testing custom React hooks
import { renderHook, act } from "@testing-library/react";
import useCounter from "./useCounter";

test("useCounter increments correctly", () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});
```

---

## 13. Node.js & Backend JavaScript

### Q22: Node.js streams, worker threads, and clustering

```javascript
// STREAMS — process large files without loading all into memory
import { createReadStream, createWriteStream } from "fs";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

// Transform stream: convert CSV to JSON
class CSVToJSON extends Transform {
  #headers = null;

  constructor() {
    super({ objectMode: true });
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop(); // keep incomplete line

    for (const line of lines) {
      if (!this.#headers) {
        this.#headers = line.split(",");
      } else {
        const values = line.split(",");
        const obj = Object.fromEntries(this.#headers.map((h, i) => [h.trim(), values[i]?.trim()]));
        this.push(JSON.stringify(obj) + "\n");
      }
    }
    callback();
  }
}

// Process 10GB file with constant ~50MB memory usage
await pipeline(
  createReadStream("huge.csv"),
  new CSVToJSON(),
  createWriteStream("output.json")
);

// WORKER THREADS — CPU-intensive tasks
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

if (isMainThread) {
  function runInWorker(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: data });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", code => {
        if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
    });
  }

  // Run CPU-intensive tasks in parallel
  const [result1, result2] = await Promise.all([
    runInWorker({ numbers: [1,2,3,4,5] }),
    runInWorker({ numbers: [6,7,8,9,10] })
  ]);
} else {
  // Worker code runs here
  const sum = workerData.numbers.reduce((a, b) => a + b, 0);
  parentPort.postMessage(sum);
}

// CLUSTER — utilize all CPU cores
import cluster from "cluster";
import os from "os";
import express from "express";

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} spawning ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.pid} died, restarting...`);
    cluster.fork(); // auto-restart crashed workers
  });
} else {
  const app = express();
  app.get("/", (req, res) => res.json({ pid: process.pid }));
  app.listen(3000, () => console.log(`Worker ${process.pid} listening`));
}
```

---

## 14. Real Project Tasks (Coding Challenges)

### Task 1: Implement a Virtual DOM + Reconciler (asked at Meta/Facebook)

```javascript
// h() — hyperscript helper
function h(type, props = {}, ...children) {
  return {
    type,
    props: { ...props, children: children.flat() }
  };
}

// Create real DOM from VNode
function createElement(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const el = document.createElement(vnode.type);

  // Set props
  Object.entries(vnode.props || {}).forEach(([key, val]) => {
    if (key === "children") return;
    if (key.startsWith("on")) {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  });

  // Append children
  (vnode.props?.children || []).forEach(child => {
    el.appendChild(createElement(child));
  });

  return el;
}

// Reconcile / patch (simplified)
function patch(parent, newVNode, oldVNode, index = 0) {
  const el = parent.childNodes[index];

  if (!oldVNode) { parent.appendChild(createElement(newVNode)); return; }
  if (!newVNode) { parent.removeChild(el); return; }
  if (changed(newVNode, oldVNode)) { parent.replaceChild(createElement(newVNode), el); return; }

  if (newVNode.type) {
    const newLen = (newVNode.props?.children || []).length;
    const oldLen = (oldVNode.props?.children || []).length;
    for (let i = 0; i < Math.max(newLen, oldLen); i++) {
      patch(el, newVNode.props?.children[i], oldVNode.props?.children[i], i);
    }
    updateProps(el, newVNode.props, oldVNode.props);
  }
}

function changed(a, b) {
  return typeof a !== typeof b
    || (typeof a === "string" && a !== b)
    || a.type !== b.type;
}

// Usage
const vdom1 = h("div", { class: "app" },
  h("h1", {}, "Hello"),
  h("p", {}, "World")
);

const container = document.getElementById("app");
container.appendChild(createElement(vdom1));

const vdom2 = h("div", { class: "app" },
  h("h1", {}, "Hello, Updated!"),
  h("p", {}, "World"),
  h("button", { onclick: () => alert("click") }, "Click me")
);

patch(container, vdom2, vdom1);
```

---

### Task 2: Build an Observable/Reactive State (asked at Google/Angular team)

```javascript
class Observable {
  #subscribers = new Set();
  #value;

  constructor(initialValue) {
    this.#value = initialValue;
  }

  get value() { return this.#value; }

  set value(newVal) {
    if (this.#value === newVal) return;
    this.#value = newVal;
    this.#notify();
  }

  subscribe(fn) {
    this.#subscribers.add(fn);
    fn(this.#value); // emit current value immediately
    return () => this.#subscribers.delete(fn); // unsubscribe
  }

  #notify() {
    this.#subscribers.forEach(fn => fn(this.#value));
  }

  // Computed observable
  static computed(observables, computeFn) {
    const result = new Observable(computeFn(...observables.map(o => o.value)));
    observables.forEach(obs => obs.subscribe(() => {
      result.value = computeFn(...observables.map(o => o.value));
    }));
    return result;
  }

  map(fn) {
    return Observable.computed([this], fn);
  }

  filter(predicate) {
    const filtered = new Observable(
      predicate(this.#value) ? this.#value : undefined
    );
    this.subscribe(val => {
      if (predicate(val)) filtered.value = val;
    });
    return filtered;
  }
}

// Usage
const count = new Observable(0);
const doubled = count.map(x => x * 2);
const isEven = count.map(x => x % 2 === 0);

const unsubscribe = doubled.subscribe(val => console.log("Doubled:", val));
isEven.subscribe(val => console.log("Is even:", val));

count.value = 1; // Doubled: 2, Is even: false
count.value = 2; // Doubled: 4, Is even: true
count.value = 3; // Doubled: 6, Is even: false

unsubscribe();
count.value = 4; // Only Is even: true (doubled unsubscribed)
```

---

### Task 3: Implement an LRU Cache (asked at Amazon, Google, Microsoft)

```javascript
class LRUCache {
  #capacity;
  #cache; // Map preserves insertion order

  constructor(capacity) {
    this.#capacity = capacity;
    this.#cache = new Map();
  }

  get(key) {
    if (!this.#cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.#cache.get(key);
    this.#cache.delete(key);
    this.#cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#cache.has(key)) this.#cache.delete(key);
    else if (this.#cache.size >= this.#capacity) {
      // Delete LRU (first item in Map)
      this.#cache.delete(this.#cache.keys().next().value);
    }
    this.#cache.set(key, value);
  }

  get size() { return this.#cache.size; }
}

// Test
const cache = new LRUCache(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
cache.get("a");      // returns 1, a is now MRU
cache.put("d", 4);   // evicts "b" (LRU)
console.log(cache.get("b")); // -1 (evicted)
console.log(cache.get("a")); // 1 (still there)
console.log(cache.get("c")); // 3
console.log(cache.get("d")); // 4
```

---

### Task 4: Rate Limiter implementation (asked at Stripe, Cloudflare)

```javascript
// Token Bucket Algorithm
class RateLimiter {
  #limits = new Map(); // userId → { tokens, lastRefill }

  constructor({ maxTokens = 10, refillRate = 1, refillInterval = 1000 } = {}) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;         // tokens per interval
    this.refillInterval = refillInterval;  // ms
  }

  #refill(bucket) {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillInterval) * this.refillRate;

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  isAllowed(userId) {
    if (!this.#limits.has(userId)) {
      this.#limits.set(userId, { tokens: this.maxTokens, lastRefill: Date.now() });
    }

    const bucket = this.#limits.get(userId);
    this.#refill(bucket);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return { allowed: true, remaining: bucket.tokens };
    }

    return { allowed: false, remaining: 0, retryAfter: this.refillInterval };
  }
}

// Express middleware
const limiter = new RateLimiter({ maxTokens: 100, refillRate: 10, refillInterval: 1000 });

function rateLimitMiddleware(req, res, next) {
  const userId = req.user?.id || req.ip;
  const result = limiter.isAllowed(userId);

  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.allowed) {
    res.setHeader("Retry-After", result.retryAfter / 1000);
    return res.status(429).json({ error: "Too Many Requests" });
  }

  next();
}
```

---

### Task 5: Build a Promise Pool / Concurrency Limiter (asked at Netflix, Airbnb)

```javascript
async function promisePool(tasks, concurrency) {
  const results = [];
  const executing = new Set();

  for (const [i, task] of tasks.entries()) {
    const p = Promise.resolve().then(() => task()).then(
      result => { results[i] = { status: "fulfilled", value: result }; },
      error  => { results[i] = { status: "rejected", reason: error };  }
    ).finally(() => executing.delete(p));

    executing.add(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// Usage: fetch 100 URLs but max 5 at a time
const urls = Array.from({ length: 100 }, (_, i) => `https://api.example.com/item/${i}`);
const tasks = urls.map(url => () => fetch(url).then(r => r.json()));

const results = await promisePool(tasks, 5);
console.log(results.filter(r => r.status === "fulfilled").length); // success count
```

---

## 15. Behavioral & Leadership Questions

### For 10-Year Senior Roles: Leadership-Level Questions

| Question | What they're really asking | Strong Answer Framework |
|----------|---------------------------|------------------------|
| "Tell me about a time you made a major architectural decision that turned out to be wrong" | Do you have humility + learning mindset? | Situation → Decision → Impact → What you'd do differently |
| "How do you handle a team member who consistently delivers poor code?" | Can you lead without authority? | Feedback → Coaching → PIP → Escalation; emphasize empathy first |
| "Describe how you've improved engineering culture" | Are you a force multiplier? | Concrete initiatives: code reviews, ADRs, docs, onboarding, tech debt roadmaps |
| "Tell me about a time you disagreed with your manager and how you handled it" | Do you have backbone + respect? | Present data, disagree constructively, commit once decided |
| "How do you decide what tech debt to pay down vs. new features?" | Business acumen + engineering judgment | Risk assessment, ROI, use OKRs/tech radar, communicate to PM |
| "How do you keep your team motivated during a legacy migration?" | EQ + leadership | Small wins, show progress, autonomy, connect to mission |

---

## 16. Company-Specific Focus Areas

### 🟡 Amazon
- **Leadership Principles** — every answer must map to one (Customer Obsession, Ownership, Dive Deep)
- Data structures & algorithms (LeetCode medium/hard)
- Distributed systems: CAP theorem, eventual consistency
- **Favorite Q:** *Design an order processing system that handles 1M orders/day*

### 🔵 Google
- Algorithm mastery: graphs, dynamic programming, trees
- Scalability: "Design Google Maps / YouTube recommendations"
- **Code quality:** clean, tested, handles edge cases
- **Favorite Q:** *Implement a trie; then make it autocomplete with ranking*

### 🟠 Meta/Facebook
- React internals, Virtual DOM, reconciliation
- Product sense: "How would you improve Facebook's news feed?"
- System design: real-time features (notifications, chat)
- **Favorite Q:** *Design a news feed with 1B users*

### ⬛ Netflix
- Resilience patterns: circuit breaker, bulkhead, fallback
- A/B testing infrastructure
- Performance at scale (CDN, adaptive bitrate)
- **Favorite Q:** *How would you optimize video startup time?*

### 🔴 Apple
- Privacy-first architecture
- Performance optimization, Core Web Vitals
- Accessibility (ARIA, keyboard nav, screen readers)
- **Favorite Q:** *How would you build a privacy-respecting analytics system?*

### 🟢 Stripe
- Financial systems: idempotency, exactly-once semantics
- API design: versioning, backward compatibility
- Security: PCI compliance, tokenization
- **Favorite Q:** *Design a payment retry system that prevents double charges*

---

## ⚡ Quick-Fire Concepts (One-Line Answers)

| Concept | Answer |
|---------|--------|
| What is `this` in JS? | Determined at call time (not definition), except arrow functions which use lexical `this` |
| WeakMap vs Map | WeakMap keys are weakly held (GC-able), no iteration; Map has strong keys, iterable |
| Generator vs Async function | Generator: synchronous, pull-based, yields values; Async: built on Promise + generator syntax |
| `structuredClone` vs JSON.parse(JSON.stringify) | `structuredClone` handles Date, Map, Set, circular refs; JSON doesn't |
| Tree shaking | Dead code elimination by bundler; requires ES modules (static imports) |
| Microfrontend tradeoffs | Autonomy + independent deploy vs. bundle duplication, shared state complexity |
| RAIL model | Response <100ms, Animation 60fps/16ms, Idle 50ms chunks, Load <1s interactive |
| CSP nonce | Random token in both HTTP header and script tag; prevents unauthorized script execution |

---

*Last updated: 2025 | Covers ECMAScript 2024 | Node.js 22 LTS*