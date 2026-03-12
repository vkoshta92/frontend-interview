/**
 * Question Name: Single Number
 * Question Number: 136
 * Serial Number: 136
 * Problem Link: https://leetcode.com/problems/single-number/
 */

/**
 * Hinglish Explanation:
 * Array mein har element do baar aata hai, siway ek element ke jo sirf ek baar aata hai.
 * Humein woh single element dhundhna hai O(n) time aur constant extra space mein.
 * 
 * Logic (XOR Trick):
 * 1. Bitwise XOR (^) ki ek property hai: `A ^ A = 0` aur `A ^ 0 = A`.
 * 2. Agar hum saare elements ko aapas mein XOR karte jayein, toh jo repeat ho rahe hain wo ek dusre ko cancel out kar denge (ban jayenge 0).
 * 3. Aakhir mein jo element bachega, wohi hamara 'single' element hoga.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
    let result = 0;
    for (let num of nums) {
        result ^= num;
    }
    return result;
};

// Test Case
console.log("Test Case: nums = [4,1,2,1,2]");
console.log("Output:", singleNumber([4, 1, 2, 1, 2])); // Expected: 4
