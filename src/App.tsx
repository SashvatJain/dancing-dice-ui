import Board from './components/Board';
import BetPanel from './components/BetPanel';
import Balance from './components/Balance';
import Log from './components/Log';
import UserLog from './components/UserLog';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { rollDice as rollDiceAction, clearBets, addLog, addUserLog } from './store/gameSlice';
import { setBalance } from './store/userSlice';
// import { logResult } from './store/apiActions';
import { rollDice } from './logic/diceRoll';
import { getGameCombinations, GameCombination } from './logic/combinations';
import './styles/main.css';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { dice, bets, logs, userLogs } = useSelector((state: RootState) => state.game);
  const { balance, userId } = useSelector((state: RootState) => state.user);

  console.log('User logs:', userLogs);
  const { GAME_PAYOUT_RATIOS } = require('./logic/combinations');
  const handleRoll = async () => {
    const newDice = rollDice();
    const winningCombos = getGameCombinations(newDice);
    // Save all matching combos in the store along with dice; combination is derived from winningCombos[0]
    dispatch(rollDiceAction({ dice: newDice, winningCombos }));

    let logMsg = `Dice: ${newDice.join(', ')} | Combos: ${winningCombos.join(', ')}`;
    let newBalance = balance;
    let totalWon = 0;
    console.log(`all bets`, bets);
    const userLogBets = bets.map((bet: { combination: string; amount: number; userId: string }) => {
      let won = false;
      let payoutRatio = 0;
      let winAmount = 0;
      // Single dice payout logic (SINGLE_*)
      if (bet.combination.startsWith('SINGLE_')) {
        const diceNumStr = bet.combination.split('_')[1];
        const diceNum = parseInt(diceNumStr, 10);
        if (isNaN(diceNum) || diceNum < 1 || diceNum > 6) {
          console.warn(`Invalid diceNum parsed from combination: ${bet.combination}`);
          newBalance -= bet.amount;
          logMsg += ` | INVALID BET: $${bet.amount} on ${bet.combination}`;
        } else {
          const matchCount = newDice.filter((d: number) => d === diceNum).length;
          console.log(`Checking SINGLE bet: diceNum=${diceNum}, newDice=${JSON.stringify(newDice)}, matchCount=${matchCount}`);
          if (matchCount > 0) {
            won = true;
            payoutRatio = matchCount; // 1x, 2x, or 3x
            winAmount = bet.amount * payoutRatio;
            totalWon += winAmount;
            newBalance += winAmount;
            logMsg += ` | WIN: $${winAmount} on ${bet.combination} (x${payoutRatio})`;
          } else {
            newBalance -= bet.amount;
            logMsg += ` | LOSE: $${bet.amount} on ${bet.combination}`;
          }
        }
      } else if (winningCombos.includes(bet.combination as GameCombination)) {
        // All other combos use fixed payout ratios
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
    // dispatch<any>(logResult({ dice: newDice, combination: winningCombos[0], userId }));
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
