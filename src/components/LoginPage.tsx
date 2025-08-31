import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../store';
const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = await dispatch(
                loginUser({ username, password })
            );
            if (result.type === 'user/loginUser/fulfilled') {
                navigate('/game');
            } else {
                setError('Invalid credentials');
            }
        } catch {
            setError('Login failed');
        }
    };

    // If already logged in, redirect to game
    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/game');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={() => navigate('/register')} style={{ marginTop: '1em' }}>
                Register
            </button>
        </div>
    );
};

export default LoginPage;
