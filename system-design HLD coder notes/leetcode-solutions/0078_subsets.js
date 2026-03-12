/**
 * Question Name: Subsets
 * Question Number: 78
 * Serial Number: 78
 * Problem Link: https://leetcode.com/problems/subsets/
 */

/**
 * Hinglish Explanation:
 * Ek array ke saare possible subsets (power set) nikaalne hain.
 * 
 * Logic (Backtracking):
 * 1. Har element ke liye hamesha do choices hoti hain: ya toh use subset mein 'shamil karo' ya 'mat karo'.
 * 2. Result array mein har step pe current subset ko push karte jayenge.
 * 3. Loop chalayenge jisme hum index ko aage badhaate rahenge.
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
    let result = [];

    function backtrack(start, current) {
        result.push([...current]);

        for (let i = start; i < nums.length; i++) {
            // Include
            current.push(nums[i]);
            // Recurse next index
            backtrack(i + 1, current);
            // Backtrack/Remove
            current.pop();
        }
    }

    backtrack(0, []);
    return result;
};

// Test Case
console.log("Test Case: [1,2,3]");
console.log("Output:", JSON.stringify(subsets([1, 2, 3])));
