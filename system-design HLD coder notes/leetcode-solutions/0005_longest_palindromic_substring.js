/**
 * Question Name: Longest Palindromic Substring
 * Question Number: 5
 * Serial Number: 5
 * Problem Link: https://leetcode.com/problems/longest-palindromic-substring/
 */

/**
 * Hinglish Explanation:
 * Ek string mein sabse lamba palindrome substring dhundhna hai. Palindrome matlab ulta seedha ek samaan.
 * 
 * Logic (Expand Around Center):
 * 1. Har character (ya character gap) ko palindrome ka center maan kar baahar ki taraf expand karenge.
 * 2. Odd length (ek character center) aur Even length (do characters center) dono check karenge.
 * 3. Jo sabse lamba stretch milega, use store kar lenge.
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    if (s.length < 1) return "";
    let start = 0, end = 0;

    for (let i = 0; i < s.length; i++) {
        let len1 = expandAroundCenter(s, i, i);     // Odd length
        let len2 = expandAroundCenter(s, i, i + 1); // Even length
        let len = Math.max(len1, len2);

        if (len > end - start) {
            start = i - Math.floor((len - 1) / 2);
            end = i + Math.floor(len / 2);
        }
    }

    return s.substring(start, end + 1);
};

function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}

// Test Case
console.log("Test Case: s = 'babad'");
console.log("Output:", longestPalindrome("babad")); // Expected: "bab" or "aba"
