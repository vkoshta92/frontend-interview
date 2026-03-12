/**
 * Question Name: Climbing Stairs
 * Question Number: 70
 * Serial Number: 70
 * Problem Link: https://leetcode.com/problems/climbing-stairs/
 */

/**
 * Hinglish Explanation:
 * Ek seedhi charhni hai jisme 'n' steps hain. Har baar aap ya toh 1 step le sakte ho ya 2 steps.
 * Humein batana hai ki total kitne unique tarike hain 'n' steps tak pahunchne ke liye.
 * 
 * Logic (Dynamic Programming):
 * 1. Ye asaliyat mein Fibonacci sequence hi hai.
 * 2. `n` steps pe pahunchne ke liye, aap ya toh `n-1` se 1 jump karoge ya `n-2` se 2 jumps.
 * 3. So, Total ways(n) = ways(n-1) + ways(n-2).
 * 4. Hum ek table `dp` use karenge ya bas do variables (prev1, prev2) track karne ke liye.
 */

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    if (n <= 2) return n;

    let prev2 = 1; // n = 1
    let prev1 = 2; // n = 2
    let current = 0;

    for (let i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return current;
};

// Test Case
console.log("Test Case: n = 5");
console.log("Output:", climbStairs(5)); // Expected: 8
