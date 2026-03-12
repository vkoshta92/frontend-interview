/**
 * Question Name: Kth Largest Element in an Array
 * Question Number: 215
 * Serial Number: 215
 * Problem Link: https://leetcode.com/problems/kth-largest-element-in-an-array/
 */

/**
 * Hinglish Explanation:
 * Ek unsorted array mein `k`-th sabse bada number nikaalna hai.
 * 
 * Logic:
 * 1. Sabse asaan tarikha: Array ko sort karo descending order mein aur `k-1` index ka element return karo.
 * 2. Optimized tarikha: Min-Heap use karein. Heap size `k` rakhein.
 * 3. Yahan hum simplification ke liye sorting use kar rahe hain (O(n log n)).
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
    // Basic sorting approach
    nums.sort((a, b) => b - a);
    return nums[k - 1];
};

// Test Case
console.log("Test Case: nums = [3,2,3,1,2,4,5,5,6], k = 4");
console.log("Output:", findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // Expected: 4
