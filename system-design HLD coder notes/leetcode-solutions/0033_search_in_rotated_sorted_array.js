/**
 * Question Name: Search in Rotated Sorted Array
 * Question Number: 33
 * Serial Number: 33
 * Problem Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
 */

/**
 * Hinglish Explanation:
 * Ek sorted array kisi unknown pivot pe rotate kiya gaya hai (e.g., [4,5,6,7,0,1,2]).
 * Humein isme ek 'target' element dhundhna hai binary search se O(log n) time mein.
 * 
 * Logic:
 * 1. Standard Binary Search chalayenge (left, right, mid).
 * 2. Mid element nikaalne ke baad check karenge ki left side sorted hai ya right side.
 * 3. Agar `nums[left] <= nums[mid]`, toh left portion sorted hai. 
 *    Check karein ki target isi range mein hai ya nahi.
 * 4. Agar nahi, toh right portion sorted hoga.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) return mid;

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
};

// Test Case
console.log("Test Case: nums = [4,5,6,7,0,1,2], target = 0");
console.log("Output Index:", search([4, 5, 6, 7, 0, 1, 2], 0)); // Expected: 4
