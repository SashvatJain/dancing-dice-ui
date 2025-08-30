import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bet } from '../types';

interface GameState {
    dice: number[];
    combination: string;
    bets: Bet[];
    logs: string[];
    userLogs: any[];
}

const initialState: GameState = {
    dice: [1, 2, 3],
    combination: 'Any',
    bets: [],
    logs: [],
    userLogs: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        rollDice(state, action: PayloadAction<{ dice: number[], combination: string }>) {
            state.dice = action.payload.dice;
            state.combination = action.payload.combination;
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
