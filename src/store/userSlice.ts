import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userId: string;
    balance: number;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    userId: '',
    balance: 100,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ userId: string }>) {
            state.userId = action.payload.userId;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.userId = '';
            state.isLoggedIn = false;
        },
        setBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
    },
});

export const { login, logout, setBalance } = userSlice.actions;
export default userSlice.reducer;
