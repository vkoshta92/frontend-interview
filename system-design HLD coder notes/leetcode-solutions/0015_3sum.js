/**
 * Question Name: 3Sum
 * Question Number: 15
 * Serial Number: 15
 * Problem Link: https://leetcode.com/problems/3sum/
 */

/**
 * Hinglish Explanation:
 * Array mein se aise teen numbers nikaalne hain jinka sum zero ho. Duplicates nahi hone chahiye.
 * 
 * Logic:
 * 1. Pehle array ko sort kar lo (Sorting se duplicate handle karna asaan hota hai).
 * 2. Loop chalao 'i' index ke liye.
 * 3. 'i' ke aage ke part mein Two-Sum strategy (two pointers) lagao.
 * 4. Agar sum < 0: left++ (bada number chahiye).
 * 5. Agar sum > 0: right-- (chota number chahiye).
 * 6. Duplicate values ko skip karne ka dhyaan rakhein.
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
    let result = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicate for i
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            let sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                // Skip duplicates for left and right
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
};

// Test Case
console.log("Test Case: [-1,0,1,2,-1,-4]");
console.log("Output:", threeSum([-1, 0, 1, 2, -1, -4])); // Expected: [[-1,-1,2],[-1,0,1]]
