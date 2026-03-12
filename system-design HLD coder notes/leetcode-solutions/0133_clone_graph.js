/**
 * Question Name: Clone Graph
 * Question Number: 133
 * Serial Number: 133
 * Problem Link: https://leetcode.com/problems/clone-graph/
 */

/**
 * Hinglish Explanation:
 * Ek undirected and connected graph ka deep copy (clone) banana hai.
 * 
 * Logic:
 * 1. Hum ek 'Map' use karenge nodes ko track karne ke liye (original node -> cloned node).
 * 2. DFS ya BFS koi bhi use kar sakte hain.
 * 3. Agar node pehle se map mein hai, toh wahi cloned node return kar do.
 * 4. Agar nahi hai, toh naya node banao aur map mein daal do.
 * 5. Phir uske saare neighbors ke liye recursively clone process call karo.
 */

/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function (node) {
    if (!node) return null;

    let visited = new Map();

    function dfs(curr) {
        if (visited.has(curr)) {
            return visited.get(curr);
        }

        // Clone
        let copy = new Node(curr.val);
        visited.set(curr, copy);

        for (let neighbor of curr.neighbors) {
            copy.neighbors.push(dfs(neighbor));
        }

        return copy;
    }

    return dfs(node);
};

// Node definition for reference
function Node(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
}
