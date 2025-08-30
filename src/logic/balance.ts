export function updateBalance(balance: number, bet: number, win: boolean): number {
    if (win) return balance + bet * 2;
    return balance - bet;
}
