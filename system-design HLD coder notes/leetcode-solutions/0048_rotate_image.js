/**
 * Question Name: Rotate Image
 * Question Number: 48
 * Serial Number: 48
 * Problem Link: https://leetcode.com/problems/rotate-image/
 */

/**
 * Hinglish Explanation:
 * Ek n x n 2D matrix (image) ko 90 degrees clockwise rotate karna hai.
 * Ye kaam humein in-place karna hai (yaani bina naya matrix banaye).
 * 
 * Logic:
 * 1. Sabse pehle matrix ka Transpose lijiye (rows ko columns bana dijiye).
 *    [i][j] ko [j][i] se swap karein.
 * 2. Uske baad har row ko reverse kar dijiye.
 * 3. Resultantly, matrix 90 degree rotate ho jayega.
 */

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
    const n = matrix.length;

    // Step 1: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
};

// Test Case
let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
rotate(matrix);
console.log("Test Case Rotation: [[1,2,3],[4,5,6],[7,8,9]]");
console.log("Output Matrix:", JSON.stringify(matrix)); // Expected: [[7,4,1],[8,5,2],[9,6,3]]
