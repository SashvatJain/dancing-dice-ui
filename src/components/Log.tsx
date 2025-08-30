import React from 'react';

interface LogProps {
    logs: string[];
}

const Log: React.FC<LogProps> = ({ logs }) => (
    <div className="log">
        <h4>Game Log</h4>
        <ul>
            {logs.map((log, idx) => (
                <li key={idx}>{log}</li>
            ))}
        </ul>
    </div>
);

export default Log;
