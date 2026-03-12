/**
 * Question Name: Maximum Subarray
 * Question Number: 53
 * Serial Number: 53
 * Problem Link: https://leetcode.com/problems/maximum-subarray/
 */

/**
 * Hinglish Explanation:
 * Ek integer array mein se woh subarray dhundhna hai jiska sum sabse zyada ho.
 * Iske liye hum Kadane's Algorithm use karenge.
 * 
 * Logic:
 * 1. Hum do variables rakhenge: `currentSum` aur `maxSum`.
 * 2. Array pe loop chalayenge aur har element ko `currentSum` mein add karenge.
 * 3. Agar `currentSum`, `maxSum` se bada ho jaye, toh `maxSum` ko update karenge.
 * 4. Agar `currentSum` negative ho jaye, toh use 0 kar denge (kyunki negative sum aage jaake faida nahi dega).
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    let maxSum = nums[0];
    let currentSum = 0;

    for (let num of nums) {
        currentSum += num;
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
        if (currentSum < 0) {
            currentSum = 0;
        }
    }

    return maxSum;
};

// Test Case
console.log("Test Case: nums = [-2,1,-3,4,-1,2,1,-5,4]");
console.log("Output:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Expected: 6
