/**
 * Question Name: Median of Two Sorted Arrays
 * Question Number: 4
 * Serial Number: 4
 * Problem Link: https://leetcode.com/problems/median-of-two-sorted-arrays/
 */

/**
 * Hinglish Explanation:
 * Do sorted arrays 'nums1' aur 'nums2' diye gaye hain. Humein dono ko combine karke median dhundhna hai.
 * Time complexity O(log(m+n)) honi chahiye.
 * 
 * Logic:
 * Iska optimized tarikha Binary Search hai dono arrays ke partitions par.
 * Par asaan samajhne ke liye yahan hum merge karke middle nikaal rahe hain (O(m+n)). 
 * (Deep analysis: Hard problem, typically requires complex binary search).
 */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    // Simple Merge implementation
    let merged = [];
    let i = 0, j = 0;

    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] < nums2[j]) {
            merged.push(nums1[i++]);
        } else {
            merged.push(nums2[j++]);
        }
    }

    while (i < nums1.length) merged.push(nums1[i++]);
    while (j < nums2.length) merged.push(nums2[j++]);

    let n = merged.length;
    if (n % 2 === 0) {
        return (merged[Math.floor(n / 2) - 1] + merged[Math.floor(n / 2)]) / 2;
    } else {
        return merged[Math.floor(n / 2)];
    }
};

// Test Case
console.log("Test Case: nums1 = [1,3], nums2 = [2]");
console.log("Output:", findMedianSortedArrays([1, 3], [2])); // Expected: 2.0
