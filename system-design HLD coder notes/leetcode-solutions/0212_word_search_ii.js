/**
 * Question Name: Word Search II
 * Question Number: 212
 * Serial Number: 212
 * Problem Link: https://leetcode.com/problems/word-search-ii/
 */

/**
 * Hinglish Explanation:
 * Humein ek grid di gayi hai aur bahut saare words. Humein batana hai kaun-kaun se words grid mein maujood hain.
 * Ye ek Hard question hai jo Trie aur Backtracking (DFS) se solve hota hai.
 * 
 * Logic:
 * 1. Saare words ko pehle ek Trie mein daal do.
 * 2. Grid ke har cell se DFS start karein.
 * 3. Agar current path Trie mein exist karta hai, toh aage badhein.
 * 4. Jaise hi koi word mile, use result mein daalein aur Trie se hata dein (to avoid duplicates).
 */

class TrieNode {
    constructor() {
        this.children = {};
        this.word = null; // Store full word at the end node
    }
}

var findWords = function (board, words) {
    let root = new TrieNode();
    for (let w of words) {
        let node = root;
        for (let char of w) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.word = w;
    }

    let result = [];
    let rows = board.length;
    let cols = board[0].length;

    function dfs(r, c, node) {
        let char = board[r][c];
        if (!node.children[char]) return;

        node = node.children[char];
        if (node.word) {
            result.push(node.word);
            node.word = null; // Mark as found
        }

        board[r][c] = '#'; // Mark visited
        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let [dr, dc] of directions) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                dfs(nr, nc, node);
            }
        }
        board[r][c] = char; // Backtrack
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dfs(i, j, root);
        }
    }

    return result;
};

// Example usage can be complex due to grid and word list structure.
