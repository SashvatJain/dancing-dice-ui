import React from 'react';

interface CombinationHighlightProps {
    combination: string;
}

const CombinationHighlight: React.FC<CombinationHighlightProps> = ({ combination }) => (
    <div className="combination-highlight">
        <strong>Result: {combination}</strong>
    </div>
);

export default CombinationHighlight;
