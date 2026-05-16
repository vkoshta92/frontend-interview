# 🛠️ JavaScript Polyfills — Complete Guide (Hinglish)

> **Polyfill kya hota hai?**
> Jab koi modern JS feature purane browsers mein available nahi hoti, tab hum khud us feature ka code likh dete hain — isko **polyfill** kehte hain. Simple shabdon mein: _"Jo browser nahi jaanta, wo hum use sikha dete hain."_

---

## 📌 Table of Contents

1. [Array Methods](#1-array-methods)
   - map, filter, reduce, find, findIndex, includes, flat, flatMap, forEach, every, some, fill, indexOf, lastIndexOf, from, of, at
2. [Object Methods](#2-object-methods)
   - assign, keys, values, entries, create, freeze, fromEntries, hasOwn
3. [String Methods](#3-string-methods)
   - includes, startsWith, endsWith, repeat, trim, trimStart, trimEnd, padStart, padEnd, replaceAll, at
4. [Promise Methods](#4-promise-methods)
   - Promise.all, allSettled, race, any, finally
5. [Function Methods](#5-function-methods)
   - bind, call, apply
6. [Number / Math Methods](#6-number--math-methods)
   - Number.isNaN, isFinite, isInteger, parseInt, Math.trunc, Math.sign, Math.cbrt
7. [Other / Misc](#7-other--misc-polyfills)
   - Optional Chaining, Nullish Coalescing, structuredClone, queueMicrotask, globalThis, fetch (basic)

---

## 1. Array Methods

---

### 🔹 Array.prototype.map

```js
// Native: [1,2,3].map(x => x * 2) → [2,4,6]

if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    // 'this' matlab current array
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i in this) {
        // callback mein: current element, index, original array
        result.push(callback.call(thisArg, this[i], i, this));
      }
    }
    return result;
  };
}
```

**Explanation:**
- `this` = jo array pe `.map()` call hua
- `i in this` — sparse arrays handle karta hai (empty slots skip hoti hain)
- `thisArg` — optional context jo callback ke andar `this` ban jaata hai
- Ek naya array return karta hai, original change nahi hota

---

### 🔹 Array.prototype.filter

```js
// Native: [1,2,3,4].filter(x => x % 2 === 0) → [2,4]

if (!Array.prototype.filter) {
  Array.prototype.filter = function (callback, thisArg) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
```

**Explanation:**
- Callback `true` return kare to element result mein jaata hai
- Falsy return kare to skip ho jaata hai
- Original array untouched rehti hai

---

### 🔹 Array.prototype.reduce

```js
// Native: [1,2,3,4].reduce((acc, cur) => acc + cur, 0) → 10

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    if (this.length === 0 && arguments.length < 2) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    let acc;
    let startIndex;

    if (arguments.length >= 2) {
      acc = initialValue;
      startIndex = 0;
    } else {
      // Initial value nahi diya to pehla element accumulator ban jaata hai
      acc = this[0];
      startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
      if (i in this) {
        acc = callback(acc, this[i], i, this);
      }
    }
    return acc;
  };
}
```

**Explanation:**
- `acc` = accumulator (running result)
- Agar `initialValue` nahi diya to array ka pehla element use hota hai
- Empty array + no initial value = TypeError

---

### 🔹 Array.prototype.find

```js
// Native: [5,12,8].find(x => x > 10) → 12

if (!Array.prototype.find) {
  Array.prototype.find = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return this[i]; // pehla match milte hi return
      }
    }
    return undefined;
  };
}
```

---

### 🔹 Array.prototype.findIndex

```js
// Native: [5,12,8].findIndex(x => x > 10) → 1

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return i; // index return karta hai, element nahi
      }
    }
    return -1;
  };
}
```

---

### 🔹 Array.prototype.includes

```js
// Native: [1,2,3].includes(2) → true
// Special: [NaN].includes(NaN) → true (indexOf NaN detect nahi karta!)

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, fromIndex) {
    const len = this.length;
    let start = fromIndex | 0; // integer banao

    if (start < 0) start = Math.max(0, len + start);

    for (let i = start; i < len; i++) {
      const el = this[i];
      // NaN === NaN false hota hai, isliye special check
      if (el === searchElement || (Number.isNaN(el) && Number.isNaN(searchElement))) {
        return true;
      }
    }
    return false;
  };
}
```

**Key point:** `indexOf` NaN detect nahi kar paata, `includes` kar leta hai — ye fark yaad rakho interviews mein!

---

### 🔹 Array.prototype.flat

```js
// Native: [1,[2,[3]]].flat(Infinity) → [1,2,3]

if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth = 1) {
    function flatten(arr, d) {
      return arr.reduce((acc, val) => {
        if (Array.isArray(val) && d > 0) {
          acc.push(...flatten(val, d - 1));
        } else {
          acc.push(val);
        }
        return acc;
      }, []);
    }
    return flatten(this, depth);
  };
}
```

**Explanation:**
- `depth` controls kitni levels tak flatten karna hai
- `Infinity` pass karo to completely flat ho jaata hai
- Recursively nested arrays ko open karta hai

---

### 🔹 Array.prototype.flatMap

```js
// Native: [1,2,3].flatMap(x => [x, x*2]) → [1,2,2,4,3,6]
// map karo phir ek level flat karo

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (callback, thisArg) {
    return this.map(callback, thisArg).flat(1);
  };
}
```

---

### 🔹 Array.prototype.forEach

```js
// Native: [1,2,3].forEach(x => console.log(x))

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (i in this) {
        callback.call(thisArg, this[i], i, this);
      }
    }
    // forEach kuch return nahi karta — undefined
  };
}
```

---

### 🔹 Array.prototype.every

```js
// Native: [2,4,6].every(x => x % 2 === 0) → true

if (!Array.prototype.every) {
  Array.prototype.every = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (i in this && !callback.call(thisArg, this[i], i, this)) {
        return false; // ek bhi fail hua to false
      }
    }
    return true;
  };
}
```

---

### 🔹 Array.prototype.some

```js
// Native: [1,3,5,6].some(x => x % 2 === 0) → true

if (!Array.prototype.some) {
  Array.prototype.some = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return true; // ek bhi pass hua to true
      }
    }
    return false;
  };
}
```

---

### 🔹 Array.prototype.fill

```js
// Native: [1,2,3,4].fill(0, 1, 3) → [1,0,0,4]

if (!Array.prototype.fill) {
  Array.prototype.fill = function (value, start = 0, end = this.length) {
    const len = this.length;
    let s = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
    let e = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);

    for (let i = s; i < e; i++) {
      this[i] = value;
    }
    return this; // original array modify hoti hai
  };
}
```

---

### 🔹 Array.prototype.indexOf

```js
// Native: [1,2,3,2].indexOf(2) → 1

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex = 0) {
    const len = this.length;
    let start = fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex;

    for (let i = start; i < len; i++) {
      if (this[i] === searchElement) return i;
    }
    return -1;
  };
}
```

---

### 🔹 Array.prototype.lastIndexOf

```js
// Native: [1,2,3,2].lastIndexOf(2) → 3

if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
    const len = this.length;
    let start = fromIndex === undefined ? len - 1 : fromIndex;
    if (start < 0) start = len + start;

    for (let i = start; i >= 0; i--) {
      if (this[i] === searchElement) return i;
    }
    return -1;
  };
}
```

---

### 🔹 Array.from

```js
// Native: Array.from('abc') → ['a','b','c']
// Native: Array.from({length:3}, (_,i) => i) → [0,1,2]

if (!Array.from) {
  Array.from = function (arrayLike, mapFn, thisArg) {
    const result = [];
    const len = arrayLike.length;

    for (let i = 0; i < len; i++) {
      const val = arrayLike[i];
      result.push(mapFn ? mapFn.call(thisArg, val, i) : val);
    }
    return result;
  };
}
```

**Note:** Iterable support nahi hai is basic version mein (Symbol.iterator wala part complex hai).

---

### 🔹 Array.of

```js
// Native: Array.of(1,2,3) → [1,2,3]
// Array(3) → [empty x 3] — isiliye Array.of banaya gaya

if (!Array.of) {
  Array.of = function (...args) {
    return Array.prototype.slice.call(args);
  };
}
```

---

### 🔹 Array.prototype.at

```js
// Native: [10,20,30].at(-1) → 30

if (!Array.prototype.at) {
  Array.prototype.at = function (index) {
    const len = this.length;
    const i = index < 0 ? len + index : index;
    return i >= 0 && i < len ? this[i] : undefined;
  };
}
```

**Ye kyu useful hai:** Negative index se last element access kar sako — `arr[arr.length-1]` likhne ka jhanjhat nahi.

---

## 2. Object Methods

---

### 🔹 Object.assign

```js
// Native: Object.assign({a:1}, {b:2}) → {a:1, b:2}

if (!Object.assign) {
  Object.assign = function (target, ...sources) {
    if (target == null) throw new TypeError('Cannot convert undefined or null to object');

    const to = Object(target);
    for (const source of sources) {
      if (source != null) {
        for (const key in source) {
          // Sirf own properties copy karo, inherited nahi
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            to[key] = source[key];
          }
        }
      }
    }
    return to;
  };
}
```

**Shallow copy** karta hai — nested objects reference se copy hote hain, deep nahi.

---

### 🔹 Object.keys

```js
// Native: Object.keys({a:1, b:2}) → ['a','b']

if (!Object.keys) {
  Object.keys = function (obj) {
    if (obj !== Object(obj)) throw new TypeError('Not an object');
    const keys = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
}
```

---

### 🔹 Object.values

```js
// Native: Object.values({a:1, b:2}) → [1,2]

if (!Object.values) {
  Object.values = function (obj) {
    return Object.keys(obj).map(key => obj[key]);
  };
}
```

---

### 🔹 Object.entries

```js
// Native: Object.entries({a:1}) → [['a',1]]

if (!Object.entries) {
  Object.entries = function (obj) {
    return Object.keys(obj).map(key => [key, obj[key]]);
  };
}
```

---

### 🔹 Object.create

```js
// Native: Object.create(proto) — proto se inherit karta naya object banata hai

if (!Object.create) {
  Object.create = function (proto, propertiesObject) {
    if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError('Argument must be an object, or null');
    }
    function F() {}
    F.prototype = proto;
    const obj = new F();
    if (propertiesObject !== undefined) {
      Object.defineProperties(obj, propertiesObject);
    }
    return obj;
  };
}
```

---

### 🔹 Object.fromEntries

```js
// Native: Object.fromEntries([['a',1],['b',2]]) → {a:1, b:2}
// Map.entries() → Object convert karne ke kaam aata hai

if (!Object.fromEntries) {
  Object.fromEntries = function (iterable) {
    const obj = {};
    for (const [key, value] of iterable) {
      obj[key] = value;
    }
    return obj;
  };
}
```

---

### 🔹 Object.hasOwn

```js
// Native: Object.hasOwn(obj, 'key') — safer alternative to hasOwnProperty

if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}
```

**Kyu better hai:** Agar kisi ne `obj.hasOwnProperty = null` kar diya to bhi ye kaam karta hai.

---

## 3. String Methods

---

### 🔹 String.prototype.includes

```js
// Native: 'hello world'.includes('world') → true

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start = 0) {
    return this.indexOf(search, start) !== -1;
  };
}
```

---

### 🔹 String.prototype.startsWith

```js
// Native: 'hello'.startsWith('he') → true

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos = 0) {
    return this.slice(pos, pos + search.length) === search;
  };
}
```

---

### 🔹 String.prototype.endsWith

```js
// Native: 'hello'.endsWith('lo') → true

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, length) {
    const len = length === undefined ? this.length : length;
    const end = this.slice(len - search.length, len);
    return end === search;
  };
}
```

---

### 🔹 String.prototype.repeat

```js
// Native: 'ha'.repeat(3) → 'hahaha'

if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    if (count < 0 || count === Infinity) throw new RangeError('Invalid count value');
    let result = '';
    let str = String(this);
    count = Math.floor(count);
    while (count > 0) {
      if (count % 2 === 1) result += str;
      str += str;
      count = Math.floor(count / 2);
    }
    return result;
  };
}
```

**Optimization:** Bitwise doubling trick use kiya — O(log n) hai, O(n) nahi.

---

### 🔹 String.prototype.trim / trimStart / trimEnd

```js
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (!String.prototype.trimStart) {
  String.prototype.trimStart = function () {
    return this.replace(/^\s+/, '');
  };
}

if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = function () {
    return this.replace(/\s+$/, '');
  };
}
```

---

### 🔹 String.prototype.padStart / padEnd

```js
// Native: '5'.padStart(3, '0') → '005'

if (!String.prototype.padStart) {
  String.prototype.padStart = function (targetLength, padString = ' ') {
    const str = String(this);
    if (str.length >= targetLength) return str;
    const padded = padString.repeat(Math.ceil((targetLength - str.length) / padString.length));
    return padded.slice(0, targetLength - str.length) + str;
  };
}

if (!String.prototype.padEnd) {
  String.prototype.padEnd = function (targetLength, padString = ' ') {
    const str = String(this);
    if (str.length >= targetLength) return str;
    const padded = padString.repeat(Math.ceil((targetLength - str.length) / padString.length));
    return str + padded.slice(0, targetLength - str.length);
  };
}
```

---

### 🔹 String.prototype.replaceAll

```js
// Native: 'aababc'.replaceAll('a', 'x') → 'xxbxbc'

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (search, replacement) {
    if (search instanceof RegExp) {
      if (!search.global) throw new TypeError('RegExp must have global flag');
      return this.replace(search, replacement);
    }
    // Escape karo special regex chars ko
    const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.replace(new RegExp(escaped, 'g'), replacement);
  };
}
```

---

### 🔹 String.prototype.at

```js
// Native: 'hello'.at(-1) → 'o'

if (!String.prototype.at) {
  String.prototype.at = function (index) {
    const len = this.length;
    const i = index < 0 ? len + index : index;
    return i >= 0 && i < len ? this[i] : undefined;
  };
}
```

---

## 4. Promise Methods

---

### 🔹 Promise.all

```js
// Sab resolve ho to result array, koi bhi reject to immediately reject

if (!Promise.all) {
  Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let remaining = promises.length;

      if (remaining === 0) return resolve([]);

      promises.forEach((promise, i) => {
        Promise.resolve(promise).then(val => {
          results[i] = val;
          remaining--;
          if (remaining === 0) resolve(results);
        }).catch(reject); // ek bhi fail to sab fail
      });
    });
  };
}
```

---

### 🔹 Promise.allSettled

```js
// Sab settle hone ka wait karta hai — reject bhi ho tab bhi result aata hai

if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return Promise.all(
      promises.map(p =>
        Promise.resolve(p).then(
          value => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected', reason })
        )
      )
    );
  };
}
```

**Key difference:** `Promise.all` pehle reject pe ruk jaata hai, `allSettled` sab ka wait karta hai.

---

### 🔹 Promise.race

```js
// Jo pehle settle ho (resolve ya reject) wahi win kare

if (!Promise.race) {
  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => {
        Promise.resolve(p).then(resolve).catch(reject);
      });
    });
  };
}
```

---

### 🔹 Promise.any

```js
// Pehla resolve ho to win, sab reject ho to AggregateError

if (!Promise.any) {
  Promise.any = function (promises) {
    return new Promise((resolve, reject) => {
      const errors = [];
      let remaining = promises.length;

      if (remaining === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }

      promises.forEach((p, i) => {
        Promise.resolve(p).then(resolve).catch(err => {
          errors[i] = err;
          remaining--;
          if (remaining === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
      });
    });
  };
}
```

---

### 🔹 Promise.prototype.finally

```js
// Resolve ho ya reject — finally hamesha chalega

if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    return this.then(
      value => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason; })
    );
  };
}
```

---

## 5. Function Methods

---

### 🔹 Function.prototype.bind

```js
// Native: fn.bind(ctx, arg1) — naya function banata hai fixed context ke saath

if (!Function.prototype.bind) {
  Function.prototype.bind = function (thisArg, ...outerArgs) {
    const fn = this;

    if (typeof fn !== 'function') {
      throw new TypeError('bind called on non-function');
    }

    function bound(...innerArgs) {
      // 'new' se call hua to thisArg ignore hoga
      const context = this instanceof bound ? this : thisArg;
      return fn.apply(context, [...outerArgs, ...innerArgs]);
    }

    // Prototype chain preserve karo (new ke liye)
    if (fn.prototype) {
      bound.prototype = Object.create(fn.prototype);
    }

    return bound;
  };
}
```

**Interview favourite!** `bind`, `call`, `apply` ka fark:
- `call` — immediately call karo, args comma-separated
- `apply` — immediately call karo, args array mein
- `bind` — naya function return karo, baad mein call karo

---

### 🔹 Function.prototype.call

```js
if (!Function.prototype.call) {
  Function.prototype.call = function (thisArg, ...args) {
    const ctx = thisArg === null || thisArg === undefined ? globalThis : Object(thisArg);
    const sym = Symbol('temp'); // collision avoid karo
    ctx[sym] = this;
    const result = ctx[sym](...args);
    delete ctx[sym];
    return result;
  };
}
```

---

### 🔹 Function.prototype.apply

```js
if (!Function.prototype.apply) {
  Function.prototype.apply = function (thisArg, args = []) {
    const ctx = thisArg == null ? globalThis : Object(thisArg);
    const sym = Symbol('temp');
    ctx[sym] = this;
    const result = ctx[sym](...args);
    delete ctx[sym];
    return result;
  };
}
```

---

## 6. Number / Math Methods

---

### 🔹 Number.isNaN

```js
// Global isNaN('abc') → true (coercion hota hai — galat!)
// Number.isNaN('abc') → false (strict — sahi!)

if (!Number.isNaN) {
  Number.isNaN = function (value) {
    return typeof value === 'number' && value !== value; // NaN !== NaN
  };
}
```

---

### 🔹 Number.isFinite

```js
// Global isFinite('15') → true (string coerce hoti hai)
// Number.isFinite('15') → false (strict)

if (!Number.isFinite) {
  Number.isFinite = function (value) {
    return typeof value === 'number' && isFinite(value);
  };
}
```

---

### 🔹 Number.isInteger

```js
if (!Number.isInteger) {
  Number.isInteger = function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };
}
```

---

### 🔹 Number.parseInt / Number.parseFloat

```js
if (!Number.parseInt) {
  Number.parseInt = parseInt;
}
if (!Number.parseFloat) {
  Number.parseFloat = parseFloat;
}
```

---

### 🔹 Math.trunc

```js
// Native: Math.trunc(4.7) → 4,  Math.trunc(-4.7) → -4
// Math.floor(-4.7) → -5 hota (wrong), trunc (-4)

if (!Math.trunc) {
  Math.trunc = function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
}
```

---

### 🔹 Math.sign

```js
// Native: Math.sign(-5) → -1, Math.sign(0) → 0, Math.sign(5) → 1

if (!Math.sign) {
  Math.sign = function (x) {
    x = +x; // number mein convert
    if (x === 0 || isNaN(x)) return x;
    return x > 0 ? 1 : -1;
  };
}
```

---

### 🔹 Math.cbrt (Cube Root)

```js
// Native: Math.cbrt(27) → 3

if (!Math.cbrt) {
  Math.cbrt = function (x) {
    if (x === 0) return 0;
    const sign = x < 0 ? -1 : 1;
    return sign * Math.pow(Math.abs(x), 1 / 3);
  };
}
```

---

## 7. Other / Misc Polyfills

---

### 🔹 Optional Chaining (?.) — Babel polyfill concept

```js
// Native: obj?.a?.b?.c

// Babel ye kuch aisa compile karta hai:
const result = (_obj = obj) === null || _obj === void 0
  ? void 0
  : (_obj$a = _obj.a) === null || _obj$a === void 0
  ? void 0
  : _obj$a.b?.c;

// Manual helper:
function safeGet(obj, ...keys) {
  return keys.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}
// Use: safeGet(user, 'address', 'city')
```

---

### 🔹 Nullish Coalescing (??) — Babel concept

```js
// Native: a ?? b  — a null/undefined ho to b, warna a
// Babel compile karta hai:

const result = value !== null && value !== undefined ? value : defaultValue;

// Note: || (OR) falsy pe fallback karta hai (0, '', false bhi)
// ?? sirf null/undefined pe fallback karta hai — important difference!
```

---

### 🔹 structuredClone

```js
// Native: Deep clone karna — reference tod ke copy

if (!globalThis.structuredClone) {
  globalThis.structuredClone = function (obj) {
    // JSON trick — simple cases ke liye (functions, Date, etc. handle nahi honge)
    return JSON.parse(JSON.stringify(obj));
  };
}

// Better version (Date support):
function structuredClonePolyfill(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(structuredClonePolyfill);
  
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = structuredClonePolyfill(obj[key]);
    }
  }
  return cloned;
}
```

---

### 🔹 queueMicrotask

```js
// Native: Promise ke baad, setTimeout se pehle run karta hai

if (!globalThis.queueMicrotask) {
  globalThis.queueMicrotask = function (callback) {
    Promise.resolve().then(callback).catch(e =>
      setTimeout(() => { throw e; }, 0)
    );
  };
}
```

---

### 🔹 globalThis

```js
// Browser: window, Node: global, Worker: self — sab ke liye ek universal reference

if (!globalThis) {
  (function () {
    // Ye trick har environment mein kaam karti hai
    const global =
      typeof globalThis !== 'undefined' ? globalThis :
      typeof self !== 'undefined' ? self :
      typeof window !== 'undefined' ? window :
      typeof global !== 'undefined' ? global :
      Function('return this')();

    Object.defineProperty(global, 'globalThis', {
      value: global,
      writable: true,
      configurable: true,
    });
  })();
}
```

---

### 🔹 fetch (Basic Polyfill concept — XMLHttpRequest wala)

```js
// Purane browsers mein fetch nahi tha, XHR tha

if (!globalThis.fetch) {
  globalThis.fetch = function (url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', url);

      // Headers set karo
      if (options.headers) {
        Object.entries(options.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      }

      xhr.onload = function () {
        const response = {
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          json: () => Promise.resolve(JSON.parse(xhr.responseText)),
          text: () => Promise.resolve(xhr.responseText),
        };
        resolve(response);
      };

      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.send(options.body || null);
    });
  };
}
```

**Note:** Production mein `whatwg-fetch` ya `cross-fetch` npm package use karo — ye sirf concept samajhne ke liye hai.

---

## 🎯 Quick Summary Table

| Method | Kya karta hai | Key Point |
|---|---|---|
| `Array.map` | Naya transformed array | Original nahi badlata |
| `Array.filter` | Condition-based naya array | Truthy elements rakhta hai |
| `Array.reduce` | Single value mein reduce | accumulator concept |
| `Array.find` | Pehla matching element | undefined return karta hai |
| `Array.includes` | Element hai ya nahi | NaN detect kar sakta hai |
| `Array.flat` | Nested array flatten | depth control hota hai |
| `Array.at` | Negative index support | `arr[-1]` ka substitute |
| `Object.assign` | Objects merge | Shallow copy only |
| `Object.entries` | `[key,val]` pairs array | for...of ke saath useful |
| `Promise.all` | Sab resolve ka wait | Ek fail → sab fail |
| `Promise.allSettled` | Sab settle ka wait | Fail ho tab bhi result milega |
| `Promise.race` | Pehla settle wala wins | Timeout pattern ke liye |
| `Promise.any` | Pehla resolve wins | Sab fail → AggregateError |
| `bind` | New function fixed context | `new` ke saath bhi kaam karta |
| `Number.isNaN` | Strict NaN check | Global isNaN se safe |
| `structuredClone` | Deep clone | JSON trick ka proper substitute |

---

## 💡 Interview Tips (Hinglish)

1. **Polyfill vs Shim:** Polyfill missing native API add karta hai; Shim existing behavior fix karta hai — ye fark puchha jaata hai.

2. **`i in this` kyu:** Sparse arrays handle karne ke liye — `[1,,3]` mein index 1 exist nahi karta.

3. **`Number.isNaN` vs `isNaN`:** Global wala string convert karta hai (`isNaN('abc') → true`), Number wala nahi.

4. **`bind` polyfill mein `new`:** Constructor ke saath `bind` kiya ho to `thisArg` ignore hona chahiye — ye edge case yaad rakho.

5. **`Promise.all` vs `allSettled`:** Real interviews mein ye puchha jaata hai — `all` ek fail pe ruk jaata hai, `allSettled` sab ka wait karta hai.

---

*Happy Coding! 🚀 — Polyfills samajhne se JS engine ka andar ka kaam samajh aata hai — ye fundamentals hain, sirf mugged-up answers nahi.*