/**
 * Question Name: Group Anagrams
 * Question Number: 49
 * Serial Number: 49
 * Problem Link: https://leetcode.com/problems/group-anagrams/
 */

/**
 * Hinglish Explanation:
 * Ek array mein strings di gayi hain. Saare anagrams (ek jaise characters wale) ko group karna hai.
 * Jaise "eat", "tea", aur "ate" anagrams hain kyunki inke characters same hain.
 * 
 * Logic:
 * 1. Ek Map use karenge jahan 'key' hoga sorted string aur 'value' hoga anagrams ki list.
 * 2. Har string ko pick karein, use sort karein (taaki key ban jaye).
 * 3. Agar key map mein hai, toh string ko list mein add karein, nahi toh nai list banayein.
 * 4. Last mein Map ki saari values return kar dein.
 */

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
    let map = new Map();

    for (let s of strs) {
        let key = s.split('').sort().join('');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(s);
    }

    return Array.from(map.values());
};

// Test Case
console.log("Test Case: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']");
console.log("Output:", JSON.stringify(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])));
