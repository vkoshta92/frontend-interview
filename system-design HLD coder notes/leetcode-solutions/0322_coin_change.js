/**
 * Question Name: Coin Change
 * Question Number: 322
 * Serial Number: 322
 * Problem Link: https://leetcode.com/problems/coin-change/
 */

/**
 * Hinglish Explanation:
 * Humein different denominations ke coins diye gaye hain aur ek 'amount'.
 * Humein batana hai ki minimum kitne coins lagenge us amount ko banane ke liye.
 * 
 * Logic (DP - Bottom Up):
 * 1. Hum ek array `dp` banayenge size `amount + 1` ka, aur use Infinity se fill karenge.
 * 2. dp[0] = 0 (0 amount ke liye 0 coins chahiye).
 * 3. Har amount `i` (from 1 to amount) ke liye hum saare coins check karenge.
 * 4. Agar coin ki value `i` se kam hai, toh: dp[i] = min(dp[i], dp[i - coin] + 1).
 * 5. Last mein agar dp[amount] Infinity hi hai, toh return -1.
 */

/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
};

// Test Case
console.log("Test Case: coins = [1,2,5], amount = 11");
console.log("Output:", coinChange([1, 2, 5], 11)); // Expected: 3 (5+5+1)
