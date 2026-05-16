# 🧩 Array — Brute Force Problems in JavaScript
### Hindi + English Logic | Comments Mein Explanation | Interview Ready

---

## 📌 TABLE OF CONTENTS
1. [Two Sum](#1-two-sum)
2. [Duplicate Number Find](#2-duplicate-number-find)
3. [Count Zeros / Element Count](#3-count-zeros--element-count)
4. [Sort Array (All Types)](#4-sort-array-all-types)
5. [Max & Min Element](#5-max--min-element)
6. [Reverse Array](#6-reverse-array)
7. [Remove Duplicates](#7-remove-duplicates)
8. [Second Largest Element](#8-second-largest-element)
9. [Rotate Array](#9-rotate-array)
10. [Intersection & Union](#10-intersection--union)
11. [Missing Number](#11-missing-number)
12. [Move Zeros to End](#12-move-zeros-to-end)
13. [Subarray with Given Sum](#13-subarray-with-given-sum)
14. [Maximum Subarray (Kadane's)](#14-maximum-subarray-kadanes)
15. [Leaders in Array](#15-leaders-in-array)
16. [Pair with Given Sum](#16-pair-with-given-sum)
17. [Majority Element](#17-majority-element)
18. [Merge Two Sorted Arrays](#18-merge-two-sorted-arrays)
19. [Anagram Check (String + Array)](#19-anagram-check-string--array)
20. [Flatten Nested Array](#20-flatten-nested-array)
21. [Chunk Array](#21-chunk-array)
22. [Product of Array Except Self](#22-product-of-array-except-self)
23. [Longest Consecutive Sequence](#23-longest-consecutive-sequence)
24. [3Sum Problem](#24-3sum-problem)
25. [Best Time to Buy & Sell Stock](#25-best-time-to-buy--sell-stock)

---

## 1. Two Sum

> **Problem:** Array mein do numbers dhundo jinki sum = target ho, unke indices return karo.

```js
// ============================================================
// TWO SUM — Brute Force
// Approach: Har ek pair check karo — nested loop
// Time: O(n²) | Space: O(1)
// ============================================================

function twoSum(nums, target) {
  // Outer loop — pehla number
  for (let i = 0; i < nums.length; i++) {
    // Inner loop — doosra number (i+1 se shuru taaki same element na pakde)
    for (let j = i + 1; j < nums.length; j++) {
      // Agar dono ka sum target ke barabar hai
      if (nums[i] + nums[j] === target) {
        return [i, j]; // indices return karo
      }
    }
  }
  return []; // koi pair nahi mila
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]  → 2+7=9
console.log(twoSum([3, 2, 4], 6));       // [1, 2]  → 2+4=6

// ============================================================
// TWO SUM — Optimized (HashMap)
// Approach: Complement dhundo map mein
// Time: O(n) | Space: O(n)
// ============================================================

function twoSumOptimized(nums, target) {
  const map = {}; // {value: index} store karenge

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]; // jo number chahiye

    // Agar complement pehle se map mein hai
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }

    // Current number ko map mein save karo
    map[nums[i]] = i;
  }
  return [];
}
```

---

## 2. Duplicate Number Find

> **Problem:** Array mein kaunsa number repeat ho raha hai?

```js
// ============================================================
// FIND DUPLICATE — Brute Force
// Approach: Har element ko baaki sab se compare karo
// Time: O(n²) | Space: O(1)
// ============================================================

function findDuplicateBrute(nums) {
  const duplicates = [];

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // Agar same value milti hai aur pehle se result mein nahi
      if (nums[i] === nums[j] && !duplicates.includes(nums[i])) {
        duplicates.push(nums[i]);
      }
    }
  }

  return duplicates;
}

console.log(findDuplicateBrute([1, 3, 4, 2, 2]));     // [2]
console.log(findDuplicateBrute([1, 1, 2, 3, 3, 4])); // [1, 3]

// ============================================================
// FIND DUPLICATE — Using Object (Frequency Count)
// Approach: Har element ka count rakho
// Time: O(n) | Space: O(n)
// ============================================================

function findDuplicateFreq(nums) {
  const freq = {}; // frequency store karenge
  const result = [];

  for (let num of nums) {
    freq[num] = (freq[num] || 0) + 1; // count badhao

    // Sirf tabhi add karo jab pehli baar duplicate bana
    if (freq[num] === 2) {
      result.push(num);
    }
  }

  return result;
}

console.log(findDuplicateFreq([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]

// ============================================================
// FIND ALL DUPLICATES — Using Set
// Approach: Set mein check karo — pehle se hai ya nahi
// Time: O(n) | Space: O(n)
// ============================================================

function findDuplicateSet(nums) {
  const seen = new Set();
  const duplicates = new Set();

  for (let num of nums) {
    if (seen.has(num)) {
      duplicates.add(num); // already dekha tha — duplicate!
    }
    seen.add(num);
  }

  return [...duplicates];
}
```

---

## 3. Count Zeros / Element Count

> **Problem:** Array mein kitne zeros hain? Ya kisi bhi element ki frequency nikalo.

```js
// ============================================================
// COUNT ZEROS — Brute Force
// Approach: Ek ek element check karo
// Time: O(n) | Space: O(1)
// ============================================================

function countZeros(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      count++; // zero mila — count badhao
    }
  }

  return count;
}

console.log(countZeros([1, 0, 2, 0, 3, 0, 0])); // 4

// ============================================================
// COUNT ANY ELEMENT — Generic Counter
// Time: O(n) | Space: O(1)
// ============================================================

function countElement(arr, target) {
  let count = 0;

  for (let val of arr) {
    if (val === target) count++;
  }

  return count;
}

console.log(countElement([1, 2, 2, 3, 2], 2)); // 3

// ============================================================
// FREQUENCY OF ALL ELEMENTS — Object use karo
// Time: O(n) | Space: O(n)
// ============================================================

function frequencyCount(arr) {
  const freq = {};

  for (let val of arr) {
    // Agar pehle se key hai to +1, nahi to 1 se shuru
    freq[val] = (freq[val] || 0) + 1;
  }

  return freq;
}

console.log(frequencyCount([1, 2, 2, 3, 3, 3]));
// { '1': 1, '2': 2, '3': 3 }

// ============================================================
// SORT BY FREQUENCY — Most frequent pehle
// ============================================================

function sortByFrequency(arr) {
  const freq = frequencyCount(arr);

  // Frequency ke hisaab se descending sort
  return arr.sort((a, b) => freq[b] - freq[a]);
}

console.log(sortByFrequency([1, 1, 2, 3, 3, 3, 2]));
// [3, 3, 3, 1, 1, 2, 2]
```

---

## 4. Sort Array (All Types)

> **Problem:** Array ko alag alag tarike se sort karo.

```js
// ============================================================
// BUBBLE SORT — Brute Force
// Approach: Adjacent elements compare karo, bade ko aage bhejo
// Time: O(n²) | Space: O(1)
// ============================================================

function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {         // n-1 passes
    for (let j = 0; j < n - i - 1; j++) {   // har pass mein comparison
      if (arr[j] > arr[j + 1]) {
        // Swap karo — temp variable use karo
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22])); // [12,22,25,34,64]

// ============================================================
// SELECTION SORT
// Approach: Minimum dhundo, usse correct position pe rakho
// Time: O(n²) | Space: O(1)
// ============================================================

function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i; // assume karo current position minimum hai

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j; // naya minimum mila
      }
    }

    // Minimum ko sahi jagah pe rakho
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; // ES6 swap
    }
  }

  return arr;
}

// ============================================================
// SORT NUMBERS — JS default comparator ka trap!
// ============================================================

const nums = [10, 2, 30, 4, 100];

// WRONG — string sort hota hai by default
nums.sort(); // [10, 100, 2, 30, 4] ❌

// CORRECT — comparator function do
nums.sort((a, b) => a - b); // ascending  [2, 4, 10, 30, 100] ✅
nums.sort((a, b) => b - a); // descending [100, 30, 10, 4, 2] ✅

// ============================================================
// SORT STRINGS
// ============================================================

const words = ["banana", "apple", "cherry", "date"];
words.sort(); // ["apple", "banana", "cherry", "date"] — alphabetical ✅
words.sort((a, b) => b.localeCompare(a)); // reverse alphabetical

// ============================================================
// SORT OBJECTS BY PROPERTY
// ============================================================

const students = [
  { name: "Ali", marks: 85 },
  { name: "Sara", marks: 92 },
  { name: "Zaid", marks: 78 }
];

// Marks ke hisaab se ascending
students.sort((a, b) => a.marks - b.marks);

// Name ke hisaab se alphabetical
students.sort((a, b) => a.name.localeCompare(b.name));

// ============================================================
// SORT 0s, 1s, 2s — Dutch National Flag Problem
// Approach: Count karo, phir fill karo
// Time: O(n) | Space: O(1)
// ============================================================

function sort012(arr) {
  let count0 = 0, count1 = 0, count2 = 0;

  // Pehla pass — count karo
  for (let val of arr) {
    if (val === 0) count0++;
    else if (val === 1) count1++;
    else count2++;
  }

  // Doosra pass — fill karo
  let i = 0;
  while (count0--) arr[i++] = 0;
  while (count1--) arr[i++] = 1;
  while (count2--) arr[i++] = 2;

  return arr;
}

console.log(sort012([0, 1, 2, 0, 1, 2, 1, 0])); // [0,0,0,1,1,1,2,2]
```

---

## 5. Max & Min Element

```js
// ============================================================
// MAX & MIN — Brute Force (Manual Loop)
// Time: O(n) | Space: O(1)
// ============================================================

function findMaxMin(arr) {
  // Pehle element ko max/min maano
  let max = arr[0];
  let min = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i]; // naya max mila
    if (arr[i] < min) min = arr[i]; // naya min mila
  }

  return { max, min };
}

console.log(findMaxMin([3, 1, 7, 2, 9, 4])); // { max: 9, min: 1 }

// ============================================================
// USING reduce
// ============================================================

const arr = [3, 1, 7, 2, 9];
const max = arr.reduce((a, b) => Math.max(a, b));   // 9
const min = arr.reduce((a, b) => Math.min(a, b));   // 1

// Ya spread ke saath Math.max/min
const maxSpread = Math.max(...arr); // 9
const minSpread = Math.min(...arr); // 1

// ⚠️ Spread large arrays ke liye stack overflow de sakta hai
// Large arrays ke liye reduce prefer karo
```

---

## 6. Reverse Array

```js
// ============================================================
// REVERSE ARRAY — Brute Force (Two Pointer)
// Approach: Dono taraf se aao, swap karo, milne tak
// Time: O(n) | Space: O(1) — In-place
// ============================================================

function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap karo
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]

// ============================================================
// REVERSE — Built-in (Original modify karta hai!)
// ============================================================
[1, 2, 3].reverse(); // [3, 2, 1] — original change ho jaata hai

// Agar original preserve karna ho:
const original = [1, 2, 3];
const reversed = [...original].reverse(); // [3, 2, 1]
```

---

## 7. Remove Duplicates

```js
// ============================================================
// REMOVE DUPLICATES — Brute Force
// Approach: Har element check karo — result mein pehle se hai?
// Time: O(n²) | Space: O(n)
// ============================================================

function removeDuplicatesBrute(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    // Agar result mein nahi hai tabhi add karo
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }

  return result;
}

console.log(removeDuplicatesBrute([1, 2, 2, 3, 4, 4, 5])); // [1,2,3,4,5]

// ============================================================
// REMOVE DUPLICATES — Set (Best approach)
// Time: O(n) | Space: O(n)
// ============================================================

const unique = [...new Set([1, 2, 2, 3, 4, 4, 5])]; // [1,2,3,4,5]

// ============================================================
// REMOVE DUPLICATES — filter + indexOf
// Time: O(n²) | Space: O(1)
// ============================================================

const arr2 = [1, 2, 2, 3, 4, 4, 5];
const unique2 = arr2.filter((val, idx) => arr2.indexOf(val) === idx);
// indexOf pehli occurrence ka index deta hai
// Agar current index === pehli occurrence → unique element hai
```

---

## 8. Second Largest Element

```js
// ============================================================
// SECOND LARGEST — Brute Force
// Approach: Sort karo, peeche se doosra unique element lo
// Time: O(n log n) | Space: O(1)
// ============================================================

function secondLargestBrute(arr) {
  // Pehle sort karo descending
  const sorted = [...new Set(arr)].sort((a, b) => b - a);
  return sorted[1] ?? null; // doosra element
}

console.log(secondLargestBrute([12, 35, 1, 10, 34, 1])); // 34

// ============================================================
// SECOND LARGEST — Single Pass (Optimal)
// Approach: Ek loop mein max aur second max track karo
// Time: O(n) | Space: O(1)
// ============================================================

function secondLargest(arr) {
  let first = -Infinity;   // sabse bada
  let second = -Infinity;  // doosra bada

  for (let num of arr) {
    if (num > first) {
      second = first; // purana max ab second ban gaya
      first = num;    // naya max
    } else if (num > second && num !== first) {
      second = num;   // second max update
    }
  }

  return second === -Infinity ? null : second;
}

console.log(secondLargest([12, 35, 1, 10, 34])); // 34
console.log(secondLargest([10, 10, 10]));          // null
```

---

## 9. Rotate Array

> **Problem:** Array ko k steps right ya left rotate karo.

```js
// ============================================================
// ROTATE RIGHT — Brute Force
// Approach: k baar ek-ek position rotate karo
// Time: O(n*k) | Space: O(1)
// ============================================================

function rotateRightBrute(arr, k) {
  const n = arr.length;
  k = k % n; // agar k > n ho toh

  for (let i = 0; i < k; i++) {
    // Last element uthao, baaki sab ek aage karo
    const last = arr[n - 1];
    for (let j = n - 1; j > 0; j--) {
      arr[j] = arr[j - 1];
    }
    arr[0] = last;
  }

  return arr;
}

// ============================================================
// ROTATE — slice use karke (Clean approach)
// Time: O(n) | Space: O(n)
// ============================================================

function rotateRight(arr, k) {
  const n = arr.length;
  k = k % n;
  // Last k elements pehle, phir baaki
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}

console.log(rotateRight([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]

function rotateLeft(arr, k) {
  const n = arr.length;
  k = k % n;
  // Pehle k elements baad mein, phir baaki pehle
  return [...arr.slice(k), ...arr.slice(0, k)];
}

console.log(rotateLeft([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]
```

---

## 10. Intersection & Union

```js
// ============================================================
// INTERSECTION — Dono arrays mein common elements
// Approach: Har element check karo doosre mein hai ya nahi
// Time: O(n*m) | Space: O(n)
// ============================================================

function intersection(arr1, arr2) {
  const result = [];

  for (let val of arr1) {
    // Doosre array mein hai aur result mein nahi
    if (arr2.includes(val) && !result.includes(val)) {
      result.push(val);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3, 4], [2, 4, 6])); // [2, 4]

// Optimized — Set use karo
function intersectionSet(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter(val => set2.has(val));
}

// ============================================================
// UNION — Dono arrays ke saare unique elements
// ============================================================

function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

console.log(union([1, 2, 3], [2, 3, 4, 5])); // [1, 2, 3, 4, 5]
```

---

## 11. Missing Number

> **Problem:** 1 to n tak ke numbers mein se kaunsa missing hai?

```js
// ============================================================
// MISSING NUMBER — Formula Approach
// Approach: Expected sum - Actual sum = Missing number
// Time: O(n) | Space: O(1)
// ============================================================

function missingNumber(arr) {
  const n = arr.length; // array mein n elements hain (0 to n)
  const expectedSum = (n * (n + 1)) / 2; // formula: n*(n+1)/2

  // Actual sum nikalo
  const actualSum = arr.reduce((acc, val) => acc + val, 0);

  return expectedSum - actualSum; // difference = missing number
}

console.log(missingNumber([3, 0, 1]));       // 2
console.log(missingNumber([9,6,4,2,3,5,7,0,1])); // 8

// ============================================================
// MISSING NUMBER — Brute Force
// Approach: 1 to n tak check karo — array mein hai ya nahi
// Time: O(n²) | Space: O(1)
// ============================================================

function missingNumberBrute(arr, n) {
  for (let i = 1; i <= n; i++) {
    if (!arr.includes(i)) {
      return i; // nahi mila — ye missing hai
    }
  }
  return -1;
}

// ============================================================
// MULTIPLE MISSING NUMBERS
// ============================================================

function findAllMissing(arr, n) {
  const set = new Set(arr);
  const missing = [];

  for (let i = 1; i <= n; i++) {
    if (!set.has(i)) missing.push(i);
  }

  return missing;
}

console.log(findAllMissing([1, 3, 5, 7], 7)); // [2, 4, 6]
```

---

## 12. Move Zeros to End

```js
// ============================================================
// MOVE ZEROS TO END — Brute Force
// Approach: Non-zeros collect karo, baad mein zeros fill karo
// Time: O(n) | Space: O(n)
// ============================================================

function moveZerosBrute(arr) {
  // Pehle non-zero elements nikalo
  const nonZeros = arr.filter(val => val !== 0);
  // Baad mein zeros add karo
  const zeros = arr.filter(val => val === 0);

  return [...nonZeros, ...zeros];
}

console.log(moveZerosBrute([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]

// ============================================================
// MOVE ZEROS — Two Pointer (In-place, Optimal)
// Approach: Non-zero milne pe swap karo zero ke saath
// Time: O(n) | Space: O(1)
// ============================================================

function moveZeros(arr) {
  let pos = 0; // yahan next non-zero jayega

  // Sare non-zeros ko front pe le jao
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[pos] = arr[i];
      pos++;
    }
  }

  // Baaki positions mein zeros bharo
  while (pos < arr.length) {
    arr[pos++] = 0;
  }

  return arr;
}

console.log(moveZeros([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
```

---

## 13. Subarray with Given Sum

> **Problem:** Wo subarray dhundo jiska sum = target ho.

```js
// ============================================================
// SUBARRAY WITH GIVEN SUM — Brute Force
// Approach: Har possible subarray check karo
// Time: O(n²) | Space: O(1)
// ============================================================

function subarrayWithSum(arr, target) {
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let currentSum = 0;

    for (let j = i; j < n; j++) {
      currentSum += arr[j]; // ek ek element add karte jao

      if (currentSum === target) {
        // Subarray mila — i se j tak
        return arr.slice(i, j + 1);
      }
    }
  }

  return []; // koi subarray nahi mila
}

console.log(subarrayWithSum([1, 4, 20, 3, 10, 5], 33)); // [20, 3, 10]
console.log(subarrayWithSum([1, 2, 3, 7, 5], 12));       // [2, 3, 7]

// ============================================================
// COUNT SUBARRAYS with Given Sum
// ============================================================

function countSubarraysWithSum(arr, target) {
  let count = 0;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += arr[j];
      if (sum === target) count++;
    }
  }

  return count;
}

console.log(countSubarraysWithSum([1, 1, 1], 2)); // 2
```

---

## 14. Maximum Subarray (Kadane's)

> **Problem:** Contiguous subarray ka maximum sum nikalo.

```js
// ============================================================
// MAXIMUM SUBARRAY — Brute Force
// Approach: Har subarray ka sum nikalo, max track karo
// Time: O(n²) | Space: O(1)
// ============================================================

function maxSubarrayBrute(arr) {
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    let currentSum = 0;

    for (let j = i; j < arr.length; j++) {
      currentSum += arr[j];
      maxSum = Math.max(maxSum, currentSum); // max update karo
    }
  }

  return maxSum;
}

// ============================================================
// KADANE'S ALGORITHM — Optimal
// Approach: Ek loop mein current sum aur max sum track karo
// Time: O(n) | Space: O(1)
// ============================================================

function kadane(arr) {
  let maxSum = arr[0];     // pehle element se shuru
  let currentSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    // Ya to current element se fresh shuru karo
    // Ya pehle se chale aa rahe sum mein add karo
    currentSum = Math.max(arr[i], currentSum + arr[i]);

    // Overall maximum update karo
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6  → [4,-1,2,1]

// ============================================================
// KADANE'S — Subarray ke indices bhi nikalo
// ============================================================

function kadaneWithIndices(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      tempStart = i; // naya subarray yahan se shuru
    } else {
      currentSum += arr[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i; // subarray yahan khatam
    }
  }

  return { maxSum, subarray: arr.slice(start, end + 1) };
}

console.log(kadaneWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
// { maxSum: 6, subarray: [4, -1, 2, 1] }
```

---

## 15. Leaders in Array

> **Problem:** Array ka wo element leader hai jiska right mein koi bada nahi.

```js
// ============================================================
// LEADERS IN ARRAY — Brute Force
// Approach: Har element ke right mein check karo koi bada hai?
// Time: O(n²) | Space: O(n)
// ============================================================

function findLeadersBrute(arr) {
  const leaders = [];

  for (let i = 0; i < arr.length; i++) {
    let isLeader = true;

    for (let j = i + 1; j < arr.length; j++) {
      // Agar koi right element bada hai — leader nahi
      if (arr[j] > arr[i]) {
        isLeader = false;
        break;
      }
    }

    if (isLeader) leaders.push(arr[i]);
  }

  return leaders;
}

console.log(findLeadersBrute([16, 17, 4, 3, 5, 2])); // [17, 5, 2]
// Last element hamesha leader hota hai

// ============================================================
// LEADERS — Right se scan karo (Optimal)
// Time: O(n) | Space: O(n)
// ============================================================

function findLeaders(arr) {
  const leaders = [];
  let maxRight = arr[arr.length - 1]; // last element hamesha leader
  leaders.push(maxRight);

  // Right se left scan karo
  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] >= maxRight) {
      maxRight = arr[i];
      leaders.push(arr[i]);
    }
  }

  return leaders.reverse(); // order theek karo
}
```

---

## 16. Pair with Given Sum

> **Problem:** Array mein wo saare pairs dhundo jinka sum = target.

```js
// ============================================================
// ALL PAIRS WITH GIVEN SUM — Brute Force
// Time: O(n²) | Space: O(n)
// ============================================================

function findAllPairs(arr, target) {
  const pairs = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}

console.log(findAllPairs([1, 5, 3, 7, 4, 2, 6], 8));
// [[1,7], [5,3], [2,6]]

// ============================================================
// COUNT PAIRS with given sum
// ============================================================

function countPairs(arr, target) {
  let count = 0;
  const freq = {};

  for (let num of arr) {
    const complement = target - num;

    // Complement pehle se dikh chuka hai
    if (freq[complement]) {
      count += freq[complement];
    }

    freq[num] = (freq[num] || 0) + 1;
  }

  return count;
}

console.log(countPairs([1, 5, 7, -1, 5], 6)); // 3  → (1,5), (7,-1), (1,5)
```

---

## 17. Majority Element

> **Problem:** Wo element dhundo jo n/2 se zyada baar aata hai.

```js
// ============================================================
// MAJORITY ELEMENT — Brute Force (Frequency Count)
// Time: O(n) | Space: O(n)
// ============================================================

function majorityElementBrute(arr) {
  const freq = {};
  const n = arr.length;

  for (let num of arr) {
    freq[num] = (freq[num] || 0) + 1;

    // n/2 se zyada baar aaya — majority element
    if (freq[num] > Math.floor(n / 2)) {
      return num;
    }
  }

  return -1; // koi majority nahi
}

console.log(majorityElementBrute([3, 2, 3]));         // 3
console.log(majorityElementBrute([2, 2, 1, 1, 1, 2, 2])); // 2

// ============================================================
// MOORE'S VOTING ALGORITHM — Optimal
// Time: O(n) | Space: O(1)
// ============================================================

function majorityElement(arr) {
  let candidate = null;
  let count = 0;

  // Phase 1: Candidate dhundo
  for (let num of arr) {
    if (count === 0) {
      candidate = num; // naya candidate
    }
    count += (num === candidate) ? 1 : -1;
  }

  // Phase 2: Verify karo (zaruri nahi agar guarantee ho)
  const freq = arr.filter(n => n === candidate).length;
  return freq > Math.floor(arr.length / 2) ? candidate : -1;
}
```

---

## 18. Merge Two Sorted Arrays

```js
// ============================================================
// MERGE TWO SORTED ARRAYS — Brute Force
// Approach: Dono merge karo, sort karo
// Time: O((n+m) log(n+m)) | Space: O(n+m)
// ============================================================

function mergeSortedBrute(arr1, arr2) {
  return [...arr1, ...arr2].sort((a, b) => a - b);
}

// ============================================================
// MERGE — Two Pointer (Optimal for sorted arrays)
// Time: O(n+m) | Space: O(n+m)
// ============================================================

function mergeSorted(arr1, arr2) {
  const result = [];
  let i = 0, j = 0;

  // Dono arrays mein se chota element uthao
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }

  // Bache hue elements add karo
  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);

  return result;
}

console.log(mergeSorted([1, 3, 5, 7], [2, 4, 6, 8]));
// [1, 2, 3, 4, 5, 6, 7, 8]
```

---

## 19. Anagram Check (String + Array)

```js
// ============================================================
// ANAGRAM CHECK — Brute Force (Sort dono)
// Approach: Sort karo — equal hain to anagram
// Time: O(n log n) | Space: O(n)
// ============================================================

function isAnagramBrute(str1, str2) {
  if (str1.length !== str2.length) return false;

  // Dono ko sort karo aur compare karo
  const sort = s => s.toLowerCase().split("").sort().join("");
  return sort(str1) === sort(str2);
}

console.log(isAnagramBrute("listen", "silent")); // true
console.log(isAnagramBrute("hello", "world"));   // false

// ============================================================
// ANAGRAM — Frequency Count (Optimal)
// Time: O(n) | Space: O(1) — sirf 26 letters
// ============================================================

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const count = {};

  // str1 ke characters badhao
  for (let char of str1.toLowerCase()) {
    count[char] = (count[char] || 0) + 1;
  }

  // str2 ke characters ghatao
  for (let char of str2.toLowerCase()) {
    if (!count[char]) return false; // character nahi tha — anagram nahi
    count[char]--;
  }

  return true;
}

// ============================================================
// GROUP ANAGRAMS — Array of strings mein se group karo
// ============================================================

function groupAnagrams(words) {
  const map = {};

  for (let word of words) {
    const key = word.split("").sort().join(""); // sorted form = key

    if (!map[key]) map[key] = [];
    map[key].push(word);
  }

  return Object.values(map);
}

console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]
```

---

## 20. Flatten Nested Array

```js
// ============================================================
// FLATTEN ARRAY — Brute Force (Recursive)
// Time: O(n) | Space: O(n)
// ============================================================

function flattenRecursive(arr) {
  const result = [];

  for (let item of arr) {
    if (Array.isArray(item)) {
      // Nested array hai — recursively flatten karo
      const flatted = flattenRecursive(item);
      result.push(...flatted);
    } else {
      result.push(item); // simple value — directly push
    }
  }

  return result;
}

console.log(flattenRecursive([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]

// ============================================================
// FLATTEN — reduce use karke
// ============================================================

function flattenReduce(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenReduce(val)) : acc.concat(val),
  []);
}

// ============================================================
// FLATTEN — Built-in (depth specify karo)
// ============================================================

[1, [2, [3, [4]]]].flat();           // [1,2,[3,[4]]]   depth=1
[1, [2, [3, [4]]]].flat(2);          // [1,2,3,[4]]     depth=2
[1, [2, [3, [4]]]].flat(Infinity);   // [1,2,3,4]       full flatten
```

---

## 21. Chunk Array

> **Problem:** Array ko equal size ke groups mein divide karo.

```js
// ============================================================
// CHUNK ARRAY — Brute Force (slice use karo)
// Time: O(n) | Space: O(n)
// ============================================================

function chunkArray(arr, size) {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    // i se i+size tak ka slice lo
    result.push(arr.slice(i, i + size));
  }

  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7], 3));
// [[1,2,3], [4,5,6], [7]]

console.log(chunkArray([1, 2, 3, 4], 2));
// [[1,2], [3,4]]
```

---

## 22. Product of Array Except Self

> **Problem:** Har element ki jagah uske alawa sabka product rakh do (division use mat karo).

```js
// ============================================================
// PRODUCT EXCEPT SELF — Brute Force
// Approach: Har element ke liye baaki sab ka product nikalo
// Time: O(n²) | Space: O(n)
// ============================================================

function productExceptSelfBrute(nums) {
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    let product = 1;

    for (let j = 0; j < nums.length; j++) {
      if (i !== j) {
        product *= nums[j]; // apne aap ko skip karo
      }
    }

    result.push(product);
  }

  return result;
}

console.log(productExceptSelfBrute([1, 2, 3, 4])); // [24, 12, 8, 6]

// ============================================================
// PRODUCT EXCEPT SELF — Prefix/Suffix (Optimal)
// Time: O(n) | Space: O(n)
// ============================================================

function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Left product — har element ke left ka product
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // Right product — har element ke right ka product bhi multiply karo
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return result;
}
```

---

## 23. Longest Consecutive Sequence

```js
// ============================================================
// LONGEST CONSECUTIVE — Brute Force
// Approach: Har element se sequence shuru karo
// Time: O(n²) | Space: O(1)
// ============================================================

function longestConsecutiveBrute(nums) {
  let maxLen = 0;

  for (let num of nums) {
    let currentNum = num;
    let currentLen = 1;

    // Agla consecutive number dhundo
    while (nums.includes(currentNum + 1)) {
      currentNum++;
      currentLen++;
    }

    maxLen = Math.max(maxLen, currentLen);
  }

  return maxLen;
}

// ============================================================
// LONGEST CONSECUTIVE — Set use karo (Optimal)
// Time: O(n) | Space: O(n)
// ============================================================

function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let maxLen = 0;

  for (let num of numSet) {
    // Sirf tabhi sequence shuru karo jab num-1 set mein nahi
    // (ye sequence ka starting point hai)
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentLen = 1;

      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentLen++;
      }

      maxLen = Math.max(maxLen, currentLen);
    }
  }

  return maxLen;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4  → [1,2,3,4]
```

---

## 24. 3Sum Problem

> **Problem:** Array mein 3 numbers dhundo jinka sum = 0 ho.

```js
// ============================================================
// 3SUM — Brute Force (Triple Nested Loop)
// Time: O(n³) | Space: O(1)
// ============================================================

function threeSumBrute(nums) {
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);

          // Duplicate check
          const str = triplet.toString();
          if (!result.some(r => r.toString() === str)) {
            result.push(triplet);
          }
        }
      }
    }
  }

  return result;
}

// ============================================================
// 3SUM — Sort + Two Pointer (Optimal)
// Time: O(n²) | Space: O(1)
// ============================================================

function threeSum(nums) {
  nums.sort((a, b) => a - b); // pehle sort karo
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Duplicate skip karo
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        // Duplicates skip karo
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;  // sum chhota — left badhao
      } else {
        right--; // sum bada — right ghatao
      }
    }
  }

  return result;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));
// [[-1,-1,2], [-1,0,1]]
```

---

## 25. Best Time to Buy & Sell Stock

> **Problem:** Ek hi transaction mein maximum profit kya hoga?

```js
// ============================================================
// BUY & SELL STOCK — Brute Force
// Approach: Har pair try karo
// Time: O(n²) | Space: O(1)
// ============================================================

function maxProfitBrute(prices) {
  let maxProfit = 0;

  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const profit = prices[j] - prices[i]; // sell - buy
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}

// ============================================================
// BUY & SELL STOCK — Single Pass (Optimal)
// Approach: Min price track karo, max profit calculate karo
// Time: O(n) | Space: O(1)
// ============================================================

function maxProfit(prices) {
  let minPrice = Infinity; // sabse sasta price
  let maxProfit = 0;

  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price; // naya minimum — yahan kharido
    } else {
      // Agar aaj bechein to kitna profit?
      const profit = price - minPrice;
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5  → buy at 1, sell at 6
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0  → koi profit nahi
```

---

## ⚡ Quick Time Complexity Reference

| Problem | Brute Force | Optimized |
|---------|-------------|-----------|
| Two Sum | O(n²) | O(n) HashMap |
| Find Duplicate | O(n²) | O(n) Set/Freq |
| Sort (Bubble) | O(n²) | O(n log n) built-in |
| Max Subarray | O(n²) | O(n) Kadane's |
| Missing Number | O(n²) | O(n) Formula |
| 3Sum | O(n³) | O(n²) Two Pointer |
| Longest Consecutive | O(n²) | O(n) Set |
| Product Except Self | O(n²) | O(n) Prefix/Suffix |
| Buy & Sell Stock | O(n²) | O(n) Single Pass |
| Anagram Check | O(n log n) | O(n) Freq Count |

---

## 🎯 Interview Mein Yeh Steps Follow Karo

```
1. Problem samjho — example ke saath confirm karo
2. Brute force batao — phir optimize karo
3. Time & Space complexity batao
4. Edge cases batao: [], [1], null, duplicates, negative numbers
5. Code likhte waqt variable ke naam meaningful rakho
6. Dry run karo apne example pe
```

---

*All the best! 🚀 You've got this!*