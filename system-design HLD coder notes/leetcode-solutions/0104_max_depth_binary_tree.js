/**
 * Question Name: Maximum Depth of Binary Tree
 * Question Number: 104
 * Serial Number: 104
 * Problem Link: https://leetcode.com/problems/maximum-depth-of-binary-tree/
 */

/**
 * Hinglish Explanation:
 * Tree ki sabse lambi path ki length batani hai (root se lekar leaf tak).
 * 
 * Logic (Recursion):
 * 1. Agar node null hai, toh depth 0 hai.
 * 2. Left subtree ki depth nikaalo aur Right subtree ki depth nikaalo.
 * 3. Max depth = max(leftDepth, rightDepth) + 1 (current node ke liye +1).
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
 * @return {number}
 */
var maxDepth = function (root) {
    if (!root) return 0;

    let leftDepth = maxDepth(root.left);
    let rightDepth = maxDepth(root.right);

    return Math.max(leftDepth, rightDepth) + 1;
};
