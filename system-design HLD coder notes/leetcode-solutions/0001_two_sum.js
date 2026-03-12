/**
 * Question Name: Two Sum
 * Question Number: 1
 * Serial Number: 1
 * Problem Link: https://leetcode.com/problems/two-sum/
 */

/**
 * Hinglish Explanation:
 * Humein ek array 'nums' aur ek 'target' number diya gaya hai.
 * Humein do aise numbers ke indices dhundhne hain jinka sum 'target' ke barabar ho.
 * 
 * Logic:
 * 1. Hum ek 'Map' (hash map) use karenge taaki hum saath-saath numbers ko store kar sakein.
 * 2. Array pe loop chalayenge.
 * 3. Har number (nums[i]) ke liye, hum check karenge ki 'target - nums[i]' (jo complement hai) 
 *    wo map mein pehle se hai ya nahi.
 * 4. Agar hai, toh humein hamari jodi mil gayi! Hum dono indices return kar denge.
 * 5. Agar nahi hai, toh current number ko uske index ke saath map mein daal denge.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
};

// Test Case
console.log("Test Case 1: nums = [2,7,11,15], target = 9");
console.log("Output:", twoSum([2,7,11,15], 9)); // Expected: [0, 1]
