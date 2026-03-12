/**
 * Question Name: Longest Common Prefix
 * Question Number: 14
 * Serial Number: 14
 * Problem Link: https://leetcode.com/problems/longest-common-prefix/
 */

/**
 * Hinglish Explanation:
 * Humein strings ka ek array diya gaya hai. Humein sabse lamba common prefix dhundhna hai
 * jo saari strings mein shuruat mein aata ho.
 * 
 * Logic:
 * 1. Agar array empty hai, toh empty string return karein.
 * 2. Pehli string ko hum initial 'prefix' maan lete hain.
 * 3. Ek-ek karke baaki saari strings se compare karein.
 * 4. Jab tak current string prefix se shuru nahi hoti, prefix ko ek-ek character chota karte jayein.
 * 5. Agar prefix empty ho jaye, implies koi common prefix nahi hai.
 */

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    if (strs.length === 0) return "";

    let prefix = strs[0];

    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }

    return prefix;
};

// Test Case
console.log("Test Case: ['flower','flow','flight']");
console.log("Output:", longestCommonPrefix(['flower', 'flow', 'flight'])); // Expected: "fl"
