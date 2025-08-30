import React from 'react';

// Log type: { dice: number[], bets: { combination: string, amount: number, won: boolean, payoutRatio: number }[], totalWon: number }
interface UserLogEntry {
    dice: number[];
    bets: {
        combination: string;
        amount: number;
        won: boolean;
        payoutRatio: number;
    }[];
    totalWon: number;
}

interface UserLogProps {
    userLogs: UserLogEntry[];
}

const UserLog: React.FC<UserLogProps> = ({ userLogs }) => (
    <div className="user-log">
        <h4>Your Log</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {userLogs.map((log, idx) => (
                <li key={idx} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        Dice rolled: <span style={{ color: '#0077cc' }}>[{log.dice.join(', ')}]</span>
                    </div>
                    <div>
                        Combos:
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                            {log.bets.map((bet, bidx) => (
                                <li
                                    key={bidx}
                                    style={{
                                        color: bet.won ? '#1cae1c' : '#222',
                                        fontWeight: bet.won ? 700 : 400,
                                        background: bet.won ? 'linear-gradient(90deg,#e0ffe0 0%,#c0ffc0 100%)' : 'none',
                                        borderRadius: bet.won ? 4 : 0,
                                        padding: bet.won ? '2px 6px' : '0',
                                        display: 'inline-block',
                                        marginBottom: 2,
                                    }}
                                >
                                    {bet.combination} - ${bet.amount}
                                    {bet.won && (
                                        <span style={{ marginLeft: 6, color: '#007700', fontWeight: 600 }}>
                                            (Won x{bet.payoutRatio})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ marginTop: 4, fontWeight: 500 }}>
                        Total Won: <span style={{ color: log.totalWon > 0 ? '#1cae1c' : '#d00' }}>${log.totalWon}</span>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default UserLog;
