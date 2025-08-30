import React from 'react';

interface BalanceProps {
    balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => (
    <div className="balance">
        <h4>Balance: ${balance}</h4>
    </div>
);

export default Balance;
