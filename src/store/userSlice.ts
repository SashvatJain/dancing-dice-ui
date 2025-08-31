import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiBaseUrl } from '../config/endpoints';
import axios from 'axios';

// Set axios base URL from config
axios.defaults.baseURL = getApiBaseUrl();

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


// Async thunk for login
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (
        { username, password }: { username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `/users/login`,
                { username, password }
            );
            // Assuming response.data contains user info with id and balance
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (
        { username, password }: { username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `/users/register`,
                { username, password }
            );
            // Assuming response.data contains user info with id and balance
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

// Async thunk for logout (local only, as API does not provide logout)
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    // If you need to call an API for logout, do it here
    return true;
});

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
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                // response.data may have id, username, balance
                state.userId = action.payload.id?.toString() || '';
                state.isLoggedIn = true;
                if (typeof action.payload.balance === 'number') {
                    state.balance = action.payload.balance;
                }
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoggedIn = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userId = '';
                state.isLoggedIn = false;
            });
    },
});

export const { login, logout, setBalance } = userSlice.actions;
export default userSlice.reducer;
