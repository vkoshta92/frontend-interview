/**
 * Question Name: Find the Index of the First Occurrence in a String
 * Question Number: 28
 * Serial Number: 28
 * Problem Link: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
 */

/**
 * Hinglish Explanation:
 * Humein do strings 'haystack' aur 'needle' di gayi hain.
 * Humein haystack mein needle ka pehla occurrence dhundhna hai.
 * 
 * Logic:
 * 1. JavaScript ka in-built `indexOf()` method hum use kar sakte hain.
 * 2. Agar needle empty hai, toh 0 return hota hai (as per problem specs usually).
 * 3. Agar needle nahi milti, toh -1 return karein.
 */

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
    return haystack.indexOf(needle);
};

// Test Case
console.log("Test Case: haystack = 'sadbutsad', needle = 'sad'");
console.log("Output:", strStr("sadbutsad", "sad")); // Expected: 0
