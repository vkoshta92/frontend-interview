/**
 * Question Name: Remove Duplicates from Sorted Array
 * Question Number: 26
 * Serial Number: 26
 * Problem Link: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 */

/**
 * Hinglish Explanation:
 * Ek sorted array mein se duplicates hatane hain in-place (matlab naya array nahi banana).
 * Array ka size modify nahi kar sakte, bas starting elements ko unique rakhna hai.
 * 
 * Logic:
 * 1. Do pointers use karenge: 'i' (unique element tracker) aur 'j' (poora array traverse karne ke liye).
 * 2. 'i' tabhi aage badhega jab humein koi naya (unique) element milega.
 * 3. Naya element milte hi use 'i+1' position pe rakh denge.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
    if (nums.length === 0) return 0;

    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[j] !== nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }

    return i + 1;
};

// Test Case
let nums = [1, 1, 2];
console.log("Test Case: nums = [1,1,2]");
console.log("New length:", removeDuplicates(nums), "Modified array:", nums.slice(0, 2)); // Expected: 2, [1, 2]
