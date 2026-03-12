/**
 * Question Name: Merge Intervals
 * Question Number: 56
 * Serial Number: 56
 * Problem Link: https://leetcode.com/problems/merge-intervals/
 */

/**
 * Hinglish Explanation:
 * Humein intervals ka ek array diya gaya hai (e.g., [[1,3],[2,6]]).
 * Humein overlaps ko merge karke final list deni hai.
 * 
 * Logic:
 * 1. Pehle saare intervals ko 'start time' ke basis pe sort karo.
 * 2. Pehla interval result array mein daal do.
 * 3. Agle saare intervals ke liye check karo:
 *    - Agar current interval ka start, last merged interval ke end se chota hai, matlab overlap hai.
 *    - Overlap hone par merged interval ka end update karo (max of both ends).
 *    - Agar overlap nahi hai, toh use naya interval maan ke push kardo.
 */

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    if (intervals.length <= 1) return intervals;

    intervals.sort((a, b) => a[0] - b[0]);

    let result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        let last = result[result.length - 1];
        let current = intervals[i];

        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            result.push(current);
        }
    }

    return result;
};

// Test Case
console.log("Test Case: [[1,3],[2,6],[8,10],[15,18]]");
console.log("Output:", JSON.stringify(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))); // Expected: [[1,6],[8,10],[15,18]]
