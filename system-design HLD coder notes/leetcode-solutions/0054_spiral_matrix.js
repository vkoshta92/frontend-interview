/**
 * Question Name: Spiral Matrix
 * Question Number: 54
 * Serial Number: 54
 * Problem Link: https://leetcode.com/problems/spiral-matrix/
 */

/**
 * Hinglish Explanation:
 * Ek m x n matrix ko spiral order mein traverse karna hai (bahar se andar goali mein).
 * 
 * Logic:
 * 1. Char boundaries define karenge: `top`, `bottom`, `left`, `right`.
 * 2. Ek loop chalayenge jab tak boundaries cross na ho jayein.
 * 3. Pehle top row (left to right), phir right column (top to bottom),
 *    phir bottom row (right to left), aur phir left column (bottom to top).
 * 4. Har step ke baad boundary ko modify karte rahenge.
 */

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
    if (matrix.length === 0) return [];

    let result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Left to Right
        for (let j = left; j <= right; j++) result.push(matrix[top][j]);
        top++;

        // Top to Bottom
        for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
        right--;

        if (top <= bottom) {
            // Right to Left
            for (let j = right; j >= left; j--) result.push(matrix[bottom][j]);
            bottom--;
        }

        if (left <= right) {
            // Bottom to Top
            for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
            left++;
        }
    }

    return result;
};

// Test Case
let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log("Test Case Spiral Matrix:", JSON.stringify(matrix));
console.log("Output:", spiralOrder(matrix)); // Expected: [1,2,3,6,9,8,7,4,5]
