/**
 * Question Name: Reverse Linked List
 * Question Number: 206
 * Serial Number: 206
 * Problem Link: https://leetcode.com/problems/reverse-linked-list/
 */

/**
 * Hinglish Explanation:
 * Linked list ko pura ulta (reverse) karna hai.
 * 
 * Logic:
 * 1. Hum teen pointers maintain karenge: 'prev' (null), 'curr' (head), aur 'next'.
 * 2. Jab tak 'curr' null nahi hota:
 *    - 'next' ko 'curr.next' pe store karo.
 *    - 'curr.next' ko 'prev' pe point karo (yahan reversal ho raha hai).
 *    - pointers ko aage khiskayein: 'prev' ban jayega 'curr', aur 'curr' ban jayega 'next'.
 * 3. Last mein 'prev' hamara naya head hoga.
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    let prev = null;
    let curr = head;

    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }

    return prev;
};
