import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Board from './components/Board';
import BetPanel from './components/BetPanel';
import Balance from './components/Balance';
import Log from './components/Log';
import UserLog from './components/UserLog';
import { RootState } from './store';
import './styles/main.css';

const GamePage: React.FC = () => {
  const { dice, bets, logs, userLogs } = useSelector((state: RootState) => state.game);
  const { balance } = useSelector((state: RootState) => state.user);
  return (
    <div className="App">
      <h1>Dancing Dice</h1>
      <Balance balance={balance} />
      <Board diceValues={dice} />
      <BetPanel balance={balance} />
      <UserLog userLogs={userLogs} />
      <Log logs={logs} />
    </div>
  );
};

const App: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/game"
          element={isLoggedIn ? <GamePage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/game' : '/login'} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
