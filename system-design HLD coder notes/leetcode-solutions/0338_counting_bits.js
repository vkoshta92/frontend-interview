/**
 * Question Name: Counting Bits
 * Question Number: 338
 * Serial Number: 338
 * Problem Link: https://leetcode.com/problems/counting-bits/
 */

/**
 * Hinglish Explanation:
 * Ek number `n` diya gaya hai. Humein 0 se lekar `n` tak har number ke liye batana hai
 * ki uske binary form mein kitne '1' bits hain. O(n) mein karna hai.
 * 
 * Logic (DP + Bit manipulation):
 * 1. Hum jaante hain ki kisi `i` number mein kitne bits hain ye uske pichle numbers se nikaala ja sakta hai.
 * 2. Pattern: `ans[i] = ans[i >> 1] + (i % 2)`.
 *    Matlab, `i` ke bits honge (`i/2` ke bits) + (agar `i` odd hai toh ek extra 1 bit).
 */

/**
 * @param {number} n
 * @return {number[]}
 */
var countBits = function (n) {
    let ans = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        ans[i] = ans[i >> 1] + (i & 1);
    }
    return ans;
};

// Test Case
console.log("Test Case: n = 5");
console.log("Output:", countBits(5)); // Expected: [0,1,1,2,1,2] (0, 1, 10, 11, 100, 101)
