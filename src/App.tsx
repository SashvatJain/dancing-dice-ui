import React from 'react';
import Board from './components/Board';
import BetPanel from './components/BetPanel';
import Balance from './components/Balance';
import Log from './components/Log';
import UserLog from './components/UserLog';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { rollDice as rollDiceAction, clearBets, addLog, addUserLog } from './store/gameSlice';
import { setBalance } from './store/userSlice';
import { logResult } from './store/apiActions';
import { rollDice } from './logic/diceRoll';
import { getGameCombinations, GameCombination } from './logic/combinations';
import './styles/main.css';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { dice, combination, bets, logs, userLogs } = useSelector((state: RootState) => state.game);
  const { balance, userId, isLoggedIn } = useSelector((state: RootState) => state.user);

  const { GAME_PAYOUT_RATIOS } = require('./logic/combinations');
  const handleRoll = async () => {
    const newDice = rollDice();
    const combos = getGameCombinations(newDice);
    dispatch(rollDiceAction({ dice: newDice, combination: combos[0] }));

    let logMsg = `Dice: ${newDice.join(', ')} | Combos: ${combos.join(', ')}`;
    let newBalance = balance;
    let totalWon = 0;
    const userBets = bets.filter((bet: { userId: string }) => bet.userId === userId);
    const userLogBets = userBets.map((bet: { combination: string; amount: number; userId: string }) => {
      let won = false;
      let payoutRatio = 0;
      let winAmount = 0;
      // Single dice payout logic
      if (bet.combination.startsWith('DICE_')) {
        const diceNum = parseInt(bet.combination.split('_')[1], 10);
        const matchCount = newDice.filter((d: number) => d === diceNum).length;
        if (matchCount > 0) {
          won = true;
          payoutRatio = matchCount;
          winAmount = bet.amount * payoutRatio;
          totalWon += winAmount;
          newBalance += winAmount;
          logMsg += ` | WIN: $${winAmount} on ${bet.combination} (x${payoutRatio})`;
        } else {
          newBalance -= bet.amount;
          logMsg += ` | LOSE: $${bet.amount} on ${bet.combination}`;
        }
      } else if (combos.includes(bet.combination as GameCombination)) {
        won = true;
        payoutRatio = GAME_PAYOUT_RATIOS[bet.combination as GameCombination] || 1;
        winAmount = bet.amount * payoutRatio;
        totalWon += winAmount;
        newBalance += winAmount;
        logMsg += ` | WIN: $${winAmount} on ${bet.combination} (x${payoutRatio})`;
      } else {
        newBalance -= bet.amount;
        logMsg += ` | LOSE: $${bet.amount} on ${bet.combination}`;
      }
      return {
        combination: bet.combination,
        amount: bet.amount,
        won,
        payoutRatio,
        winAmount,
      };
    });
    const userLogEntry = {
      dice: newDice,
      bets: userLogBets,
      totalWon,
      timestamp: new Date().toISOString(),
    };
    dispatch(setBalance(newBalance));
    dispatch(addLog(logMsg));
    dispatch(addUserLog(userLogEntry));
    dispatch(clearBets());
    dispatch<any>(logResult({ dice: newDice, combination: combos[0], userId }));
  };

  return (
    <div className="App">
      <h1>Dancing Dice</h1>
      <Balance balance={balance} />
      <Board diceValues={dice} />

      <BetPanel balance={balance} />



      <button onClick={handleRoll} disabled={bets.length === 0}>Roll Dice</button>
      <UserLog userLogs={userLogs} />
      <Log logs={logs} />
    </div>
  );
}

export default App;
