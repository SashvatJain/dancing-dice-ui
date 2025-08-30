import React from 'react';

interface DiceFaceProps {
    value: number;
    size?: number;
}

// Dot positions for each dice face
const dotMap: { [key: number]: Array<[number, number]> } = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
};

const DiceFace: React.FC<DiceFaceProps> = ({ value, size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: 12, background: 'none', boxShadow: '2px 4px 12px rgba(0,0,0,0.25)' }}>
        {/* 3D Red Dice Body */}
        <rect x="8" y="8" width="84" height="84" rx="18" fill="#d32f2f" stroke="#a31515" strokeWidth="6" />
        {/* Simulated 3D shine */}
        <ellipse cx="35" cy="30" rx="22" ry="10" fill="rgba(255,255,255,0.18)" />
        {/* Dice Dots */}
        {dotMap[value].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="10" fill="#fff" stroke="#eee" strokeWidth="2" />
        ))}
        {/* Simulated shadow */}
        <ellipse cx="50" cy="92" rx="32" ry="7" fill="rgba(0,0,0,0.18)" />
    </svg>
);

export default DiceFace;
