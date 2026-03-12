/**
 * Question Name: Add Two Numbers
 * Question Number: 2
 * Serial Number: 2
 * Problem Link: https://leetcode.com/problems/add-two-numbers/
 */

/**
 * Hinglish Explanation:
 * Humein do Non-Empty Linked Lists di gayi hain jo non-negative integers represent karti hain.
 * Digits reverse order mein store hain (matlab units place pehle hai).
 * Humein dono numbers ko add karke ek nai linked list return karni hai.
 * 
 * Logic:
 * 1. Hum ek 'dummy' head banayenge nai list ke liye.
 * 2. Ek 'carry' variable rakhenge jo addition ka extra part (haasil) store karega.
 * 3. Loop chalayenge jab tak dono lists mein se koi bachi ho ya carry ho.
 * 4. Har step pe dono lists ke values ko sum karenge aur carry add karenge.
 * 5. Naya node sum % 10 se banayenge (single digit).
 * 6. Carry ko sum / 10 se update karenge.
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;

    while (l1 !== null || l2 !== null || carry > 0) {
        let val1 = (l1 !== null) ? l1.val : 0;
        let val2 = (l2 !== null) ? l2.val : 0;

        let sum = val1 + val2 + carry;
        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);

        current = current.next;
        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }

    return dummy.next;
};

// Auxiliary ListNode constructor for testing
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}
