export function rollDice(): number[] {
    return [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1);
}
