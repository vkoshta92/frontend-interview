/**
 * Question Name: Jump Game
 * Question Number: 55
 * Serial Number: 55
 * Problem Link: https://leetcode.com/problems/jump-game/
 */

/**
 * Hinglish Explanation:
 * Humein ek array mein jumps ki range di gayi hai. Saala question hai ki kya hum last index tak pahunch sakte hain?
 * 
 * Logic (Greedy):
 * 1. Hum ek variable rakhenge `farthest` (sabse dur jahan tak hum ja sakte hain).
 * 2. Array pe loop chalayenge.
 * 3. Agar kabhi current index `i` hamare `farthest` se bada ho gaya, matlab hum yahan tak pahunch hi nahi sakte.
 * 4. Har index pe update karenge: farthest = max(farthest, i + nums[i]).
 * 5. Agar farthest array ke end tak pahunch jaye, toh true return karein.
 */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
    let farthest = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > farthest) return false;
        farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
};

// Test Case
console.log("Test Case: nums = [2,3,1,1,4]");
console.log("Output:", canJump([2, 3, 1, 1, 4])); // Expected: true
console.log("Test Case: nums = [3,2,1,0,4]");
console.log("Output:", canJump([3, 2, 1, 0, 4])); // Expected: false
