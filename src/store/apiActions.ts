import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userId: string) => {
        // Demo API call
        const response = await axios.post('/api/login', { userId });
        return response.data;
    }
);

export const fetchBalance = createAsyncThunk(
    'user/fetchBalance',
    async (userId: string) => {
        // Demo API call
        const response = await axios.get(`/api/balance/${userId}`);
        return response.data.balance;
    }
);

export const placeBet = createAsyncThunk(
    'game/placeBet',
    async (bet: { userId: string; combination: string; amount: number }) => {
        // Demo API call
        const response = await axios.post('/api/bet', bet);
        return response.data;
    }
);

export const logResult = createAsyncThunk(
    'game/logResult',
    async (result: { dice: number[]; combination: string; userId: string }) => {
        // Demo API call
        const response = await axios.post('/api/log', result);
        return response.data;
    }
);
