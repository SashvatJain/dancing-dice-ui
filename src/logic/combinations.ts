// Payout ratio mapping for each combination
export const GAME_PAYOUT_RATIOS: Record<GameCombination, number> = {
    SMALL: 1,
    BIG: 1,
    ODD: 1,
    EVEN: 1,
    SUM_4: 60,
    SUM_5: 30,
    SUM_6: 17,
    SUM_7: 12,
    SUM_8: 8,
    SUM_9: 6,
    SUM_10: 6,
    SUM_11: 6,
    SUM_12: 6,
    SUM_13: 8,
    SUM_14: 12,
    SUM_15: 17,
    SUM_16: 30,
    SUM_17: 60,
    TRIPLE_1: 180,
    TRIPLE_2: 180,
    TRIPLE_3: 180,
    TRIPLE_4: 180,
    TRIPLE_5: 180,
    TRIPLE_6: 180,
    ANY_TRIPLE: 30,
    PAIR_1: 10,
    PAIR_2: 10,
    PAIR_3: 10,
    PAIR_4: 10,
    PAIR_5: 10,
    PAIR_6: 10,
    DICE_1: 1, // Single dice: 1:1 for one, 2:1 for two, 3:1 for three (handle in logic)
    DICE_2: 1,
    DICE_3: 1,
    DICE_4: 1,
    DICE_5: 1,
    DICE_6: 1,
};

export type GameCombination =
    | 'SMALL' | 'BIG'
    | 'ODD' | 'EVEN'
    | 'SUM_4' | 'SUM_5' | 'SUM_6' | 'SUM_7' | 'SUM_8' | 'SUM_9' | 'SUM_10' | 'SUM_11' | 'SUM_12' | 'SUM_13' | 'SUM_14' | 'SUM_15' | 'SUM_16' | 'SUM_17'
    | 'TRIPLE_1' | 'TRIPLE_2' | 'TRIPLE_3' | 'TRIPLE_4' | 'TRIPLE_5' | 'TRIPLE_6' | 'ANY_TRIPLE'
    | 'PAIR_1' | 'PAIR_2' | 'PAIR_3' | 'PAIR_4' | 'PAIR_5' | 'PAIR_6'
    | 'DICE_1' | 'DICE_2' | 'DICE_3' | 'DICE_4' | 'DICE_5' | 'DICE_6';

export function getGameCombinations(dice: number[]): GameCombination[] {
    const [d1, d2, d3] = dice;
    const sum = d1 + d2 + d3;
    const combos: GameCombination[] = [];

    // Small/Big
    if (sum >= 4 && sum <= 10 && !(d1 === d2 && d2 === d3)) combos.push('SMALL');
    if (sum >= 11 && sum <= 17 && !(d1 === d2 && d2 === d3)) combos.push('BIG');

    // Odd/Even
    if (sum % 2 === 0) combos.push('EVEN');
    else combos.push('ODD');

    // Sums
    if (sum >= 4 && sum <= 17) combos.push(`SUM_${sum}` as GameCombination);

    // Triples
    if (d1 === d2 && d2 === d3) {
        combos.push(`TRIPLE_${d1}` as GameCombination);
        combos.push('ANY_TRIPLE');
    }

    // Pairs
    [1, 2, 3, 4, 5, 6].forEach(n => {
        if ((d1 === n && d2 === n) || (d2 === n && d3 === n) || (d1 === n && d3 === n)) {
            combos.push(`PAIR_${n}` as GameCombination);
        }
    });

    // Single dice
    [1, 2, 3, 4, 5, 6].forEach(n => {
        if (d1 === n || d2 === n || d3 === n) {
            combos.push(`DICE_${n}` as GameCombination);
        }
    });

    return combos;
}
