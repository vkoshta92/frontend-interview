// Win Line Logic
// Advanced
// gaming_company mein kyun zaroori hai

// Slot game ka core — kaunsi line win hui yeh calculate karna!

// Concept

// Win lines = patterns on the grid. Check karo ki matching symbols kahan hain.

// Win Line Calculator
const WIN_LINES = [
  [0,0, 1,0, 2,0, 3,0, 4,0], // Top row
  [0,1, 1,1, 2,1, 3,1, 4,1], // Middle row
  [0,2, 1,2, 2,2, 3,2, 4,2], // Bottom row
  [0,0, 1,1, 2,2, 3,1, 4,0], // V shape
  [0,2, 1,1, 2,0, 3,1, 4,2], // ^ shape
];

// Grid = 5 reels x 3 rows
function checkWins(grid, betPerLine) {
  const wins = [];

  WIN_LINES.forEach((line, lineIndex) => {
    const symbols = [];

    // Line ke symbols nikalo
    for (let i = 0; i < 5; i++) {
      const reel = line[i * 2];
      const row = line[i * 2 + 1];
      symbols.push(grid[reel][row]);
    }

    // Matching symbols count karo
    const firstSymbol = symbols[0];
    let matchCount = 1;

    for (let i = 1; i < 5; i++) {
      if (symbols[i] === firstSymbol || 
          symbols[i] === 'WILD') {
        matchCount++;
      } else break;
    }

    // 3+ match = win!
    if (matchCount >= 3) {
      const multiplier = getMultiplier(
        firstSymbol, matchCount
      );
      wins.push({
        lineIndex,
        symbol: firstSymbol,
        count: matchCount,
        payout: betPerLine * multiplier
      });
    }
  });

  return wins;
}
// Tip: WILD symbol sab ko replace karta hai — yeh logic zaroori hai!