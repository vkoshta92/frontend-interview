/**
 * Question Name: Regular Expression Matching
 * Question Number: 10
 * Serial Number: 10
 * Problem Link: https://leetcode.com/problems/regular-expression-matching/
 */

/**
 * Hinglish Explanation:
 * Humein support karna hai '.' (any single character) aur '*' (zero or more of preceding element).
 * Ye ek Hard problem hai jo Recursion ya Dynamic Programming se solve hoti hai.
 * 
 * Logic (DP):
 * 1. Hum ek table `dp[i][j]` banate hain jo batata hai ki `s[0...i]` patterns `p[0...j]` se match karta hai ya nahi.
 * 2. Case 1: Agar matches `(s[i] == p[j] or p[j] == '.')` -> `dp[i][j] = dp[i-1][j-1]`
 * 3. Case 2: Agar `p[j] == '*'` -> zero occurrence ya one/more occurrence handle karte hain.
 */

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
    const dp = Array.from({ length: s.length + 1 }, () => Array(p.length + 1).fill(false));
    dp[0][0] = true;

    for (let j = 1; j <= p.length; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    for (let i = 1; i <= s.length; i++) {
        for (let j = 1; j <= p.length; j++) {
            if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (p[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2];
                if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            }
        }
    }

    return dp[s.length][p.length];
};

// Test Case
console.log("Test Case: s = 'aa', p = 'a*'");
console.log("Output:", isMatch("aa", "a*")); // Expected: true
