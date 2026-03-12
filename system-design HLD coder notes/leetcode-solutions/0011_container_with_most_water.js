/**
 * Question Name: Container With Most Water
 * Question Number: 11
 * Serial Number: 11
 * Problem Link: https://leetcode.com/problems/container-with-most-water/
 */

/**
 * Hinglish Explanation:
 * Humein ek array 'height' di gayi hai. Humein do lines dhundhni hain jo x-axis ke saath milkar
 * ek aisa container banayein jo sabse zyada paani (area) hold kar sake.
 * 
 * Logic (Two Pointers):
 * 1. Sabse bada area nikaalne ke liye hum 'left' aur 'right' pointers use karenge (shuruat aur anth mein).
 * 2. Area calculate hota hai: height = min(leftHeight, rightHeight) aur width = right - left.
 * 3. Har step pe hum check karenge ki area maximum hai ya nahi.
 * 4. Pointers ko move kaise karein? Jo side choti hai, use move karein (taaki shayad agli baar badi side mile).
 */

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;

    while (left < right) {
        let currentHeight = Math.min(height[left], height[right]);
        let currentWidth = right - left;
        let area = currentHeight * currentWidth;

        maxArea = Math.max(maxArea, area);

        // Choti height wale pointer ko move karein
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
};

// Test Case
console.log("Test Case: height = [1,8,6,2,5,4,8,3,7]");
console.log("Output:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // Expected: 49
