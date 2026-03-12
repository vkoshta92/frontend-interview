/**
 * Question Name: Number of 1 Bits (Hamming Weight)
 * Question Number: 191
 * Serial Number: 191
 * Problem Link: https://leetcode.com/problems/number-of-1-bits/
 */

/**
 * Hinglish Explanation:
 * Humein ek positive integer ka binary form dekhna hai aur count karna hai ki usme kitne '1' hain (set bits).
 * 
 * Logic:
 * 1. Sabse asaan tarikha: Number ko binary string banao aur '1' count karo.
 * 2. Bitwise Trick: `n = n & (n - 1)` karne se hamesha sabse right-most '1' bit zero ho jata hai.
 * 3. Hum tab tak loop chalayenge jab tak `n` zero na ho jaye.
 * 4. Loop jitni baar chalega, utne hi '1' bits honge.
 */

/**
 * @param {number} n
 * @return {number}
 */
var hammingWeight = function (n) {
    let count = 0;
    while (n !== 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
};

// Test Case
console.log("Test Case: n = 11 (binary 1011)");
console.log("Output:", hammingWeight(11)); // Expected: 3
