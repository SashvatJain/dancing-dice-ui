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
    // Single dice: 1:1 for one, 2:1 for two, 3:1 for three (handled in logic via match count)
    SINGLE_1: 1,
    SINGLE_2: 1,
    SINGLE_3: 1,
    SINGLE_4: 1,
    SINGLE_5: 1,
    SINGLE_6: 1,
    // Two-dice specific combinations (assumed 5:1 default payout; adjust as needed)
    TWO_DICE_1_2: 6,
    TWO_DICE_1_3: 6,
    TWO_DICE_1_4: 6,
    TWO_DICE_1_5: 6,
    TWO_DICE_1_6: 6,
    TWO_DICE_2_3: 6,
    TWO_DICE_2_4: 6,
    TWO_DICE_2_5: 6,
    TWO_DICE_2_6: 6,
    TWO_DICE_3_4: 6,
    TWO_DICE_3_5: 6,
    TWO_DICE_3_6: 6,
    TWO_DICE_4_5: 6,
    TWO_DICE_4_6: 6,
    TWO_DICE_5_6: 6,
    // Four-dice specific combinations (assumed 2:1 default payout; adjust as needed)
    FOUR_DICE_1_2_3_4: 6,
    FOUR_DICE_1_2_3_5: 6,
    FOUR_DICE_1_2_3_6: 6,
    FOUR_DICE_1_2_4_5: 6,
    FOUR_DICE_1_2_4_6: 6,
    FOUR_DICE_1_2_5_6: 6,
    FOUR_DICE_2_3_4_5: 6,
    FOUR_DICE_2_3_4_6: 6,
    FOUR_DICE_2_3_5_6: 6,
    FOUR_DICE_3_4_5_6: 6,
};

export type GameCombination =
    | 'SMALL' | 'BIG'
    | 'ODD' | 'EVEN'
    | 'SUM_4' | 'SUM_5' | 'SUM_6' | 'SUM_7' | 'SUM_8' | 'SUM_9' | 'SUM_10' | 'SUM_11' | 'SUM_12' | 'SUM_13' | 'SUM_14' | 'SUM_15' | 'SUM_16' | 'SUM_17'
    | 'TRIPLE_1' | 'TRIPLE_2' | 'TRIPLE_3' | 'TRIPLE_4' | 'TRIPLE_5' | 'TRIPLE_6' | 'ANY_TRIPLE'
    | 'PAIR_1' | 'PAIR_2' | 'PAIR_3' | 'PAIR_4' | 'PAIR_5' | 'PAIR_6'
    | 'SINGLE_1' | 'SINGLE_2' | 'SINGLE_3' | 'SINGLE_4' | 'SINGLE_5' | 'SINGLE_6'
    | 'TWO_DICE_1_2' | 'TWO_DICE_1_3' | 'TWO_DICE_1_4' | 'TWO_DICE_1_5' | 'TWO_DICE_1_6'
    | 'TWO_DICE_2_3' | 'TWO_DICE_2_4' | 'TWO_DICE_2_5' | 'TWO_DICE_2_6'
    | 'TWO_DICE_3_4' | 'TWO_DICE_3_5' | 'TWO_DICE_3_6'
    | 'TWO_DICE_4_5' | 'TWO_DICE_4_6'
    | 'TWO_DICE_5_6'
    | 'FOUR_DICE_1_2_3_4' | 'FOUR_DICE_1_2_3_5' | 'FOUR_DICE_1_2_3_6'
    | 'FOUR_DICE_1_2_4_5' | 'FOUR_DICE_1_2_4_6' | 'FOUR_DICE_1_2_5_6'
    | 'FOUR_DICE_2_3_4_5' | 'FOUR_DICE_2_3_4_6' | 'FOUR_DICE_2_3_5_6'
    | 'FOUR_DICE_3_4_5_6';

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

    // Two-dice specific combinations (unordered pairs present among the three dice)
    const present = new Set([d1, d2, d3]);
    const twoDicePairs: [number, number][] = [
        [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
        [2, 3], [2, 4], [2, 5], [2, 6],
        [3, 4], [3, 5], [3, 6],
        [4, 5], [4, 6],
        [5, 6],
    ];
    twoDicePairs.forEach(([a, b]) => {
        if (present.has(a) && present.has(b)) {
            combos.push(`TWO_DICE_${a}_${b}` as GameCombination);
        }
    });

    // Four-dice specific combinations (rolled dice are subset of the four-number group)
    const fourDiceGroups: [number, number, number, number][] = [
        [1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 3, 6],
        [1, 2, 4, 5], [1, 2, 4, 6], [1, 2, 5, 6],
        [2, 3, 4, 5], [2, 3, 4, 6], [2, 3, 5, 6],
        [3, 4, 5, 6],
    ];
    fourDiceGroups.forEach((group) => {
        if (group.includes(d1) && group.includes(d2) && group.includes(d3)) {
            const [a, b, c, d] = group;
            combos.push(`FOUR_DICE_${a}_${b}_${c}_${d}` as GameCombination);
        }
    });

    // Single dice
    [1, 2, 3, 4, 5, 6].forEach(n => {
        if (d1 === n || d2 === n || d3 === n) {
            combos.push(`SINGLE_${n}` as GameCombination);
        }
    });

    return combos;
}
