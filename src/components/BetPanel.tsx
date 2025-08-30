import { useDispatch, useSelector } from 'react-redux';
import { removeBet } from '../store/gameSlice';
import React from 'react';
import Dice from './Dice';

interface BetPanelProps {
    balance: number;
}

// const combinations = [
//     'Triple', 'Pair', 'Sum 9', 'Sum 12', 'Any',
// ];

const BetPanel: React.FC<BetPanelProps> = ({ balance }) => {
    const dice = useSelector((state: any) => state.game.dice);
    const bets = useSelector((state: any) => state.game.bets);
    const dispatch = useDispatch();
    const tokens = [2, 5, 10];
    const tokenColors = {
        2: 'linear-gradient(135deg, #b2f7ef 0%, #40c9ff 100%)',
        5: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        10: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)',
    };

    // Calculate current balance after bets
    const totalBetAmount = bets.reduce((sum: number, bet: any) => sum + (bet.amount || 0), 0);
    const currentBalance = balance - totalBetAmount;

    // Import payout ratios
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GAME_PAYOUT_RATIOS } = require('../logic/combinations');

    // Calculate winnings and log details
    let winnings = 0;
    let winningLog: string[] = [];
    bets.forEach((bet: any) => {
        let winAmount = 0;
        let payoutRatio = 0;
        // let won = false;
        // Single dice payout logic
        if (bet.combination && bet.combination.startsWith('DICE_')) {
            const diceNum = parseInt(bet.combination.split('_')[1], 10);
            const matchCount = dice.filter((d: number) => d === diceNum).length;
            if (matchCount > 0) {
                payoutRatio = matchCount;
                winAmount = bet.amount * payoutRatio;
                winnings += winAmount;
                // won = true;
                winningLog.push(`WIN: $${winAmount} on ${bet.combination} (x${payoutRatio})`);
            } else {
                winningLog.push(`LOSE: $${bet.amount} on ${bet.combination}`);
            }
        } else if (bet.combination && GAME_PAYOUT_RATIOS[bet.combination]) {
            payoutRatio = GAME_PAYOUT_RATIOS[bet.combination];
            winAmount = bet.amount * payoutRatio;
            winnings += winAmount;
            // won = true;
            winningLog.push(`WIN: $${winAmount} on ${bet.combination} (x${payoutRatio})`);
        } else {
            winningLog.push(`LOSE: $${bet.amount} on ${bet.combination}`);
        }
    });
    const total = currentBalance + winnings;

    // Native draggable token component
    const BetToken: React.FC<{ value: number; color: string }> = ({ value, color }) => {
        return (
            <div
                draggable={true}
                onDragStart={e => {
                    e.dataTransfer.setData('token', value.toString());
                }}
                className="bet-token"
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    border: '3px solid #fff',
                    color: '#222',
                    textShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    cursor: 'grab',
                }}
            >
                ${value}
            </div>
        );
    };

    return (
        <div className="bet-panel">
            <h3>Place Your Bet</h3>
            <div style={{ marginBottom: 8, fontWeight: 500, display: 'flex', gap: 16, alignItems: 'center' }}>
                <span>Balance: ${currentBalance}</span>
                <span>Winnings: ${winnings}</span>
                <span>Total: ${total}</span>
            </div>
            {winningLog.length > 0 && (
                <div style={{ marginBottom: 8, fontSize: 14, color: '#1cae1c' }}>
                    <strong>Winning Log:</strong>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {winningLog.map((msg, idx) => (
                            <li key={idx} style={{ color: msg.startsWith('WIN') ? '#1cae1c' : '#d00' }}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
                {tokens.map(token => (
                    <BetToken key={token} value={token} color={tokenColors[token as 2 | 5 | 10]} />
                ))}
            </div>
            <div style={{ marginTop: 16 }}>
                <h4>Bets Made:</h4>
                {bets.length === 0 ? (
                    <div>No bets yet.</div>
                ) : (
                    <ul>
                        {bets.map((bet: any, idx: number) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>
                                    {bet.userId}: {bet.combination} - ${bet.amount}
                                    {bet.cellDice && bet.cellDice.length > 0 && (
                                        <span> | Dice: [{bet.cellDice.join(', ')}]</span>
                                    )}
                                </span>
                                <button
                                    style={{ marginLeft: 8, cursor: 'pointer', border: 'none', background: 'transparent', color: '#d00', fontWeight: 'bold', fontSize: 18 }}
                                    onClick={() => dispatch(removeBet(idx))}
                                    title="Remove bet"
                                >×</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Dice values={dice} />
            {/* The Bet button is disabled until drag-drop is implemented */}
        </div>
    );
};

export default BetPanel;
