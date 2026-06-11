# TypeScript & JavaScript — Senior Dev Interview Prep
> iGaming / PixiJS Frontend Context | Hinglish Notes

---

## TABLE OF CONTENTS

1. [JavaScript Core Concepts](#1-javascript-core-concepts)
2. [Execution Context, Call Stack & Event Loop](#2-execution-context-call-stack--event-loop)
3. [Closures & Scope](#3-closures--scope)
4. [Prototypes & Inheritance](#4-prototypes--inheritance)
5. [Async JavaScript — Promises, Async/Await](#5-async-javascript--promises-asyncawait)
6. [ES6+ Features — Must Know](#6-es6-features--must-know)
7. [TypeScript — Core Concepts](#7-typescript--core-concepts)
8. [TypeScript — Advanced Types](#8-typescript--advanced-types)
9. [TypeScript — Generics](#9-typescript--generics)
10. [TypeScript — Decorators](#10-typescript--decorators)
11. [Design Patterns — iGaming Context](#11-design-patterns--igaming-context)
12. [Memory Management & Performance](#12-memory-management--performance)
13. [Error Handling](#13-error-handling)
14. [Modules & Bundling](#14-modules--bundling)
15. [DSA — Slot Game Context](#15-dsa--slot-game-context)
16. [Interview Q&A — Full Set](#16-interview-qa--full-set)
17. [Quick Reference Cheat Sheet](#17-quick-reference-cheat-sheet)

---

## 1. JavaScript Core Concepts

### var vs let vs const

```javascript
// var — function scoped, hoisted with undefined
function test() {
  console.log(x); // undefined (hoisted)
  var x = 10;
  if (true) {
    var x = 20; // SAME variable — leaks out of if block
  }
  console.log(x); // 20 — bug!
}

// let — block scoped, hoisted but TDZ (Temporal Dead Zone)
function test2() {
  // console.log(y); // ReferenceError — TDZ
  let y = 10;
  if (true) {
    let y = 20; // Different variable — block scope
  }
  console.log(y); // 10 — correct
}

// const — block scoped, must initialize, reference immutable
const obj = { a: 1 };
obj.a = 2;       // ✅ OK — object contents change ho sakte hain
// obj = {};     // ❌ Error — reference nahi badal sakta

// Interview trick:
const arr = [1, 2, 3];
arr.push(4);     // ✅ Works — array ka reference same hai
```

### Hoisting

```javascript
// Function declarations fully hoisted hoti hain
sayHello(); // ✅ Works!
function sayHello() { console.log('Hello'); }

// Function expressions hoisted nahi hoti
// sayHi(); // ❌ TypeError: sayHi is not a function
var sayHi = function() { console.log('Hi'); };

// Class declarations — hoisted but TDZ (var jaisi nahi)
// const p = new Person(); // ❌ ReferenceError
class Person {}
```

### Type Coercion (Confusing Parts)

```javascript
// Loose equality ==
0 == false     // true  (coercion)
'' == false    // true
null == undefined // true
null == 0      // false  ← trap!

// Always use === in production code

// typeof
typeof null        // 'object'  ← famous bug
typeof undefined   // 'undefined'
typeof function(){} // 'function'
typeof []          // 'object'  (Array.isArray use karo)
typeof NaN         // 'number'  ← NaN is a number!

// NaN check
NaN === NaN        // false  ← NaN kabhi equal nahi
Number.isNaN(NaN)  // true  ← correct way
isNaN('hello')     // true  ← bad! string ko coerce karta hai
Number.isNaN('hello') // false ← correct
```

### this Keyword

```javascript
// 1. Global context
console.log(this); // window (browser) / {} (Node strict)

// 2. Object method
const game = {
  name: 'SlotGame',
  getName() {
    return this.name; // 'SlotGame'
  }
};

// 3. Arrow function — this inherit karta hai lexical scope se
const game2 = {
  name: 'SlotGame',
  // Arrow function mein this = enclosing scope ka this
  getName: () => this.name, // undefined! (lexical this = global)

  // Regular method se callback
  startTimer() {
    setTimeout(() => {
      console.log(this.name); // ✅ 'SlotGame' — arrow captures this
    }, 1000);
  }
};

// 4. call / apply / bind
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const obj = { name: 'Vishnu' };

greet.call(obj, 'Hello', '!');      // 'Hello, Vishnu!'
greet.apply(obj, ['Hello', '!']);   // same — array mein args
const bound = greet.bind(obj);      // New function return karta hai
bound('Hi', '.');                   // 'Hi, Vishnu.'

// 5. Constructor (new)
function Game(name) {
  this.name = name; // this = naya object
}
const g = new Game('Slots'); // g.name = 'Slots'
```

---

## 2. Execution Context, Call Stack & Event Loop

### Execution Context

```
Har function call ek Execution Context create karta hai:
  - Variable Environment (variables, function declarations)
  - Scope Chain (outer references)
  - this binding

Global EC → Function EC → Nested Function EC
```

### Call Stack

```javascript
function c() { console.log('c'); }
function b() { c(); }
function a() { b(); }
a();

// Call Stack (LIFO):
// [a] → [a, b] → [a, b, c] → [a, b] → [a] → []
```

### Event Loop — The Most Important Concept

```
┌─────────────────────────────────────────┐
│           CALL STACK                    │
│  (synchronous code runs here)           │
└─────────────────────────────────────────┘
           ↑ Event Loop picks from queue
┌─────────────────────────────────────────┐
│         MICROTASK QUEUE                 │
│  Promise.then / catch / finally         │
│  queueMicrotask()                       │
│  MutationObserver                       │
│  (Higher priority — checked FIRST)      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         MACROTASK QUEUE (Task Queue)    │
│  setTimeout / setInterval               │
│  DOM events                             │
│  fetch callbacks                        │
│  MessageChannel                         │
└─────────────────────────────────────────┘
```

### Event Loop Order — Classic Interview Question

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);  // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4');

// Output: 1, 4, 3, 2
// Reason:
// Sync: 1, 4
// Microtask queue: 3 (Promise.then — pehle)
// Macrotask queue: 2 (setTimeout — baad mein)
```

### Tricky Event Loop

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => console.log('promise 1'))
  .then(() => console.log('promise 2'));

console.log('end');

// Output:
// start
// end
// promise 1
// promise 2
// timeout 1
// promise inside timeout  ← microtask drain hoti hai after each macrotask
```

---

## 3. Closures & Scope

### Closure Kya Hai?

> Function apne outer scope ke variables ko yaad rakhta hai — even after outer function execute ho chuki ho.

```javascript
function makeCounter() {
  let count = 0; // Outer variable
  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.getCount(); // 2

// count variable — closure mein "trapped" hai
// makeCounter khatam ho gaya, lekin count still accessible hai
```

### Classic Closure Trap — Loop

```javascript
// WRONG — sab 3 print karte hain
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}
// var hoisted hai — ek hi i exist karta hai

// FIX 1: let use karo (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// FIX 2: IIFE closure
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i); // 0, 1, 2
}
```

### Closure iGaming Use Case

```javascript
// Game config closure — private state
function createGameConfig(gameId) {
  const _config = {
    rtp: 96.5,
    maxBet: 5,
    features: ['freespins', 'wild']
  };

  return {
    getRTP: () => _config.rtp,
    getMaxBet: () => _config.maxBet,
    hasFeature: (f) => _config.features.includes(f),
    // _config directly accessible nahi — encapsulated
  };
}
```

### Scope Chain

```javascript
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';
    // inner can access: innerVar, outerVar, globalVar
    console.log(globalVar, outerVar, innerVar); // All work
  }

  // outer can access: outerVar, globalVar
  // outer CANNOT access: innerVar
}
```

---

## 4. Prototypes & Inheritance

### Prototype Chain

```javascript
// Har object mein __proto__ hota hai
const arr = [1, 2, 3];
// arr.__proto__ === Array.prototype
// Array.prototype.__proto__ === Object.prototype
// Object.prototype.__proto__ === null

// Property lookup: arr pe find karo → Array.prototype pe → Object.prototype pe → null
```

### Prototypal Inheritance (Old Way)

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Parent constructor call
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const dog = new Dog('Rex', 'Lab');
dog.speak(); // "Rex makes a sound" — inherited
dog.bark();  // "Rex barks!"
```

### ES6 Classes (Syntactic Sugar — Same Prototype Under Hood)

```javascript
class Animal {
  #name; // Private field (ES2022)

  constructor(name) {
    this.#name = name;
  }

  speak() {
    return `${this.#name} makes a sound`;
  }

  get name() { return this.#name; } // Getter
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);       // Parent constructor — zaruri hai
    this.breed = breed;
  }

  bark() {
    return `${this.name} barks!`; // getter use kiya
  }

  // Method override
  speak() {
    return super.speak() + ' (woof)'; // Parent method call
  }
}
```

### Object.create vs new vs {}

```javascript
// Object.create — specify prototype
const proto = { greet() { return 'Hello'; } };
const obj = Object.create(proto);
obj.greet(); // 'Hello'

// Object.create(null) — no prototype (pure dictionary)
const dict = Object.create(null);
dict.hasOwnProperty; // undefined — no inherited methods

// Useful for config maps jo prototype chain se pollute na hon
```

---

## 5. Async JavaScript — Promises, Async/Await

### Promise States

```
Pending → Fulfilled (resolve called)
        → Rejected  (reject called)

Once settled, state nahi badlta.
```

### Promise Chaining

```javascript
fetch('/api/spin')
  .then(res => {
    if (!res.ok) throw new Error('Network error');
    return res.json(); // Promise return karo
  })
  .then(data => {
    processSpinResult(data);
    return data;
  })
  .catch(err => {
    console.error('Spin failed:', err);
    // Agar catch return kare, chain continue hoti hai
  })
  .finally(() => {
    hideLoadingSpinner(); // Hamesha run hoga
  });
```

### Promise.all vs Promise.allSettled vs Promise.race vs Promise.any

```javascript
const p1 = fetch('/api/config');
const p2 = fetch('/api/assets');
const p3 = fetch('/api/rtp');

// Promise.all — sab resolve hone chahiye, ek bhi reject → catch
await Promise.all([p1, p2, p3]);
// Use: Parallel loading, sab zaroori hain

// Promise.allSettled — sab ka result chahiye, fail ho ya pass
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  if (r.status === 'rejected') log(r.reason);
});
// Use: Optional parallel requests

// Promise.race — jo pehle settle ho (fulfilled ya rejected)
await Promise.race([fetch('/api/1'), fetch('/api/2')]);
// Use: Timeout implementation

// Promise.any — jo pehle FULFILL ho (reject ignore)
await Promise.any([primaryAPI, backupAPI, fallbackAPI]);
// Use: Multiple fallback sources
```

### Async/Await

```javascript
// async function hamesha Promise return karta hai
async function loadGame() {
  try {
    const config = await fetch('/api/config').then(r => r.json());
    const assets = await loadAssets(config.assetUrl);
    return { config, assets };
  } catch (err) {
    throw new GameLoadError(err.message);
  }
}

// Parallel execution — DO NOT chain awaits unnecessarily
// SLOW (sequential):
const a = await fetchA(); // fetchB A ke baad start hoga
const b = await fetchB();

// FAST (parallel):
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### Common Async Mistakes

```javascript
// 1. Forgot to await
async function bad() {
  const data = fetch('/api'); // Promise return hoga, data nahi!
  console.log(data); // Promise {<pending>}
}

// 2. forEach with async — await kaam nahi karta!
const ids = [1, 2, 3];
// WRONG:
ids.forEach(async (id) => {
  await processId(id); // forEach async await ka wait nahi karta
});

// RIGHT:
await Promise.all(ids.map(id => processId(id))); // Parallel
// ya
for (const id of ids) { await processId(id); }  // Sequential

// 3. Unhandled promise rejection
fetch('/api').then(doSomething); // No .catch — dangerous!
// Always: .catch ya try/catch in async
```

---

## 6. ES6+ Features — Must Know

### Destructuring

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// Object destructuring
const { name, age, city = 'Noida' } = user; // Default value
const { name: playerName } = user; // Rename

// Nested
const { features: { freeSpins, wilds } } = gameConfig;

// Function params
function spin({ betAmount, lines = 25, autoplay = false }) {
  // ...
}
spin({ betAmount: 1 }); // lines and autoplay have defaults
```

### Spread & Rest

```javascript
// Spread — array/object expand karo
const newArr = [...arr1, ...arr2];
const newObj = { ...obj1, ...obj2, extraProp: true };

// Shallow copy (deep nahi!)
const copy = { ...original }; // Nested objects still referenced

// Rest — remaining collect karo
function sum(first, ...numbers) {
  return first + numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

### Optional Chaining & Nullish Coalescing

```javascript
// Optional chaining ?.
const city = user?.address?.city; // undefined if any null/undefined
const first = arr?.[0];           // Array access
const result = obj?.method?.();   // Method call

// Without it:
const city = user && user.address && user.address.city; // Verbose

// Nullish coalescing ?? — only null/undefined check
const name = user.name ?? 'Guest';     // '' ya 0 valid maano
const bet = config.bet ?? 1.00;

// vs || — falsy check (0, '', false bhi replace hote hain)
const bet = config.bet || 1.00; // config.bet = 0 → 1.00 (bug!)
const bet = config.bet ?? 1.00; // config.bet = 0 → 0 (correct)
```

### Map, Filter, Reduce

```javascript
const symbols = [0, 1, 2, 1, 3, 1, 0];

// filter — condition true wale
const wilds = symbols.filter(s => s === 1); // [1, 1, 1]

// map — transform har element
const names = symbols.map(s => SYMBOL_NAMES[s]); // ['cherry', 'wild', ...]

// reduce — accumulate
const wildCount = symbols.reduce((acc, s) => s === 1 ? acc + 1 : acc, 0); // 3

// find — pehla match
const firstWild = symbols.find(s => s === 1); // 1

// findIndex
const firstWildIdx = symbols.findIndex(s => s === 1); // 1

// some / every
const hasWild = symbols.some(s => s === 1);   // true
const allWild = symbols.every(s => s === 1);  // false

// flat / flatMap
const grid = [[0,1],[2,3],[1,0]];
const flat = grid.flat(); // [0,1,2,3,1,0]
```

### Symbol, WeakMap, WeakRef

```javascript
// Symbol — unique identifier, never collides
const SPIN_EVENT = Symbol('spin');
const SPIN_EVENT2 = Symbol('spin');
SPIN_EVENT === SPIN_EVENT2; // false — unique!

// Use: Private-ish object keys, event names

// WeakMap — keys weak reference (GC kar sakta hai)
const spriteCache = new WeakMap();
spriteCache.set(gameObject, sprite); // gameObject destroy ho → auto cleanup

// WeakRef — object ka weak reference
const ref = new WeakRef(hugeObject);
const obj = ref.deref(); // null agar GC ho gaya
if (obj) obj.doSomething();
```

### Generators (Async Flow Control)

```javascript
function* spinSequence() {
  yield 'SPIN_START';
  yield 'REELS_SPINNING';
  yield 'REELS_STOPPED';
  yield 'WIN_PRESENTATION';
  return 'IDLE';
}

const gen = spinSequence();
gen.next().value; // 'SPIN_START'
gen.next().value; // 'REELS_SPINNING'
// ...

// Async generator — streaming data
async function* jackpotFeed(ws) {
  while (true) {
    const data = await waitForMessage(ws);
    yield JSON.parse(data);
  }
}
```

---

## 7. TypeScript — Core Concepts

### Basic Types

```typescript
// Primitives
let name: string = 'Vishnu';
let age: number = 27;
let active: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;

// Arrays
let scores: number[] = [1, 2, 3];
let names: Array<string> = ['a', 'b'];

// Tuple — fixed length, fixed types
let reel: [number, number, number] = [3, 7, 1];
let entry: [string, number] = ['WILD', 5];

// Enum
enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  RESULT = 'RESULT',
  FEATURE = 'FEATURE'
}
let state: GameState = GameState.IDLE;

// Any (avoid karo!)
let val: any = 'anything'; // Type safety lost

// Unknown (better than any)
let input: unknown = getData();
if (typeof input === 'string') input.toUpperCase(); // Type guard required

// Never — function jo kabhi return nahi karta
function throwError(msg: string): never {
  throw new Error(msg);
}
```

### Interfaces vs Types

```typescript
// Interface — object shapes ke liye, extendable
interface Symbol {
  id: number;
  name: string;
  value: number;
  isWild?: boolean; // Optional property
  readonly tier: string; // Read only
}

// Interface extend karo
interface AnimatedSymbol extends Symbol {
  animation: string;
  duration: number;
}

// Interface merge hoti hain (Declaration Merging)
interface Symbol { color: string; } // Adds to existing Symbol!

// Type alias — har cheez ke liye
type SymbolId = number;
type ReelStrip = number[];
type WinCallback = (amount: number) => void;
type Nullable<T> = T | null;

// Type se union/intersection
type Result = { wins: Win[] } | { error: string }; // Union
type Admin = User & { adminLevel: number };          // Intersection

// Kab use karein?
// Interface: Object shapes, class implementation, extendable structures
// Type: Primitives, unions, intersections, computed types
```

### Union & Intersection Types

```typescript
// Union — ek ya doosra
type SymbolType = 'WILD' | 'SCATTER' | 'BONUS' | 'NORMAL';
type StringOrNumber = string | number;

function setBalance(amount: string | number) {
  if (typeof amount === 'string') {
    return parseFloat(amount); // Type narrowed to string
  }
  return amount; // Type narrowed to number
}

// Intersection — dono combine
type Loggable = { log(): void };
type Serializable = { serialize(): string };
type Feature = Loggable & Serializable & { name: string };
```

### Type Guards

```typescript
// typeof guard
function process(val: string | number) {
  if (typeof val === 'string') {
    return val.toUpperCase(); // string methods available
  }
  return val.toFixed(2); // number methods available
}

// instanceof guard
function handleFeature(feature: FreeSpins | HoldSpin) {
  if (feature instanceof FreeSpins) {
    feature.spinsRemaining; // FreeSpins specific
  }
}

// Custom type guard (is keyword)
interface Wild { type: 'wild'; multiplier: number; }
interface Scatter { type: 'scatter'; count: number; }

function isWild(symbol: Wild | Scatter): symbol is Wild {
  return symbol.type === 'wild';
}

// Discriminated union — best pattern
type GameEvent =
  | { kind: 'SPIN'; betAmount: number }
  | { kind: 'WIN'; amount: number; lines: number[] }
  | { kind: 'FEATURE'; featureName: string };

function handle(event: GameEvent) {
  switch (event.kind) {
    case 'SPIN': event.betAmount; break;  // Narrowed
    case 'WIN': event.amount; break;       // Narrowed
    case 'FEATURE': event.featureName; break; // Narrowed
  }
}
```

---

## 8. TypeScript — Advanced Types

### Utility Types (Built-in)

```typescript
interface SpinConfig {
  betAmount: number;
  lines: number;
  currency: string;
  autoplay: boolean;
}

// Partial — sab optional
type PartialConfig = Partial<SpinConfig>;
// { betAmount?: number; lines?: number; ... }

// Required — sab required
type RequiredConfig = Required<PartialConfig>;

// Readonly — sab readonly
type FrozenConfig = Readonly<SpinConfig>;
const config: FrozenConfig = { betAmount: 1, lines: 25, currency: 'CAD', autoplay: false };
// config.betAmount = 2; // Error!

// Pick — kuch properties lo
type BetOnly = Pick<SpinConfig, 'betAmount' | 'currency'>;

// Omit — kuch properties chodo
type NoBet = Omit<SpinConfig, 'betAmount'>;

// Record — key-value map type
type SymbolMap = Record<string, number>; // { [key: string]: number }
type MarketConfig = Record<'CAD' | 'USD' | 'GBP', { maxBet: number; rtp: number }>;

// ReturnType — function return type nikalo
function getSymbolData() { return { id: 1, name: 'wild' }; }
type SymbolData = ReturnType<typeof getSymbolData>; // { id: number; name: string }

// Parameters — function params type
type SpinParams = Parameters<typeof spin>; // [betAmount: number, lines: number]

// Exclude / Extract
type NonWild = Exclude<SymbolType, 'WILD'>; // 'SCATTER' | 'BONUS' | 'NORMAL'
type OnlySpecial = Extract<SymbolType, 'WILD' | 'SCATTER'>; // 'WILD' | 'SCATTER'

// NonNullable
type SafeId = NonNullable<number | null | undefined>; // number
```

### Mapped Types

```typescript
// Har property ko transform karo
type Optional<T> = {
  [K in keyof T]?: T[K]; // Partial ka manual version
};

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// SpinConfig se getters banao:
// { getBetAmount: () => number; getLines: () => number; ... }

// Conditional mapped
type ReadonlyIf<T, Condition extends boolean> = Condition extends true
  ? Readonly<T>
  : T;
```

### Conditional Types

```typescript
// T extends U ? X : Y
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// infer — type extract karo
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type StringResult = UnwrapPromise<Promise<string>>; // string
type NumberResult = UnwrapPromise<number>;           // number (not promise)

// Array element type
type ElementType<T> = T extends (infer U)[] ? U : never;
type SymType = ElementType<Symbol[]>; // Symbol
```

### Template Literal Types

```typescript
type Direction = 'top' | 'bottom' | 'left' | 'right';
type EventName = `on${Capitalize<Direction>}`;
// 'onTop' | 'onBottom' | 'onLeft' | 'onRight'

type ApiRoute = `/api/${string}`;
const route: ApiRoute = '/api/spin'; // ✅
// const bad: ApiRoute = 'spin'; // ❌
```

---

## 9. TypeScript — Generics

### Basic Generics

```typescript
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);          // number
first(['a', 'b']);         // string
first<boolean>([true]);    // explicit

// Generic interface
interface Pool<T> {
  get(): T;
  release(item: T): void;
  size: number;
}

// Generic class
class ObjectPool<T> {
  private pool: T[] = [];

  constructor(private factory: () => T, initialSize: number) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  get(): T {
    return this.pool.pop() ?? this.factory();
  }

  release(item: T): void {
    this.pool.push(item);
  }
}

const spritePool = new ObjectPool(() => new PIXI.Sprite(), 50);
```

### Generic Constraints

```typescript
// T must have certain properties
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const sym = { id: 1, name: 'wild', value: 10 };
getProperty(sym, 'name');  // ✅ string
getProperty(sym, 'value'); // ✅ number
// getProperty(sym, 'xyz'); // ❌ Error — 'xyz' not in sym

// Constraint with interface
interface Identifiable { id: number; }
function findById<T extends Identifiable>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
```

### Generic Utility Patterns

```typescript
// EventEmitter generic
class EventEmitter<Events extends Record<string, any>> {
  private handlers: Partial<{ [K in keyof Events]: ((data: Events[K]) => void)[] }> = {};

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void) {
    (this.handlers[event] ??= []).push(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.handlers[event]?.forEach(h => h(data));
  }
}

// Fully type-safe!
type GameEvents = {
  spin: { betAmount: number };
  win: { amount: number };
  featureTrigger: { name: string };
};

const emitter = new EventEmitter<GameEvents>();
emitter.on('win', ({ amount }) => console.log(amount));  // ✅ typed
// emitter.on('xyz', () => {}); // ❌ Error
```

---

## 10. TypeScript — Decorators

```typescript
// Decorator = function jo class/method/property ko wrap karta hai
// tsconfig: "experimentalDecorators": true

// Class decorator
function Singleton<T extends new (...args: any[]) => {}>(constructor: T) {
  let instance: InstanceType<T>;
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this as any;
    }
  };
}

@Singleton
class AudioManager {
  play(sound: string) { /* ... */ }
}

// Method decorator
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`${key} called with`, args);
    const result = original.apply(this, args);
    console.log(`${key} returned`, result);
    return result;
  };
  return descriptor;
}

class GameAPI {
  @Log
  spin(betAmount: number) { return { wins: [] }; }
}

// Property decorator
function Validate(min: number, max: number) {
  return function(target: any, key: string) {
    let val: number;
    Object.defineProperty(target, key, {
      get: () => val,
      set: (newVal: number) => {
        if (newVal < min || newVal > max)
          throw new Error(`${key} must be ${min}–${max}`);
        val = newVal;
      }
    });
  };
}

class BetPanel {
  @Validate(0.01, 5.00)
  betAmount: number = 1.00;
}
```

---

## 11. Design Patterns — iGaming Context

### Observer Pattern (Event System)

```typescript
// Slot games mein sabse zyada use hota hai
type Handler<T> = (data: T) => void;

class EventBus {
  private static instance: EventBus;
  private events = new Map<string, Handler<any>[]>();

  static getInstance() {
    return (this.instance ??= new EventBus());
  }

  on<T>(event: string, handler: Handler<T>) {
    const handlers = this.events.get(event) ?? [];
    handlers.push(handler);
    this.events.set(event, handlers);
    return () => this.off(event, handler); // Unsubscribe fn return karo
  }

  off<T>(event: string, handler: Handler<T>) {
    const handlers = this.events.get(event) ?? [];
    this.events.set(event, handlers.filter(h => h !== handler));
  }

  emit<T>(event: string, data: T) {
    this.events.get(event)?.forEach(h => h(data));
  }
}

// Use:
const bus = EventBus.getInstance();
const unsub = bus.on<{ amount: number }>('win', ({ amount }) => {
  updateWinDisplay(amount);
});
// Later:
unsub(); // Memory leak avoid karo!
```

### State Pattern (Game State Machine)

```typescript
interface State {
  enter(): void;
  exit(): void;
  update(delta: number): void;
}

class IdleState implements State {
  constructor(private game: SlotGame) {}
  enter() { this.game.ui.enableSpinButton(); }
  exit() { this.game.ui.disableSpinButton(); }
  update(delta: number) { /* idle animations */ }
}

class SpinningState implements State {
  enter() { this.game.reels.startSpin(); }
  exit() { /* cleanup */ }
  update(delta: number) { this.game.reels.update(delta); }
}

class GameStateMachine {
  private current: State;
  private states = new Map<string, State>();

  register(name: string, state: State) {
    this.states.set(name, state);
  }

  transition(name: string) {
    this.current?.exit();
    this.current = this.states.get(name)!;
    this.current.enter();
  }

  update(delta: number) {
    this.current?.update(delta);
  }
}
```

### Command Pattern (Undo/Replay)

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class SpinCommand implements Command {
  private previousBalance: number;

  constructor(private game: SlotGame, private betAmount: number) {}

  execute() {
    this.previousBalance = this.game.balance;
    this.game.spin(this.betAmount);
  }

  undo() {
    this.game.balance = this.previousBalance; // Demo purposes
  }
}

// Use for replay systems, undo operations
```

### Factory Pattern (Feature Creation)

```typescript
abstract class Feature {
  abstract activate(): void;
  abstract deactivate(): void;
}

class FeatureFactory {
  static create(type: string, config: any): Feature {
    switch (type) {
      case 'FREE_SPINS': return new FreeSpinsFeature(config);
      case 'HOLD_SPIN':  return new HoldSpinFeature(config);
      case 'CASCADE':    return new CascadeFeature(config);
      default: throw new Error(`Unknown feature: ${type}`);
    }
  }
}

// Server response se feature create karo
const feature = FeatureFactory.create(
  serverResponse.featureType,
  serverResponse.featureConfig
);
feature.activate();
```

### Singleton Pattern

```typescript
class AudioManager {
  private static _instance: AudioManager;
  private context: AudioContext;

  private constructor() {
    this.context = new AudioContext();
  }

  static get instance(): AudioManager {
    return (this._instance ??= new AudioManager());
  }

  play(soundId: string) { /* ... */ }
}

// Use:
AudioManager.instance.play('spin_start');
// Ek hi instance — kabhi `new AudioManager()` nahi
```

---

## 12. Memory Management & Performance

### Garbage Collection

```javascript
// GC automatic hai — lekin reference rakho to GC nahi kar sakta

// Memory leak — event listener remove nahi kiya
class BadComponent {
  init() {
    window.addEventListener('resize', this.onResize); // Leak!
  }
  // destroy mein remove nahi kiya
}

// Fix:
class GoodComponent {
  private boundResize = this.onResize.bind(this);
  init() { window.addEventListener('resize', this.boundResize); }
  destroy() { window.removeEventListener('resize', this.boundResize); }
}
```

### Common Memory Leaks in Slots

```javascript
// 1. Ticker callbacks remove nahi kiye
app.ticker.add(this.update, this);
// Destroy pe:
app.ticker.remove(this.update, this);

// 2. PIXI objects destroy nahi kiye
const sprite = new PIXI.Sprite(texture);
container.addChild(sprite);
// Remove pe:
sprite.destroy({ children: true, texture: false }); // texture pool mein hai

// 3. Interval/timeout clear nahi kiya
const timer = setInterval(updateMeter, 100);
// Feature khatam pe:
clearInterval(timer);

// 4. WebSocket close nahi kiya
ws.close();

// 5. Promise reject handle nahi kiya
// Always .catch() ya try/catch lagao

// 6. Large array references
let reelHistory = []; // Unlimited growth
// Fix: Max size maintain karo
if (reelHistory.length > 1000) reelHistory = reelHistory.slice(-100);
```

### Performance Patterns

```javascript
// Debounce — rapid calls me sirf last call execute karo
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onResize = debounce(handleResize, 200);

// Throttle — N ms mein max ek call
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoize — expensive calculations cache karo
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const getWinMultiplier = memoize((symbolId, count) => {
  return WIN_TABLE[symbolId][count]; // Heavy lookup
});
```

---

## 13. Error Handling

### Custom Errors

```typescript
// Custom error classes
class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'GameError';
  }
}

class NetworkError extends GameError {
  constructor(message: string, public statusCode: number) {
    super(message, 'NETWORK_ERROR', true);
    this.name = 'NetworkError';
  }
}

class CriticalGameError extends GameError {
  constructor(message: string) {
    super(message, 'CRITICAL', false);
    this.name = 'CriticalGameError';
  }
}

// Use:
try {
  const data = await spinAPI();
} catch (err) {
  if (err instanceof NetworkError && err.recoverable) {
    showRetryDialog();
  } else if (err instanceof CriticalGameError) {
    showErrorScreen(); // Game band karo
  }
}
```

### Error Boundaries (Game Level)

```typescript
class GameErrorBoundary {
  wrap<T>(fn: () => T, fallback: T): T {
    try {
      return fn();
    } catch (err) {
      this.report(err);
      return fallback;
    }
  }

  async wrapAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.report(err);
      return fallback;
    }
  }

  private report(err: unknown) {
    console.error(err);
    // Sentry/analytics pe bhejo
  }
}
```

---

## 14. Modules & Bundling

### ES Modules

```typescript
// Named exports
export const MAX_BET = 5.00;
export function formatCurrency(amount: number) { /* ... */ }
export class ReelSystem { /* ... */ }

// Default export
export default class SlotGame { /* ... */ }

// Import
import SlotGame from './SlotGame';
import { MAX_BET, formatCurrency } from './constants';
import * as GameUtils from './utils'; // Namespace import

// Dynamic import (code splitting)
const { FreeSpinsFeature } = await import('./features/FreeSpins');
// Feature tab load karo jab zarurat ho — bundle size reduce
```

### Tree Shaking (Dead Code Elimination)

```typescript
// Named exports tree shake hoti hain
export function used() {}      // Bundle mein aayega
export function unused() {}    // Bundle se hatega (if not imported)

// Default exports less tree-shakeable hoti hain

// Side effects declare karo package.json mein:
// "sideEffects": false  → aggressive tree shaking
// "sideEffects": ["*.css"]  → CSS files keep karo
```

---

## 15. DSA — Slot Game Context

### Array Methods Complexity

| Method | Time | Note |
|---|---|---|
| `push / pop` | O(1) | Stack operations |
| `shift / unshift` | O(n) | Avoid in hot paths |
| `indexOf / find` | O(n) | Map use karo for frequent lookup |
| `sort` | O(n log n) | |
| `slice` | O(k) | k = slice size |
| `splice` | O(n) | |

### Useful Patterns

```javascript
// Circular buffer (reel strip simulation)
class CircularBuffer {
  constructor(data) {
    this.data = data;
    this.size = data.length;
  }

  get(index) {
    return this.data[((index % this.size) + this.size) % this.size];
  }
}

// BFS — Cluster detection (Cluster Pays)
function findCluster(grid, row, col, targetSymbol) {
  const visited = new Set();
  const queue = [[row, col]];
  const cluster = [];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];

  while (queue.length) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (grid[r][c] !== targetSymbol) continue;
    visited.add(key);
    cluster.push([r, c]);
    dirs.forEach(([dr, dc]) => queue.push([r+dr, c+dc]));
  }
  return cluster;
}

// Payline check
function checkPayline(grid, payline, minMatch = 3) {
  const symbols = payline.map(([r, c]) => grid[r][c]);
  const first = symbols[0];
  let count = 1;

  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i] === first || symbols[i] === WILD) count++;
    else break;
  }

  return count >= minMatch ? { symbol: first, count } : null;
}

// Ways to win (243 ways / Megaways)
function calculateWays(grid) {
  const wins = [];
  const SYMBOLS = [...new Set(grid.flat())].filter(s => s !== SCATTER);

  SYMBOLS.forEach(sym => {
    let ways = 1;
    let reelCount = 0;

    for (let col = 0; col < grid[0].length; col++) {
      const symbolsInReel = grid.map(row => row[col]);
      const matchCount = symbolsInReel.filter(s => s === sym || s === WILD).length;
      if (matchCount > 0) {
        ways *= matchCount;
        reelCount++;
      } else break;
    }

    if (reelCount >= 3) wins.push({ symbol: sym, ways, reelCount });
  });

  return wins;
}

// Shuffle (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deep clone (JSON trick — simple objects only)
const clone = JSON.parse(JSON.stringify(obj));

// Deep clone (structuredClone — modern)
const clone2 = structuredClone(obj);
```

---

## 16. Interview Q&A — Full Set

**Q: var, let, const mein kya difference hai?**
> `var` function-scoped hai aur hoisted hota hai `undefined` ke saath — block se leak hota hai. `let` aur `const` block-scoped hain, hoisted hote hain lekin TDZ mein rehte hain. `const` reference immutable karta hai — object contents change ho sakte hain. Production mein hamesha `const` prefer karo, zarurat par `let`, `var` kabhi nahi.

**Q: Event loop explain karo?**
> JS single-threaded hai — ek call stack hai. Async operations complete hone par callbacks queues mein jaate hain. Microtask queue (Promises, queueMicrotask) ko macrotask queue (setTimeout, DOM events) se pehle process kiya jaata hai. Event loop continuously check karta hai: stack empty? → microtasks drain karo → ek macrotask lo → repeat.

**Q: Closure kya hai?**
> Function apne outer lexical scope ke variables ko capture karta hai — even after outer function return ho jaye. Yeh private state create karne mein, callback mein data preserve karne mein, aur partial application mein use hota hai.

**Q: TypeScript mein `interface` vs `type` kab use karein?**
> `interface` object shapes ke liye prefer karo — extend ho sakta hai aur declaration merging support karta hai. `type` use karo unions, intersections, conditional types, aur primitives ke liye. Jab doubt ho aur object shape ho — `interface`.

**Q: Generics kyun use karte ho?**
> Type safety maintain karo bina code duplicate kiye. `ObjectPool<T>` ek hi implementation hai jo `Pool<Sprite>`, `Pool<Particle>`, `Pool<Sound>` sab ke liye kaam karta hai — aur TypeScript har use case mein correct types enforce karta hai.

**Q: Promise.all aur Promise.allSettled mein kya fark hai?**
> `Promise.all` ek bhi reject hone par fail ho jaata hai. `Promise.allSettled` sab settle hone tak wait karta hai — har promise ka individually status aur value/reason deta hai. Parallel game asset loading mein `allSettled` use karo taaki ek fail asset poora load stop na kare.

**Q: Memory leak kaise aate hain aur kaise prevent karein?**
> Main causes: event listeners remove nahi kiye, PIXI objects destroy nahi kiye, setInterval/setTimeout clear nahi kiya, WebSocket close nahi kiya, circular references. Prevention: destroy() mein sab cleanup karo, bounded functions store karo taaki remove ho sake, WeakMap use karo DOM references ke liye.

**Q: Design patterns kaunse use karte ho game mein?**
> Observer/EventBus — loose coupling ke liye between game systems. State Pattern — game state machine ke liye. Factory — server response se features create karne ke liye. Singleton — AudioManager, AssetManager ke liye. Object Pool — performance ke liye symbols aur particles mein.

**Q: async/await ke saath parallel execution kaise karo?**
> `await Promise.all([fn1(), fn2(), fn3()])` — sab parallel start ho jaate hain aur sab ke resolve hone par continue hota hai. Agar `await fn1(); await fn2();` likho to sequential hai — zyada slow.

**Q: `unknown` vs `any` kab use karein?**
> `any` type checking completely off kar deta hai — avoid karo. `unknown` safer hai — type narrow karne ke baad hi use kar sakte hain (typeof, instanceof check). External API response ya user input ke liye `unknown` use karo.

---

## 17. Quick Reference Cheat Sheet

### JS Concepts Map
```
Scope         → var (function) / let,const (block) / TDZ
Hoisting      → var: undefined / function: full / let,const: TDZ
this          → global / object method / class / arrow (lexical)
Closure       → function + outer scope variables
Prototype     → __proto__ chain → Object.prototype → null
Event Loop    → Call Stack → Microtasks → Macrotasks
Promise       → Pending → Fulfilled | Rejected
Async/Await   → Syntactic sugar over Promises
```

### TypeScript Quick Ref
```
Utility Types:
  Partial<T>        → sab optional
  Required<T>       → sab required
  Readonly<T>       → sab readonly
  Pick<T, K>        → kuch properties
  Omit<T, K>        → minus kuch properties
  Record<K, V>      → key-value map
  ReturnType<F>     → function return type
  Parameters<F>     → function params
  Exclude<T, U>     → T minus U
  NonNullable<T>    → null/undefined hata do

Type Guards:
  typeof x === 'string'
  x instanceof ClassName
  'property' in obj
  function isX(v): v is X { ... }
```

### Common Gotchas
```javascript
typeof null         // 'object'   (bug — known)
NaN === NaN         // false      (use Number.isNaN)
0 == false          // true       (use ===)
[] == false         // true       (use ===)
0.1 + 0.2 === 0.3  // false      (floating point)
[] + []             // ''         (coercion)
[] + {}             // '[object Object]'
{} + []             // 0          (block + unary)
```

### Array Methods
```
Mutating:    push, pop, shift, unshift, splice, sort, reverse, fill
Non-mutating: map, filter, reduce, find, findIndex, some, every,
              flat, flatMap, slice, concat, includes, indexOf
```

---

*Prepared for ZVKY / VLT client context | Senior TS/JS Developer*
*Covers: Core JS · TypeScript · Design Patterns · DSA · iGaming Context*