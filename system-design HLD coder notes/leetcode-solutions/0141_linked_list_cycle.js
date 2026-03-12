/**
 * Question Name: Linked List Cycle
 * Question Number: 141
 * Serial Number: 141
 * Problem Link: https://leetcode.com/problems/linked-list-cycle/
 */

/**
 * Hinglish Explanation:
 * Humein batana hai ki linked list mein koi cycle (loop) hai ya nahi.
 * 
 * Logic (Floyd's Tortoise and Hare):
 * 1. Hum do pointers use karenge: 'slow' aur 'fast'.
 * 2. 'slow' ek step chalega, aur 'fast' do step chalega.
 * 3. Agar cycle hogi, toh slow aur fast kabhi na kabhi ek hi node pe mil jayenge.
 * 4. Agar fast null tak pahunch gaya, matlab koi cycle nahi hai.
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
    if (!head || !head.next) return false;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) return true; // Cycle found
    }

    return false;
};
