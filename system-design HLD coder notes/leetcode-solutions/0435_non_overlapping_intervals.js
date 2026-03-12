/**
 * Question Name: Non-overlapping Intervals
 * Question Number: 435
 * Serial Number: 435
 * Problem Link: https://leetcode.com/problems/non-overlapping-intervals/
 */

/**
 * Hinglish Explanation:
 * Humein intervals ka ek array diya gaya hai. Humein batana hai ki minimum kitne intervals hatane padenge
 * taaki bache hue intervals overlap na karein.
 * 
 * Logic (Greedy):
 * 1. Sabse pehle intervals ko unke 'end time' ke basis pe sort karein.
 *    (Iska logic ye hai ki jo interval pehle khatam hoga, wo aage ke liye zyada jagah chhodega).
 * 2. Pehla interval select karein aur uska 'end' time track karein.
 * 3. Agle intervals ko check karein. Agar naya interval pehle wale ke khatam hone se pehle shuru ho raha hai,
 *    toh overlap hai, iska matlab ise 'hatana' (remove) padega.
 * 4. Agar overlap nahi hai, toh apna tracking end time update kar dein.
 */

/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function (intervals) {
    if (intervals.length === 0) return 0;

    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);

    let count = 0;
    let end = intervals[0][1];

    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) {
            // Overlap detected, need to remove one
            count++;
        } else {
            // No overlap, update end time to current interval's end
            end = intervals[i][1];
        }
    }

    return count;
};

// Test Case
console.log("Test Case: [[1,2],[2,3],[3,4],[1,3]]");
console.log("Output (min removals):", eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]])); // Expected: 1
