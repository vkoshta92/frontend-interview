/**
 * Question Name: Binary Tree Level Order Traversal
 * Question Number: 102
 * Serial Number: 102
 * Problem Link: https://leetcode.com/problems/binary-tree-level-order-traversal/
 */

/**
 * Hinglish Explanation:
 * Humein tree ka node-by-node (level-by-level) traversal karna hai (BFS).
 * Har level ke elements alag subarray mein hone chahiye.
 * 
 * Logic (Queue based BFS):
 * 1. Hum ek 'Queue' use karenge. Sabse pehle 'root' ko queue mein daalein.
 * 2. Jab tak queue empty nahi hoti, loop chalayein.
 * 3. Har level ke liye queue ka current size nikaalein (wohi us level ke total nodes hain).
 * 4. Utne nodes ko pop karein, unki values array mein daalein, aur unke bache (left, right) queue mein daalein.
 * 5. Level khatam hone par result mein sub-array add karein.
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
    if (!root) return [];

    let result = [];
    let queue = [root];

    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            currentLevel.push(node.val);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return result;
};
