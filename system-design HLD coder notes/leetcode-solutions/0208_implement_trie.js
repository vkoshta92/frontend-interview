/**
 * Question Name: Implement Trie (Prefix Tree)
 * Question Number: 208
 * Serial Number: 208
 * Problem Link: https://leetcode.com/problems/implement-trie-prefix-tree/
 */

/**
 * Hinglish Explanation:
 * Ek Trie data structure banana hai jo 'strings' ko efficient tarike se search kar sake (Prefix search ke liye best hai).
 * 
 * Logic:
 * 1. TrieNode mein ek 'children' object/array hoga aur ek 'isEndOfWord' boolean.
 * 2. Insert: String ke har character ke liye check karein ki wo node banna hai ya nahi, aur aage badhein.
 * 3. Search: String follow karein, agar end mein 'isEndOfWord' true hai toh word mila.
 * 4. StartsWith: Sirf path check karein, agar poora prefix mil gaya toh true.
 */

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

var Trie = function () {
    this.root = new TrieNode();
};

/** 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
    let node = this.root;
    for (let char of word) {
        if (!node.children[char]) {
            node.children[char] = new TrieNode();
        }
        node = node.children[char];
    }
    node.isEndOfWord = true;
};

/** 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
    let node = this.root;
    for (let char of word) {
        if (!node.children[char]) return false;
        node = node.children[char];
    }
    return node.isEndOfWord;
};

/** 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
    let node = this.root;
    for (let char of prefix) {
        if (!node.children[char]) return false;
        node = node.children[char];
    }
    return true;
};

// Test Case
let myTrie = new Trie();
myTrie.insert("apple");
console.log("Search 'apple':", myTrie.search("apple"));   // Expected: true
console.log("Search 'app':", myTrie.search("app"));       // Expected: false
console.log("StartsWith 'app':", myTrie.startsWith("app")); // Expected: true
