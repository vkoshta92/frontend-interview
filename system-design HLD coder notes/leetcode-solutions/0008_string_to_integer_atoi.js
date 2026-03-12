/**
 * Question Name: String to Integer (atoi)
 * Question Number: 8
 * Serial Number: 8
 * Problem Link: https://leetcode.com/problems/string-to-integer-atoi/
 */

/**
 * Hinglish Explanation:
 * Ek string ko integer mein convert karna hai (atoi function).
 * White spaces hatane hain, +/- check karna hai, aur non-digit characters aate hi ruk jana hai.
 * 
 * Logic:
 * 1. String ke start se whitespace hataiye (trim).
 * 2. Sign check karein.
 * 3. Digits read karein jab tak koi non-digit na mil jaye.
 * 4. 32-bit overflow check karein.
 */

/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
    let i = 0;
    let sign = 1;
    let res = 0;
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;

    s = s.trim();
    if (s.length === 0) return 0;

    if (s[i] === '-' || s[i] === '+') {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }

    while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        res = res * 10 + (s[i] - '0');
        if (res * sign >= INT_MAX) return INT_MAX;
        if (res * sign <= INT_MIN) return INT_MIN;
        i++;
    }

    return res * sign;
};

// Test Case
console.log("Test Case: s = '   -42'");
console.log("Output:", myAtoi("   -42")); // Expected: -42
