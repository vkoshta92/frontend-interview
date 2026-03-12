/**
 * Question Name: Valid Parentheses
 * Question Number: 20
 * Serial Number: 20
 * Problem Link: https://leetcode.com/problems/valid-parentheses/
 */

/**
 * Hinglish Explanation:
 * Humein ek string 's' di gayi hai jisme brackets hain '(', ')', '{', '}', '[', ']'.
 * Humein check karna hai ki string valid hai ya nahi (brackets sahi order mein band ho rahe hain).
 * 
 * Logic:
 * 1. Hum ek Stack use karenge.
 * 2. Jab koi opening bracket mile, use stack mein push karein.
 * 3. Jab koi closing bracket mile, check karein ki stack ka top element uska sahi pair hai ya nahi.
 * 4. Agar pair match karta hai, toh pop karein, nahi toh invalid.
 * 5. Last mein stack empty hona chahiye.
 */

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.length === 0;
};

// Test Case
console.log("Test Case: '()[]{}'");
console.log("Output:", isValid("()[]{}")); // Expected: true
console.log("Test Case: '(]' ");
console.log("Output:", isValid("(]"));    // Expected: false
