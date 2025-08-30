import React from 'react';
import DiceFace from './DiceFace';

interface DiceProps {
    values: number[];
}

const Dice: React.FC<DiceProps> = ({ values }) => (
    <div className="dice-container">
        {values.map((value, idx) => (
            <div key={idx} className="dice">
                <DiceFace value={value} size={40} />
            </div>
        ))}
    </div>
);

export default Dice;
