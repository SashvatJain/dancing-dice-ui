export interface Bet {
    combination: string;
    amount: number;
    userId: string;
    cellDice: number[];
}

export interface LogEntry {
    dice: number[];
    combination: string;
    bets: Bet[];
    winners: string[];
    balance: number;
    timestamp: string;
}
