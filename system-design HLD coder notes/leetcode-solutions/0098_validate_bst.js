/**
 * Question Name: Validate Binary Search Tree
 * Question Number: 98
 * Serial Number: 98
 * Problem Link: https://leetcode.com/problems/validate-binary-search-tree/
 */

/**
 * Hinglish Explanation:
 * Humein check karna hai ki diya gaya binary tree ek valid BST hai ya nahi.
 * BST rule: Left child chota hona chahiye, aur Right child bada hona chahiye parent se (across levels).
 * 
 * Logic:
 * 1. Hum ek function banayenge jo range (min, max) check karega.
 * 2. Root ke liye range hogi (-Infinity to +Infinity).
 * 3. Jab left mein jayenge, toh max update ho jayega (parent's value).
 * 4. Jab right mein jayenge, toh min update ho jayega (parent's value).
 * 5. Agar koi bhi node range ke bahar hai, toh false.
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
 * @return {boolean}
 */
var isValidBST = function (root) {
    function validate(node, min, max) {
        if (!node) return true;

        if (node.val <= min || node.val >= max) {
            return false;
        }

        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }

    return validate(root, -Infinity, Infinity);
};
