/**
 * Question Name: Next Permutation
 * Question Number: 31
 * Serial Number: 31
 * Problem Link: https://leetcode.com/problems/next-permutation/
 */

/**
 * Hinglish Explanation:
 * Humein array ka next lexicographical permutation nikaalna hai.
 * Agar next permutation possible nahi hai (matlab array sorted in descending order),
 * toh array ko reverse karke lowest possible order (sorted ascending) mein laana hai.
 * 
 * Logic:
 * 1. Piche se start karke pehla aisa element dhundho (i) jo apne aage wale element (i+1) se chota ho.
 * 2. Agar aisa i nahi milta, array reversed hai, toh poora reverse kar do.
 * 3. Agar i mil gaya, toh i ke aage wale elements mein se sabse chota element dhundho (j) jo nums[i] se bada ho.
 * 4. nums[i] aur nums[j] ko swap karo.
 * 5. Index i+1 se lekar end tak ke elements ko reverse kar do (taaki smallest sequence bane).
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
    let i = nums.length - 2;
    // Step 1: Find the first decreasing element from the end
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    if (i >= 0) {
        // Step 2: Find the largest index j such that nums[j] > nums[i]
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        // Step 3: Swap nums[i] and nums[j]
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // Step 4: Reverse the elements from i + 1 to the end
    reverse(nums, i + 1);
};

function reverse(nums, start) {
    let end = nums.length - 1;
    while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
    }
}

// Test Case
let nums = [1, 2, 3];
nextPermutation(nums);
console.log("Test Case: [1,2,3]");
console.log("Output:", nums); // Expected: [1,3,2]
