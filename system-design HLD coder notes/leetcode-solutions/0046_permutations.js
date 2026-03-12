/**
 * Question Name: Permutations
 * Question Number: 46
 * Serial Number: 46
 * Problem Link: https://leetcode.com/problems/permutations/
 */

/**
 * Hinglish Explanation:
 * Ek array ke saare possible permutations (combinations with order) nikaalne hain.
 * 
 * Logic (Backtracking):
 * 1. Hum ek function banayenge jo current permutation build karega.
 * 2. Humein track rakhna hoga ki kaunse elements use ho chuke hain (using 'visited' array ya temporary swap).
 * 3. Har position ke liye hum available elements mein se ek pick karenge.
 * 4. Choice karne ke baad recursion call karenge.
 * 5. Recursion se wapas aate waqt 'backtrack' karenge (wo choice hatayenge) taaki nayi choice try kar sakein.
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    let result = [];

    function backtrack(current, used) {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }

        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;

            // Choose
            current.push(nums[i]);
            used[i] = true;

            // Recurse
            backtrack(current, used);

            // Backtrack
            current.pop();
            used[i] = false;
        }
    }

    backtrack([], Array(nums.length).fill(false));
    return result;
};

// Test Case
console.log("Test Case: [1,2,3]");
console.log("Output:", JSON.stringify(permute([1, 2, 3])));
