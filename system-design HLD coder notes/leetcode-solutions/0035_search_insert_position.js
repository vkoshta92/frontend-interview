/**
 * Question Name: Search Insert Position
 * Question Number: 35
 * Serial Number: 35
 * Problem Link: https://leetcode.com/problems/search-insert-position/
 */

/**
 * Hinglish Explanation:
 * Ek sorted array mein 'target' dhundhna hai. Agar target hai, toh uska index return karein.
 * Agar nahi hai, toh wo index return karein jahan use insert kiya ja sake taaki array sorted rahe.
 * Binary Search use karna hai O(log n) ke liye.
 * 
 * Logic:
 * 1. Binary search lagaiye.
 * 2. Agar target mil gaya, return mid.
 * 3. Agar loop khatam ho gaya aur target nahi mila, toh 'left' pointer hi woh sahi insertion position hogi.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) return mid;
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return left;
};

// Test Case
console.log("Test Case: nums = [1,3,5,6], target = 5");
console.log("Output Index:", searchInsert([1, 3, 5, 6], 5)); // Expected: 2
console.log("Test Case: nums = [1,3,5,6], target = 2");
console.log("Output Index:", searchInsert([1, 3, 5, 6], 2)); // Expected: 1
