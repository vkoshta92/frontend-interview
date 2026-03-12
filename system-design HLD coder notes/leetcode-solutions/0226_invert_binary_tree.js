/**
 * Question Name: Invert Binary Tree
 * Question Number: 226
 * Serial Number: 226
 * Problem Link: https://leetcode.com/problems/invert-binary-tree/
 */

/**
 * Hinglish Explanation:
 * Tree ko mirror image banana hai (invert karna hai). Left ko right aur right ko left.
 * 
 * Logic (Recursion):
 * 1. Agar node null hai, return null (Base Case).
 * 2. Left aur right children ko swap karo.
 * 3. Recursively yahi kaam left aur right child pe karo.
 * 4. End mein root return karo.
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
 * @return {TreeNode}
 */
var invertTree = function (root) {
    if (!root) return null;

    // Swap
    let temp = root.left;
    root.left = root.right;
    root.right = temp;

    // Recurse
    invertTree(root.left);
    invertTree(root.right);

    return root;
};
