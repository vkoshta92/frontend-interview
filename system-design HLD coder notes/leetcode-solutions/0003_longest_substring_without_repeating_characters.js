/**
 * Question Name: Longest Substring Without Repeating Characters
 * Question Number: 3
 * Serial Number: 3
 * Problem Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
 */

/**
 * Hinglish Explanation:
 * Ek string 's' di gayi hai, humein sabse lambi substring ki length bataani hai jisme koi repeat character na ho.
 * 
 * Logic (Sliding Window):
 * 1. Hum do pointers use karenge 'left' aur 'right' jo hamari window banayenge.
 * 2. Ek 'Set' ya Map use karenge characters ko track karne ke liye.
 * 3. 'right' pointer ko aage badhayenge. Agar character repeat ho raha hai, toh 'left' pointer ko 
 *    tab tak aage badhayenge jab tak repeating character bahar na ho jaaye.
 * 4. Har step pe maxLength = max(maxLength, current window size) update karenge.
 */

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let set = new Set();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        while (set.has(s[right])) {
            set.delete(s[left]);
            left++;
        }
        set.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
};

// Test Case
console.log("Test Case 1: s = 'abcabcbb'");
console.log("Output:", lengthOfLongestSubstring("abcabcbb")); // Expected: 3
