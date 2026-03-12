/**
 * Question Name: Number of Islands
 * Question Number: 200
 * Serial Number: 200
 * Problem Link: https://leetcode.com/problems/number-of-islands/
 */

/**
 * Hinglish Explanation:
 * Ek 2D grid 'm x n' di gayi hai jahan '1' (land) hai aur '0' (water) hai.
 * Humein batana hai ki total kitne islands hain. Ek island charo taraf paani se ghira hota hai.
 * 
 * Logic (DFS/BFS):
 * 1. Grid pe loop chalayenge.
 * 2. Jaise hi '1' mile, hum ek naya island count karenge.
 * 3. Phir DFS call karke us island se jude saare '1' ko '0' (ya visited) mark kar denge.
 * 4. Aisa karne se ek hi island ke saare land parts ek hi baar count honge.
 */

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    if (!grid || grid.length === 0) return 0;

    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
            return;
        }

        // Mark as visited
        grid[r][c] = '0';

        // Check neighbors
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }

    return count;
};
