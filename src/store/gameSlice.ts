import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bet } from '../types';
import type { GameCombination } from '../logic/combinations';

interface GameState {
    dice: number[];
    combination: string;
    winningCombos: GameCombination[];
    bets: Bet[];
    logs: string[];
    userLogs: any[];
}

const initialState: GameState = {
    dice: [1, 2, 3],
    combination: 'Any',
    winningCombos: [],
    bets: [],
    logs: [],
    userLogs: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // Store all winning combinations for a roll, while keeping the first (or provided) as "combination" for compatibility
        rollDice(state, action: PayloadAction<{ dice: number[], winningCombos: GameCombination[], combination?: string }>) {
            state.dice = action.payload.dice;
            state.combination = action.payload.combination ?? action.payload.winningCombos[0] ?? 'Any';
            state.winningCombos = action.payload.winningCombos;
        },
        addBet(state, action: PayloadAction<Bet>) {
            state.bets.push(action.payload);
        },
        removeBet(state, action: PayloadAction<number>) {
            state.bets.splice(action.payload, 1);
        },
        clearBets(state) {
            state.bets = [];
        },
        addLog(state, action: PayloadAction<string>) {
            state.logs.unshift(action.payload);
        },
        addUserLog(state, action: PayloadAction<any>) {
            state.userLogs.unshift(action.payload);
        },
    },
});

export const { rollDice, addBet, removeBet, clearBets, addLog, addUserLog } = gameSlice.actions;
export default gameSlice.reducer;
