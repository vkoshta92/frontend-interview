/**
 * Question Name: Trapping Rain Water
 * Question Number: 42
 * Serial Number: 42
 * Problem Link: https://leetcode.com/problems/trapping-rain-water/
 */

/**
 * Hinglish Explanation:
 * Humein ek array 'height' di gayi hai jo bars ki unchai batati hai.
 * Humein ye batana hai ki baarish ke baad in bars ke beech kitna paani jama (trap) hoga.
 * 
 * Logic (Two Pointers):
 * 1. Hum do pointers use karenge, 'left' (shuruat mein) aur 'right' (anth mein).
 * 2. Saath hi do variables rakhenge 'leftMax' aur 'rightMax' jo ab tak ki sabse badi height track karein.
 * 3. Jo side choti hai (left ya right), wahan ka paani calculate karenge kyunki paani choti side se decide hota hai.
 * 4. Agar current height max se kam hai, toh paani trap hoga (max - current). 
 * 5. Agar zyada hai, toh max ko update karenge.
 */

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += (leftMax - height[left]);
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += (rightMax - height[right]);
            }
            right--;
        }
    }

    return totalWater;
};

// Test Case
console.log("Test Case: height = [0,1,0,2,1,0,1,3,2,1,2,1]");
console.log("Output:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // Expected: 6
