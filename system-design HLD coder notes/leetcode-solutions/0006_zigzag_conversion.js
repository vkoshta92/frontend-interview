/**
 * Question Name: Zigzag Conversion
 * Question Number: 6
 * Serial Number: 6
 * Problem Link: https://leetcode.com/problems/zigzag-conversion/
 */

/**
 * Hinglish Explanation:
 * Ek string 's' ko rows mein zigzag pattern mein likhna hai.
 * Jaise agar rows=3 hain toh:
 * 1   5
 * 2 4 6
 * 3   7
 * Iske baad rows ko join karke final string deni hai.
 * 
 * Logic:
 * 1. Har row ke liye ek alag array (bucket) banayenge.
 * 2. Ek indicator rakhenge 'goingDown' (true/false) jo bataayega ki hum niche ja rahe hain ya upar.
 * 3. String ke har character pe loop chalayenge aur use correct bucket mein daalenge.
 * 4. Bucket index badhaate rahenge jab tak end na aa jaye, phir direction change karke index ghatayenge.
 */

/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
    if (numRows === 1) return s;

    let rows = Array.from({ length: numRows }, () => "");
    let currentRow = 0;
    let goingDown = false;

    for (let char of s) {
        rows[currentRow] += char;
        if (currentRow === 0 || currentRow === numRows - 1) goingDown = !goingDown;
        currentRow += goingDown ? 1 : -1;
    }

    return rows.join("");
};

// Test Case
console.log("Test Case: s = 'PAYPALISHIRING', numRows = 3");
console.log("Output:", convert("PAYPALISHIRING", 3)); // Expected: "PAHNAPLSIIGYIR"
