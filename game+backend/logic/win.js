function findWinWithLogs(arr) {
    let totalWin = 0; // final total win (base + free sabka)

    // loop har spin pe chalega
    for (let i = 0; i < arr.length; i++) {

        let bet = arr[i][1]; // current spin ka bet
        let win = arr[i][2]; // current spin ka win

        // agar bet > 0 hai to ye base game hai
        if (bet > 0) {

            let groupWin = win; // group ka total (base se start)

            console.log(`\n🎯 Base Game at index ${i + 1}`);
            console.log(`Base Win: ${win}`);

            let j = i + 1; // next spin check karne ke liye pointer

            // jab tak next spins me bet = 0 (free spins) hai
            while (j < arr.length && arr[j][1] === 0) {

                console.log(`   ➡️ Free Spin at index ${j + 1}, win: ${arr[j][2]}`);

                groupWin += arr[j][2]; // free spin ka win add karo

                j++; // next index pe jao
            }

            console.log(`✅ Total (Base + Free): ${groupWin}`);

            totalWin += groupWin; // group ka win total me add

            // jitne free spins count ho gaye unko skip karo
            i = j - 1;
        }
    }

    console.log(`\n🔥 Final Total Win: ${totalWin}`);

    return totalWin; // final result return
}

const data = [
    [1, 5, 2],
    [2, 0, 10],
    [3, 0, 0],
    [4, 10, 0],
    [5, 0, 2],
    [6, 10, 1],
    [7, 5, 10],
    [8, 0, 10]
];

findWinWithLogs(data);