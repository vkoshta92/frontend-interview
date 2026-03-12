/**
 * Question Name: Palindrome Number
 * Question Number: 9
 * Serial Number: 9
 * Problem Link: https://leetcode.com/problems/palindrome-number/
 */

/**
 * Hinglish Explanation:
 * Batana hai ki koi number palindrome hai ya nahi (jaise 121 palindrome hai, -121 nahi).
 * Bina string use kiye solve karne ki koshish karein.
 * 
 * Logic:
 * 1. Negative numbers kabhi palindrome nahi hote.
 * 2. Number ko reverse karein mathematical formula se: reverse = reverse * 10 + (n % 10).
 * 3. Check karein ki original number aur reversed number same hain ya nahi.
 */

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
    if (x < 0) return false;

    let original = x;
    let reversed = 0;

    while (x > 0) {
        reversed = reversed * 10 + (x % 10);
        x = Math.floor(x / 10);
    }

    return original === reversed;
};

// Test Case
console.log("Test Case: x = 121");
console.log("Output:", isPalindrome(121)); // Expected: true
console.log("Test Case: x = -121");
console.log("Output:", isPalindrome(-121)); // Expected: false
