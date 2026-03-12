/**
 * Question Name: Remove Element
 * Question Number: 27
 * Serial Number: 27
 * Problem Link: https://leetcode.com/problems/remove-element/
 */

/**
 * Hinglish Explanation:
 * Ek array 'nums' aur ek 'val' diya gaya hai. Humein array mein se 'val' ke saare instances hataane hain.
 * Ye kaam in-place karna hai aur nayi length return karni hai.
 * 
 * Logic:
 * 1. Hum ek pointer 'k' rakhenge jo track karega ki valid elements kahan tak hain.
 * 2. Array pe loop chalayenge.
 * 3. Agar current element 'val' ke barabar nahi hai, toh use 'k' position pe daal denge aur 'k' ko badha denge.
 */

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
};

// Test Case
let nums = [0, 1, 2, 2, 3, 0, 4, 2];
let val = 2;
console.log("Test Case: nums = [0,1,2,2,3,0,4,2], val = 2");
console.log("New length:", removeElement(nums, val), "Modified array prefix:", nums.slice(0, 5));
