/**
 * Question Name: Best Time to Buy and Sell Stock
 * Question Number: 121
 * Serial Number: 121
 * Problem Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 */

/**
 * Hinglish Explanation:
 * Ek array 'prices' di gayi hai jahan prices[i] stock ki kimat hai 'i-th' din.
 * Humein batana hai ki ek baar buy aur ek baar sell karke kitna maximum profit kama sakte hain.
 * 
 * Logic:
 * 1. Hum minimum price ko track karenge jo ab tak dekhi gayi hai (`minPrice`).
 * 2. Har din check karenge ki agar aaj sell karein toh kitna profit hoga (todayPrice - minPrice).
 * 3. Jo bhi maximum profit milega use store kar lenge.
 * 4. Single pass O(n) mein kaam ho jayega.
 */

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }

    return maxProfit;
};

// Test Case
console.log("Test Case: prices = [7,1,5,3,6,4]");
console.log("Output:", maxProfit([7, 1, 5, 3, 6, 4])); // Expected: 5
