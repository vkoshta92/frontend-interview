/**
 * Question Name: Minimum Window Substring
 * Question Number: 76
 * Serial Number: 76
 * Problem Link: https://leetcode.com/problems/minimum-window-substring/
 */

/**
 * Hinglish Explanation:
 * Do strings 's' aur 't' di gayi hain. Humein 's' ki sabse choti substring batani hai
 * jisme 't' ke saare characters (including duplicates) aa jayein.
 * 
 * Logic (Sliding Window):
 * 1. Ek map banayein 't' ke characters ki frequency count karne ke liye.
 * 2. 'left' aur 'right' pointers se window banayein.
 * 3. Jab tak window mein 't' ke saare characters nahi milte, 'right' pointer ko aage badhayein.
 * 4. Jaise hi condition poori ho, window ko chota karne ki koshish karein (left++) 
 *    taaki 'minimum' window mil sake.
 */

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
    if (t.length > s.length) return "";

    let needed = {};
    for (let char of t) {
        needed[char] = (needed[char] || 0) + 1;
    }

    let left = 0, right = 0;
    let requiredCount = Object.keys(needed).length;
    let formed = 0;
    let windowCounts = {};
    let ans = [-1, 0, 0]; // [length, left, right]

    while (right < s.length) {
        let char = s[right];
        windowCounts[char] = (windowCounts[char] || 0) + 1;

        if (needed[char] && windowCounts[char] === needed[char]) {
            formed++;
        }

        while (left <= right && formed === requiredCount) {
            char = s[left];
            if (ans[0] === -1 || right - left + 1 < ans[0]) {
                ans = [right - left + 1, left, right];
            }

            windowCounts[char]--;
            if (needed[char] && windowCounts[char] < needed[char]) {
                formed--;
            }
            left++;
        }
        right++;
    }

    return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
};

// Test Case
console.log("Test Case: s = 'ADOBECODEBANC', t = 'ABC'");
console.log("Output:", minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
