/**
 * Question Name: Sliding Window Maximum
 * Question Number: 239
 * Serial Number: 239
 * Problem Link: https://leetcode.com/problems/sliding-window-maximum/
 */

/**
 * Hinglish Explanation:
 * Humein ek window di gayi hai jo array pe slide karti hai. Humein har step pe window ka maximum batana hai.
 * Ye ek Hard problem hai kyunki simple approach O(n*k) hogi, par humein O(n) chahiye.
 * 
 * Logic (Deque):
 * 1. Hum ek Deque (Double Ended Queue) use karenge jo indices store karegi.
 * 2. Humein deque ko aise maintain karna hai ki sabse aage (front) hamesha maximum element ka index ho.
 * 3. Har naye element ke liye, deque ke piche se saare chote elements hata denge (kyunki wo kabhi max nahi ban payenge).
 * 4. Deque mein index daal denge.
 * 5. Agar deque ka front element window se bahar nikal gaya hai, toh use hata denge.
 * 6. Jab window ka size 'k' poora ho jaye, front element result mein daal do.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
    let result = [];
    let deque = []; // Indices

    for (let i = 0; i < nums.length; i++) {
        // Purane elements jo window se bahar hain, unhe hatao
        if (deque.length > 0 && deque[0] === i - k) {
            deque.shift();
        }

        // Naye element se chote elements ko piche se hatao
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }

        deque.push(i);

        // Jab window size k ho jaye, result mein front daalo
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
};

// Test Case
console.log("Test Case: nums = [1,3,-1,-3,5,3,6,7], k = 3");
console.log("Output:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // Expected: [3,3,5,5,6,7]
