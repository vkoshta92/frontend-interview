# 🚀 JavaScript Interview Questions — Basic to Advanced
### Senior JS Developer Interview Prep | Hindi + English Logic Explanation

---

## 📌 TABLE OF CONTENTS
1. [Core JS Concepts](#1-core-js-concepts)
2. [Data Types & Type Coercion](#2-data-types--type-coercion)
3. [Functions & Closures](#3-functions--closures)
4. [Scope & Hoisting](#4-scope--hoisting)
5. [Promises & Async/Await](#5-promises--asyncawait)
6. [Prototypes & Inheritance](#6-prototypes--inheritance)
7. [ES6+ Features](#7-es6-features)
8. [Array Questions](#8-array-questions)
9. [String Questions](#9-string-questions)
10. [Tricky/Common Output Questions](#10-trickycommon-output-questions)

---

## 1. Core JS Concepts

---

### ❓ Q1. What is JavaScript? Is it single-threaded or multi-threaded?

**Answer:**
JavaScript ek **single-threaded**, interpreted scripting language hai. Matlab ek time pe sirf ek kaam hota hai.

> JavaScript is a **single-threaded** language — it has one call stack and one memory heap. It uses the **Event Loop** to handle async operations like timers, API calls, etc.

```js
console.log("Start");
setTimeout(() => console.log("Middle"), 0);
console.log("End");

// Output: Start → End → Middle
// Kyunki setTimeout callback Event Loop ke through jaata hai
```

---

### ❓ Q2. Explain the Event Loop

**Answer:**
Event Loop ek mechanism hai jo dekhta hai ki **Call Stack** khali hai ya nahi. Agar khali hai, to **Callback Queue** se next task utha leta hai.

```
Call Stack → Web APIs → Callback Queue → Event Loop → Call Stack
```

> **Microtask Queue** (Promises) ko **Macrotask Queue** (setTimeout) se pehle process kiya jaata hai.

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1 → 4 → 3 → 2
// Promise (microtask) setTimeout (macrotask) se pehle chalta hai
```

---

### ❓ Q3. `==` vs `===` difference kya hai?

**Answer:**

| Operator | Type Check | Example |
|----------|------------|---------|
| `==` | No (type coercion hoti hai) | `"5" == 5` → `true` |
| `===` | Yes (strict) | `"5" === 5` → `false` |

```js
console.log(0 == false);   // true  (coercion: false → 0)
console.log(0 === false);  // false (different types)
console.log(null == undefined);  // true
console.log(null === undefined); // false
```

> **Interview Tip:** Hamesha `===` use karo unless specifically coercion chahiye.

---

### ❓ Q4. `null` vs `undefined` vs `undeclared`?

```js
let a;           // undefined — declared but no value
let b = null;    // null — intentionally empty
// c             // undeclared — doesn't exist at all

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" ← ye JS ka famous bug hai!
console.log(null == undefined); // true
console.log(null === undefined); // false
```

---

## 2. Data Types & Type Coercion

---

### ❓ Q5. JavaScript mein kitne data types hain?

**Primitive (7):**
- `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`

**Non-Primitive (Reference):**
- `object`, `array`, `function`

```js
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" ← bug!
typeof Symbol()    // "symbol"
typeof 42n         // "bigint"
typeof {}          // "object"
typeof []          // "object" ← array bhi object hai!
typeof function(){} // "function"
```

---

### ❓ Q6. Type Coercion kya hota hai?

```js
console.log(1 + "2");    // "12"  → number string ban gaya
console.log("5" - 2);   // 3     → string number ban gaya
console.log(true + 1);  // 2     → true = 1
console.log(false + "1"); // "false1"
console.log([] + []);   // ""
console.log({} + []);   // "[object Object]"
console.log([] + {});   // "[object Object]"
```

---

## 3. Functions & Closures

---

### ❓ Q7. Closure kya hai? Real world example do.

**Answer:**
Closure tab banta hai jab ek **inner function** apne **outer function ke variables** ko yaad rakhta hai, even after outer function execute ho chuka ho.

```js
function counter() {
  let count = 0; // ye variable outer scope mein hai

  return function () {
    count++; // inner function outer ka variable access kar raha hai
    return count;
  };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
// count variable "close" ho gaya inner function ke saath
```

**Real World Use:** Private variables, memoization, event handlers.

---

### ❓ Q8. Function Declaration vs Expression vs Arrow Function?

```js
// Function Declaration — hoisted hoti hai
function greet() { return "Hello"; }

// Function Expression — hoisted NAHI hoti
const greet2 = function() { return "Hello"; };

// Arrow Function — `this` bind nahi karta
const greet3 = () => "Hello";

// Arrow function mein `this` lexically bind hota hai
function Person() {
  this.age = 0;
  setInterval(() => {
    this.age++; // arrow fn mein `this` = Person instance
  }, 1000);
}
```

---

### ❓ Q9. IIFE kya hai?

**Immediately Invoked Function Expression** — define karte hi execute ho jaata hai.

```js
(function () {
  let secret = "hidden";
  console.log("I run immediately!");
})();

// secret bahar accessible nahi — private scope banta hai
```

---

### ❓ Q10. `call`, `apply`, `bind` difference?

```js
function greet(city, country) {
  return `${this.name} from ${city}, ${country}`;
}

const user = { name: "Ali" };

// call — arguments comma se
greet.call(user, "Karachi", "Pakistan");

// apply — arguments array mein
greet.apply(user, ["Karachi", "Pakistan"]);

// bind — new function return karta hai, call baad mein
const boundGreet = greet.bind(user, "Karachi");
boundGreet("Pakistan");
```

---

## 4. Scope & Hoisting

---

### ❓ Q11. `var`, `let`, `const` ka difference?

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Re-declare | Yes | No | No |
| Re-assign | Yes | Yes | No |

```js
console.log(a); // undefined (hoisted)
var a = 5;

console.log(b); // ReferenceError (TDZ)
let b = 10;
```

---

### ❓ Q12. Hoisting kya hai?

**Answer:**
JS engine code run karne se pehle **declarations ko upar le jaata hai** — yahi hoisting hai.

```js
// Ye code aisa behave karta hai jaise:
greet(); // "Hello!" — works!
function greet() { console.log("Hello!"); }

// But:
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log("Hi!"); };
// var hoisted hua (undefined), function expression nahi
```

---

### ❓ Q13. Classic Closure + Loop Bug

```js
// BUG — var use karne se
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (kyunki var function-scoped hai)

// FIX 1 — let use karo
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅

// FIX 2 — IIFE use karo
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

---

## 5. Promises & Async/Await

---

### ❓ Q14. Promise kya hai? States kya hain?

**Promise** ek object hai jo future mein milne wali value represent karta hai.

**3 States:**
- `pending` — abhi kuch nahi hua
- `fulfilled` — kaam ho gaya (resolve)
- `rejected` — kuch galat hua (reject)

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Data mila!");
  else reject("Error aaya!");
});

promise
  .then(data => console.log(data))     // fulfilled
  .catch(err => console.error(err))    // rejected
  .finally(() => console.log("Done")); // hamesha chalta hai
```

---

### ❓ Q15. `Promise.all` vs `Promise.race` vs `Promise.allSettled`?

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.reject("Error");

// Promise.all — sab resolve ho toh hi result, ek fail toh sab fail
Promise.all([p1, p2]).then(console.log); // [1, 2]
Promise.all([p1, p3]).catch(console.log); // "Error"

// Promise.race — jo pehle settle ho (resolve ya reject)
Promise.race([p1, p2]).then(console.log); // 1

// Promise.allSettled — sab ka result, chaahe fail ho ya pass
Promise.allSettled([p1, p3]).then(console.log);
// [{status:"fulfilled", value:1}, {status:"rejected", reason:"Error"}]
```

---

### ❓ Q16. Async/Await kya hai?

Promises ko **synchronous jaise** likhne ka tarika.

```js
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Parallel execution — dono ek saath shuru honge
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
}
```

---

## 6. Prototypes & Inheritance

---

### ❓ Q17. Prototype chain kya hai?

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

const dog = new Animal("Dog");
dog.speak(); // "Dog makes a sound"

// dog apne prototype pe jaake speak dhundh leta hai
console.log(dog.__proto__ === Animal.prototype); // true
```

---

### ❓ Q18. `Object.create` vs `new` keyword?

```js
// new keyword
function Car(model) { this.model = model; }
const car1 = new Car("Toyota");

// Object.create — prototype directly set karo
const proto = {
  greet() { return `I am ${this.name}`; }
};
const obj = Object.create(proto);
obj.name = "Ali";
obj.greet(); // "I am Ali"
```

---

## 7. ES6+ Features

---

### ❓ Q19. Destructuring kya hai?

```js
// Array Destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a, b, rest); // 1 2 [3,4,5]

// Object Destructuring
const { name, age = 25, ...others } = { name: "Ali", city: "Lahore" };
console.log(name, age, others); // Ali 25 { city: "Lahore" }

// Function parameter destructuring
function show({ name, age }) {
  return `${name} is ${age}`;
}
```

---

### ❓ Q20. Spread vs Rest operator?

```js
// Spread — array/object expand karna
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 }; // {a:1, b:2}

// Rest — baaki sab ko ek jagah collect karna
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
```

---

### ❓ Q21. Optional Chaining `?.` aur Nullish Coalescing `??`?

```js
const user = { profile: { name: "Ali" } };

// Optional Chaining — crash avoid karo
console.log(user?.profile?.name);    // "Ali"
console.log(user?.address?.city);    // undefined (no crash)

// Nullish Coalescing — null/undefined pe default value
const name = null ?? "Guest";        // "Guest"
const count = 0 ?? 10;              // 0 (0 is not null/undefined!)
const val = 0 || 10;               // 10 (|| checks falsy, ?? checks null/undefined only)
```

---

## 8. Array Questions

---

### ❓ Q22. Array ke important methods (must know!)

```js
const nums = [1, 2, 3, 4, 5];

// map — har element transform karo, naya array return
nums.map(n => n * 2);          // [2,4,6,8,10]

// filter — condition pe filter karo
nums.filter(n => n % 2 === 0); // [2,4]

// reduce — ek value mein summarize karo
nums.reduce((acc, n) => acc + n, 0); // 15

// find — pehla matching element
nums.find(n => n > 3);         // 4

// findIndex — pehla matching index
nums.findIndex(n => n > 3);   // 3

// some — koi ek match karta hai?
nums.some(n => n > 4);        // true

// every — sab match karte hain?
nums.every(n => n > 0);       // true

// flat — nested array flatten karo
[1, [2, [3]]].flat(Infinity); // [1,2,3]

// flatMap — map + flat
[[1,2],[3,4]].flatMap(x => x); // [1,2,3,4]
```

---

### ❓ Q23. Array coding questions

**Q: Remove duplicates from array**
```js
const arr = [1, 2, 2, 3, 4, 4, 5];

// Method 1: Set
const unique = [...new Set(arr)]; // [1,2,3,4,5]

// Method 2: filter
const unique2 = arr.filter((val, idx) => arr.indexOf(val) === idx);
```

**Q: Flatten nested array**
```js
const nested = [1, [2, [3, [4]]]];

// Method 1
const flat = nested.flat(Infinity); // [1,2,3,4]

// Method 2: Recursive
function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
```

**Q: Group array by property**
```js
const people = [
  { name: "Ali", dept: "IT" },
  { name: "Sara", dept: "HR" },
  { name: "Zaid", dept: "IT" }
];

const grouped = people.reduce((acc, person) => {
  if (!acc[person.dept]) acc[person.dept] = [];
  acc[person.dept].push(person);
  return acc;
}, {});
// { IT: [...], HR: [...] }
```

**Q: Find max/min without Math.max**
```js
const arr = [3, 1, 4, 1, 5, 9];
const max = arr.reduce((a, b) => a > b ? a : b); // 9
const min = arr.reduce((a, b) => a < b ? a : b); // 1
```

**Q: Chunk array into groups**
```js
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
chunk([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]
```

---

## 9. String Questions

---

### ❓ Q24. String ke important methods

```js
const str = "  Hello, World!  ";

str.trim()              // "Hello, World!"
str.toLowerCase()       // "  hello, world!  "
str.toUpperCase()       // "  HELLO, WORLD!  "
str.includes("World")  // true
str.startsWith("  H")  // true
str.replace("World", "JS") // "  Hello, JS!  "
str.split(", ")        // ["  Hello", "World!  "]
str.slice(2, 7)        // "Hello"
str.indexOf("o")       // 4
str.repeat(2)          // str + str
"hello".padStart(8, "*") // "***hello"
"hello".padEnd(8, "-")   // "hello---"
```

---

### ❓ Q25. String coding questions

**Q: Reverse a string**
```js
const reverse = str => str.split("").reverse().join("");
reverse("hello"); // "olleh"

// Without built-in reverse
function reverseStr(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```

**Q: Check if string is palindrome**
```js
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
}
isPalindrome("racecar"); // true
isPalindrome("A man a plan a canal Panama"); // true
```

**Q: Count character occurrences**
```js
function charCount(str) {
  return str.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}
charCount("hello"); // {h:1, e:1, l:2, o:1}
```

**Q: Find first non-repeating character**
```js
function firstUnique(str) {
  const count = charCount(str);
  return str.split("").find(c => count[c] === 1) || null;
}
firstUnique("aabbcde"); // "c"
```

**Q: Anagram check**
```js
function isAnagram(a, b) {
  const sort = s => s.toLowerCase().split("").sort().join("");
  return sort(a) === sort(b);
}
isAnagram("listen", "silent"); // true
```

**Q: Capitalize each word**
```js
const capitalize = str =>
  str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
capitalize("hello world"); // "Hello World"
```

**Q: Count vowels in string**
```js
function countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}
countVowels("Hello World"); // 3
```

---

## 10. Tricky/Common Output Questions

---

### ❓ Q26. Common Output Traps — Must Practice!

```js
// Q: What is the output?
console.log(typeof typeof 1);
// typeof 1 = "number", typeof "number" = "string" → "string"

// Q:
console.log(0.1 + 0.2 === 0.3); // false (floating point issue)
console.log(0.1 + 0.2); // 0.30000000000000004

// Q:
let x = 1;
let y = x++;  // y = 1, x = 2 (post-increment)
let z = ++x;  // z = 3, x = 3 (pre-increment)

// Q:
console.log([] == false); // true
console.log([] === false); // false
console.log(![]); // false  ← [] is truthy!

// Q:
console.log("5" + 3);   // "53" string concatenation
console.log("5" - 3);   // 2 numeric subtraction
console.log("5" * "3"); // 15

// Q:
const obj = { a: 1 };
const obj2 = obj;
obj2.a = 99;
console.log(obj.a); // 99 — objects are reference types!

// Q:
const arr = [1, 2, 3];
const arr2 = [...arr];
arr2.push(4);
console.log(arr.length); // 3 — spread karne se shallow copy bana
```

---

### ❓ Q27. `this` keyword — Common Interview Trap

```js
const user = {
  name: "Ali",
  greet: function() {
    console.log(this.name); // "Ali"
  },
  greetArrow: () => {
    console.log(this.name); // undefined — arrow fn ka this lexical hai
  }
};

user.greet();       // "Ali"
user.greetArrow();  // undefined

// Detached function
const fn = user.greet;
fn(); // undefined (this = global/undefined in strict mode)

// Fix: bind
const bound = user.greet.bind(user);
bound(); // "Ali"
```

---

### ❓ Q28. Deep Copy vs Shallow Copy

```js
// Shallow copy — nested objects still referenced
const obj = { a: 1, b: { c: 2 } };
const shallow = { ...obj };
shallow.b.c = 99;
console.log(obj.b.c); // 99 — affected!

// Deep copy options:
// 1. JSON (simple, loses functions/undefined)
const deep1 = JSON.parse(JSON.stringify(obj));

// 2. structuredClone (modern, recommended)
const deep2 = structuredClone(obj);

// 3. Recursive
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}
```

---

### ❓ Q29. Debounce vs Throttle (Important!)

```js
// Debounce — wait karo jab tak user ruke (e.g., search input)
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle — fixed interval pe ek hi baar chalao (e.g., scroll)
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

---

### ❓ Q30. Memoization kya hai?

Performance optimization — same input pe calculation dubara mat karo, cache karo.

```js
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log("Cache se mila!");
      return cache[key];
    }
    cache[key] = fn.apply(this, args);
    return cache[key];
  };
}

const factorial = memoize(function f(n) {
  return n <= 1 ? 1 : n * f(n - 1);
});
```

---

## ⚡ Quick Revision — Top 10 Must-Know Points

| # | Topic | Key Point |
|---|-------|-----------|
| 1 | `typeof null` | Returns `"object"` — JS ka bug hai |
| 2 | `==` vs `===` | `===` type bhi check karta hai |
| 3 | Hoisting | `var` → undefined, `let/const` → TDZ error |
| 4 | Closure | Inner function outer variables yaad rakhta hai |
| 5 | Event Loop | Microtasks (Promise) > Macrotasks (setTimeout) |
| 6 | Arrow fn | Apna `this` nahi hota — lexical scope se leta hai |
| 7 | `null ?? x` | Only null/undefined pe default, `||` truthy check karta |
| 8 | Spread `...` | Shallow copy — nested objects reference hote hain |
| 9 | `Promise.all` | Sab resolve ho toh result, ek reject toh sab fail |
| 10 | Debounce | Wait for user to stop, Throttle: fixed interval |

---

## 🎯 Last Minute Tips

- **Har question pe example do** — sirf definition mat do
- **Edge cases batao** — `null`, `undefined`, empty array, etc.
- **Time complexity** — array/string questions mein O(n) solution prefer karo
- **`use strict`** ke baare mein pata hona chahiye
- Puchha jaye **"kya aap improve kar sakte hain?"** — better complexity solution do

---

*Best of luck aapke interview mein! 🚀 You've got this!*