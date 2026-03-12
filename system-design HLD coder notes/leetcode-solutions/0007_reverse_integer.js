/**
 * Question Name: Reverse Integer
 * Question Number: 7
 * Serial Number: 7
 * Problem Link: https://leetcode.com/problems/reverse-integer/
 */

/**
 * Hinglish Explanation:
 * Ek integer 'x' ko reverse karna hai. Agar number 32-bit limit ke bahar jata hai toh 0 return karna hai.
 * 
 * Logic:
 * 1. Number ka sign (+/-) alag kar lenge.
 * 2. Number ko string bana kar reverse kar sakte hain ya mathematical tarike se (% 10).
 * 3. Yahan hum asaan string method use karenge.
 * 4. Last mein check karenge ki result [-2^31, 2^31 - 1] range mein hai ya nahi.
 */

/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
    const isNegative = x < 0;
    const res = parseInt(Math.abs(x).toString().split('').reverse().join(''));

    if (res > Math.pow(2, 31) - 1) return 0;

    return isNegative ? -res : res;
};

// Test Case
console.log("Test Case: x = 123");
console.log("Output:", reverse(123)); // Expected: 321
console.log("Test Case: x = -123");
console.log("Output:", reverse(-123)); // Expected: -321
