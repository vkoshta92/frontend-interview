/**
 * Question Name: Merge Two Sorted Lists
 * Question Number: 21
 * Serial Number: 21
 * Problem Link: https://leetcode.com/problems/merge-two-sorted-lists/
 */

/**
 * Hinglish Explanation:
 * Do sorted linked lists ko merge karke ek single sorted list banani hai.
 * 
 * Logic:
 * 1. Ek dummy node banayenge jo result list ka head hoga.
 * 2. Ek 'current' pointer rakhenge jo naya list build karega.
 * 3. Dono lists (l1, l2) mein se jo value choti hai, use 'current.next' mein daalenge.
 * 4. Us list ka pointer aage badhayenge.
 * 5. Last mein agar koi list bachi hai, toh use direct attach kar denge.
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    let dummy = new ListNode(0);
    let current = dummy;

    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }

    // Bacha hua part attach karein
    current.next = list1 || list2;

    return dummy.next;
};

// ListNode for testing
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}
