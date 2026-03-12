/**
 * Question Name: Jump Game II
 * Question Number: 45
 * Serial Number: 45
 * Problem Link: https://leetcode.com/problems/jump-game-ii/
 */

/**
 * Hinglish Explanation:
 * Humein last index tak pahunchna hai, par is baar humein 'minimum jumps' batane hain.
 * 
 * Logic (Greedy):
 * 1. Hum teen variables rakhenge: `jumps` (total jumps), `currentEnd` (current jump jahan tak ja sakta hai),
 *    aur `farthest` (sabse dur wala point jo reachable hai).
 * 2. Array pe loop chalayenge (last element se pehle tak).
 * 3. Har step pe `farthest` update karenge: farthest = max(farthest, i + nums[i]).
 * 4. Jab hum `currentEnd` pe pahunch jayenge, toh humein ek jump leni hi padegi.
 * 5. Jump count badhayenge aur `currentEnd` ko naya `farthest` bana denge.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;

    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;

            if (currentEnd >= nums.length - 1) break;
        }
    }

    return jumps;
};

// Test Case
console.log("Test Case: nums = [2,3,1,1,4]");
console.log("Output (min jumps):", jump([2, 3, 1, 1, 4])); // Expected: 2 (0->1->4)
