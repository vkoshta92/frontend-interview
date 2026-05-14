# JavaScript Advanced Interview Questions
### Hexaware Walk-In Drive | 16th May | Noida | 2–3 Years Experience

---

## 📌 Table of Contents
1. [Core JavaScript Concepts](#1-core-javascript-concepts)
2. [Functions & Closures](#2-functions--closures)
3. [Asynchronous JavaScript](#3-asynchronous-javascript)
4. [Prototypes & OOP](#4-prototypes--oop)
5. [ES6+ Features](#5-es6-features)
6. [DOM & Browser APIs](#6-dom--browser-apis)
7. [Event Loop & Performance](#7-event-loop--performance)
8. [Error Handling](#8-error-handling)
9. [Git Version Control](#9-git-version-control)
10. [Real-World / Practical Questions](#10-real-world--practical-questions)

---

## 1. Core JavaScript Concepts

**Q1. var vs let vs const ka difference kya hai?**
- `var` → function-scoped, hoisted, re-declarable
- `let` → block-scoped, hoisted but TDZ mein rehta hai, re-assignable
- `const` → block-scoped, re-assign nahi ho sakta, object properties change ho sakti hain

**Q2. Hoisting kya hota hai?**
> Variable aur function declarations ko JavaScript engine compile time pe scope ke top pe move kar deta hai.
- `var` → `undefined` se initialize hota hai
- `let/const` → Temporal Dead Zone (TDZ) mein rehte hain
- Function declarations fully hoisted hoti hain

**Q3. Temporal Dead Zone (TDZ) kya hai?**
> Block scope mein enter karne ke baad aur `let/const` declare hone se pehle ka time period. Is time mein variable access karne se `ReferenceError` aata hai.

**Q4. == vs === mein kya fark hai?**
- `==` → Type coercion karta hai (`0 == false` → true)
- `===` → Strict equality, no coercion (`0 === false` → false)

**Q5. null vs undefined vs NaN?**
- `undefined` → variable declared but value assign nahi hua
- `null` → intentionally empty value
- `NaN` → invalid number operation ka result (`"abc" * 2`)

**Q6. typeof operator ke results kya hote hain?**
```js
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← famous bug!
typeof {}          // "object"
typeof []          // "object"
typeof function(){} // "function"
```

**Q7. Shallow copy vs Deep copy?**
```js
// Shallow copy
const copy = { ...original };
const copy2 = Object.assign({}, original);

// Deep copy
const deep = JSON.parse(JSON.stringify(original));
const deep2 = structuredClone(original); // modern
```

---

## 2. Functions & Closures

**Q8. Closure kya hota hai? Example do.**
> Ek function jo apne outer scope ke variables ko yaad rakhta hai, chahe outer function execute ho chuka ho.

```js
function counter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const inc = counter();
inc(); // 1
inc(); // 2
```

**Q9. Closure ka real-world use case?**
- Private variables banana
- Memoization
- Event handlers mein data maintain karna
- Module pattern

**Q10. Arrow function vs Regular function?**
| Feature | Regular | Arrow |
|---|---|---|
| `this` binding | Dynamic | Lexical (parent ka) |
| `arguments` object | Available | Not available |
| Constructor | Yes | No |
| Hoisting | Yes (declaration) | No |

**Q11. IIFE kya hota hai?**
```js
(function() {
  // Immediately Invoked Function Expression
  // Apna scope banata hai, global scope pollute nahi karta
})();
```

**Q12. Currying kya hai?**
```js
// Normal
const add = (a, b) => a + b;

// Curried
const curriedAdd = a => b => a + b;
curriedAdd(2)(3); // 5
```

**Q13. call(), apply(), bind() ka difference?**
```js
function greet(greeting) {
  console.log(greeting + " " + this.name);
}
const user = { name: "Rahul" };

greet.call(user, "Hello");         // Hello Rahul
greet.apply(user, ["Namaste"]);    // Namaste Rahul
const fn = greet.bind(user, "Hi");
fn();                              // Hi Rahul
```

**Q14. Higher Order Function kya hai?**
> Ek function jo dusre function ko argument le ya return kare. Example: `map`, `filter`, `reduce`

```js
const doubled = [1,2,3].map(n => n * 2); // [2,4,6]
const evens = [1,2,3,4].filter(n => n % 2 === 0); // [2,4]
const sum = [1,2,3].reduce((acc, n) => acc + n, 0); // 6
```

---

## 3. Asynchronous JavaScript

**Q15. Callback kya hota hai? Callback hell kya hai?**
```js
// Callback Hell (Pyramid of Doom)
getData(function(a) {
  getMore(a, function(b) {
    getEven(b, function(c) {
      // aur aur aur...
    });
  });
});
```

**Q16. Promise kya hota hai? States batao.**
> Promise ek object hai jo future mein complete hone wali operation represent karta hai.

**States:**
- `pending` → initial state
- `fulfilled` → operation successful
- `rejected` → operation failed

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});

promise
  .then(result => console.log(result))
  .catch(err => console.error(err))
  .finally(() => console.log("Always runs"));
```

**Q17. async/await kya hai?**
```js
async function fetchUser() {
  try {
    const res = await fetch('https://api.example.com/user');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}
```

**Q18. Promise.all vs Promise.allSettled vs Promise.race?**
```js
// Promise.all → sab resolve hone ka wait, ek bhi reject to fail
await Promise.all([p1, p2, p3]);

// Promise.allSettled → sab ka result aata hai, reject ho ya resolve
await Promise.allSettled([p1, p2, p3]);

// Promise.race → jo pehle settle ho uska result
await Promise.race([p1, p2, p3]);

// Promise.any → jo pehle resolve ho (reject ignore)
await Promise.any([p1, p2, p3]);
```

**Q19. Event Loop kaise kaam karta hai?**
> JavaScript single-threaded hai. Event loop continuously Call Stack check karta hai. Agar stack empty ho to Callback Queue se tasks uthata hai.

**Order of execution:**
1. Synchronous code (Call Stack)
2. Microtasks (Promise `.then`, `queueMicrotask`)
3. Macrotasks (setTimeout, setInterval, DOM events)

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

---

## 4. Prototypes & OOP

**Q20. Prototype chain kya hoti hai?**
> Har JavaScript object mein ek `[[Prototype]]` hota hai. Property dhundne ke liye JS chain follow karta hai until `null` milta hai.

**Q21. Prototypal inheritance vs Classical inheritance?**
- Classical (Java/C++) → Classes se inheritance
- Prototypal (JS) → Objects directly dusre objects se inherit karte hain

**Q22. ES6 Class kya hai?**
```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

const d = new Dog("Bruno");
d.speak(); // Bruno barks
```

**Q23. `this` keyword kaise kaam karta hai?**
- Regular function → caller object
- Arrow function → lexical (enclosing scope)
- Event handler → event target element
- strict mode → `undefined`

**Q24. Object.create() kya karta hai?**
```js
const proto = { greet() { return "Hello " + this.name; } };
const obj = Object.create(proto);
obj.name = "Priya";
obj.greet(); // "Hello Priya"
```

---

## 5. ES6+ Features

**Q25. Destructuring kya hai?**
```js
// Array
const [a, b, ...rest] = [1, 2, 3, 4];

// Object
const { name, age = 25, city: location } = user;

// Function parameter
function display({ name, role }) {
  console.log(name, role);
}
```

**Q26. Spread vs Rest operator?**
```js
// Spread → array/object expand karta hai
const merged = [...arr1, ...arr2];
const newObj = { ...obj1, ...obj2 };

// Rest → remaining elements collect karta hai
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```

**Q27. Optional Chaining (?.) aur Nullish Coalescing (??) kya hai?**
```js
// Optional chaining → error nahi deta agar undefined/null ho
const city = user?.address?.city;

// Nullish coalescing → null/undefined pe default value
const name = user.name ?? "Anonymous";
```

**Q28. Map vs Object, Set vs Array?**
| | Map | Object |
|---|---|---|
| Keys | Any type | String/Symbol only |
| Order | Insertion order | Not guaranteed |
| Size | `.size` property | Manual count |

| | Set | Array |
|---|---|---|
| Duplicates | No | Yes |
| Search | O(1) | O(n) |

**Q29. Generator function kya hai?**
```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const g = gen();
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
```

**Q30. Symbol kya hota hai?**
> Unique aur immutable primitive value. Object ke hidden properties banana ke liye use hota hai.
```js
const id = Symbol('id');
const user = { [id]: 123, name: "Amit" };
```

---

## 6. DOM & Browser APIs

**Q31. Event bubbling vs Event capturing?**
- **Bubbling** → child se parent tak event travel karta hai (default)
- **Capturing** → parent se child tak
```js
element.addEventListener('click', handler, true);  // capturing
element.addEventListener('click', handler, false); // bubbling (default)
```

**Q32. Event delegation kya hai?**
> Parent element pe ek event listener lagao jo sabhi child elements ke events handle kare.
```js
document.getElementById('list').addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    console.log(e.target.textContent);
  }
});
```

**Q33. localStorage vs sessionStorage vs Cookie?**
| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Expiry | Never | Tab close | Set manually |
| Size | ~5MB | ~5MB | ~4KB |
| Server access | No | No | Yes |

**Q34. Debounce vs Throttle?**
```js
// Debounce → last call ke baad delay ke baad execute
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle → fixed interval pe execute
function throttle(fn, limit) {
  let flag = true;
  return function(...args) {
    if (flag) {
      fn.apply(this, args);
      flag = false;
      setTimeout(() => flag = true, limit);
    }
  };
}
```

---

## 7. Event Loop & Performance

**Q35. Memory leak kab hota hai?**
- Global variables
- Forgotten event listeners
- Closures jo unnecessary references hold karein
- Detached DOM nodes

**Q36. Memoization kya hai?**
```js
function memoize(fn) {
  const cache = {};
  return function(n) {
    if (cache[n] !== undefined) return cache[n];
    return cache[n] = fn(n);
  };
}
const fastFib = memoize(function fib(n) {
  return n <= 1 ? n : fastFib(n-1) + fastFib(n-2);
});
```

**Q37. Web Workers kya hote hain?**
> Background threads jo main thread ko block kiye bina heavy computation kar sakte hain.
```js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => console.log(e.data);
```

---

## 8. Error Handling

**Q38. try/catch/finally kaise use karein?**
```js
async function getData() {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Type Error:", err.message);
    } else {
      throw err; // re-throw
    }
  } finally {
    cleanup(); // hamesha chalega
  }
}
```

**Q39. Custom Error class kaise banate hain?**
```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

throw new ValidationError("Required field missing", "email");
```

---

## 9. Git Version Control

**Q40. Basic Git commands jo interview mein pooche jaate hain:**
```bash
git init                    # repo initialize
git clone <url>             # clone karna
git status                  # changes dekhna
git add .                   # stage all changes
git commit -m "message"     # commit karna
git push origin main        # push karna
git pull origin main        # pull karna
git branch feature-xyz      # branch banana
git checkout -b feature-xyz # branch banana + switch
git merge feature-xyz       # merge karna
git rebase main             # rebase karna
git stash                   # changes temporarily save
git log --oneline           # commit history
git diff                    # changes dekhna
git reset --soft HEAD~1     # last commit undo (changes rakhein)
git reset --hard HEAD~1     # last commit undo (changes delete)
```

**Q41. git merge vs git rebase?**
- `merge` → merge commit create hoti hai, history preserve
- `rebase` → commits ko linear karta hai, cleaner history

**Q42. .gitignore kya hai?**
> File/folder jo Git track na kare unhe list karte hain. Example: `node_modules/`, `.env`, `dist/`

---

## 10. Real-World / Practical Questions

**Q43. JavaScript mein module system kya hai?**
```js
// ES Modules
export const add = (a, b) => a + b;
export default function main() {}

import main, { add } from './utils.js';

// CommonJS (Node.js)
module.exports = { add };
const { add } = require('./utils');
```

**Q44. Design Pattern: Module Pattern**
```js
const CounterModule = (() => {
  let count = 0; // private
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
})();
```

**Q45. Esker ke saath kaam karte hue JS ka use?**
> Esker ek document processing platform hai. JavaScript integration mein typically:
- REST API calls through `fetch` ya `axios`
- JSON data processing
- Form validation scripts
- Async data submission with error handling

**Q46. Pure function kya hoti hai?**
> Jo function same input pe hamesha same output de aur koi side effects na ho.
```js
// Pure
const add = (a, b) => a + b;

// Impure (side effect hai)
let total = 0;
const addToTotal = (n) => total += n;
```

**Q47. Immutability kyu zaroori hai?**
- Predictable state management
- Easier debugging
- React/Redux mein state changes detect karne ke liye
```js
// Mutable (avoid)
arr.push(4);

// Immutable (prefer)
const newArr = [...arr, 4];
```

**Q48. WeakMap aur WeakSet kya hain?**
> WeakMap/WeakSet mein keys weakly referenced hoti hain — garbage collector inhe collect kar sakta hai. Private data store karne ke liye use hota hai.

**Q49. Proxy aur Reflect kya hain?**
```js
const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : `Property ${prop} not found`;
  }
};
const proxy = new Proxy({name: "Sita"}, handler);
proxy.name;  // "Sita"
proxy.age;   // "Property age not found"
```

**Q50. Performance optimization ke tips?**
- Debounce/throttle use karein
- Lazy loading implement karein
- Unnecessary re-renders avoid karein
- Code splitting karein
- `requestAnimationFrame` use karein animations ke liye
- Web Workers for heavy computation

---

## 🎯 Quick Revision Tips

| Topic | Focus Area |
|---|---|
| Closures | Counter, private variable examples |
| async/await | Error handling, Promise.all |
| Event Loop | Output prediction questions |
| this keyword | Different contexts mein value |
| Array methods | map, filter, reduce, flat, flatMap |
| ES6+ | Destructuring, spread, optional chaining |
| Git | merge vs rebase, common commands |

---

## 💡 Interview Day Tips

1. **Sochkar bolo** — interviewer process dekhna chahta hai
2. **Examples do** — har concept ka real code example
3. **Edge cases mention karo** — shows depth of knowledge
4. **Git aur project experience** — practical examples prepare karo
5. **Esker exposure** — agar hai to zaroor mention karo

---

> 📅 Drive Date: 16th May (Saturday) | 📍 Noida | 💼 2-3 Years Exp
> 📩 Share profile: Shristis1@hexaware.com

**All the best! 🚀**