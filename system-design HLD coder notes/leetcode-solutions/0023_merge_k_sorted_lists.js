/**
 * Question Name: Merge k Sorted Lists
 * Question Number: 23
 * Serial Number: 23
 * Problem Link: https://leetcode.com/problems/merge-k-sorted-lists/
 */

/**
 * Hinglish Explanation:
 * Humein 'k' sorted linked lists di gayi hain. Humein unhe ek single sorted linked list mein merge karna hai.
 * Ye ek Hard problem hai.
 * 
 * Logic (Divide and Conquer):
 * 1. Hum lists ko do-do karke merge karenge (jaise merge sort mein karte hain).
 * 2. Pehle 1st aur 2nd ko merge kiya, phir 3rd aur 4th ko, and so on.
 * 3. Jab tak sirf ek list nahi bachti, hum recursion ya loop se merge karte rahenge.
 * 4. 'Merge Two Sorted Lists' wala logic hi use karenge internal merging ke liye.
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
    if (lists.length === 0) return null;

    while (lists.length > 1) {
        let mergedLists = [];
        for (let i = 0; i < lists.length; i += 2) {
            let l1 = lists[i];
            let l2 = (i + 1 < lists.length) ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }

    return lists[0];
};

function mergeTwoLists(l1, l2) {
    let dummy = new ListNode(0);
    let curr = dummy;
    while (l1 && l2) {
        if (l1.val < l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    curr.next = l1 || l2;
    return dummy.next;
}

function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}
