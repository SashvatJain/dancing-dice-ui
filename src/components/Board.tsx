import Dice from './Dice';
import DiceFace from './DiceFace';
import { useDispatch, useSelector } from 'react-redux';
import { addBet } from '../store/gameSlice';
import '../styles/board.css';
import type { GameCombination } from '../logic/combinations';
import { getGameCombinations } from '../logic/combinations';


// TwoDiceCell for react-dnd drop
const TwoDiceCell: React.FC<{ group: number[], highlighted: boolean }> = ({ group, highlighted }) => {
    return (
        <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
                e.preventDefault();
                const token = e.dataTransfer.getData('token');
                console.log('Bet placed:', { group, token });
                // TODO: Replace with actual bet saving logic
            }}
            className={`game-cell two-dice ${highlighted ? 'highlight' : ''}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            {group.map((n, i) => (
                <DiceFace key={i} value={n} size={22} />
            ))}
        </div>
    );
};
// Two dice groups for the new section
const twoDiceGroups = [
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 3], [2, 4], [2, 5], [2, 6],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 6],
    [5, 6],
];
// Helper to check if diceValues contain a two-dice group
const isTwoDiceHighlighted = (diceValues: number[], group: number[]) => {
    return group.every(val => diceValues.includes(val));
};
// Four dice groups for the new section
const fourDiceGroups = [
    [1, 2, 3, 4],
    [1, 2, 3, 5],
    [1, 2, 3, 6],
    [1, 2, 4, 5],
    [1, 2, 4, 6],
    [1, 2, 5, 6],
    [2, 3, 4, 5],
    [2, 3, 4, 6],
    [2, 3, 5, 6],
    [3, 4, 5, 6],
];
// Helper to check if diceValues are a subset of a fourDiceGroup
const isFourDiceHighlighted = (diceValues: number[], group: number[]) => {
    // Check if any combination of 3 dice from group matches diceValues (order doesn't matter)
    const groupCombos = [
        [group[0], group[1], group[2]],
        [group[0], group[1], group[3]],
        [group[0], group[2], group[3]],
        [group[1], group[2], group[3]],
    ];
    return groupCombos.some(combo =>
        combo.every(val => diceValues.includes(val)) &&
        diceValues.length === 3
    );
};


interface BoardProps {
    diceValues: number[];
}

const sumPayouts: { [key: number]: string } = {
    4: '60:1', 5: '20:1', 6: '18:1', 7: '12:1', 8: '8:1', 9: '6:1', 10: '6:1', 11: '6:1', 12: '6:1', 13: '8:1', 14: '12:1', 15: '18:1', 16: '20:1', 17: '60:1'
};

const Board: React.FC<BoardProps> = ({ diceValues }) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: any) => state.user.userId);
    const combos = getGameCombinations(diceValues);

    // Helper to check highlight
    const isHighlighted = (combo: GameCombination) => combos.includes(combo);

    // Helper for drop logic
    const handleDrop = (type: string, value: any) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const token = e.dataTransfer.getData('token');
        // Determine dice for the cell
        let cellDice: number[] = [];
        if (type === 'TWO_DICE' || type === 'FOUR_DICE') {
            cellDice = Array.isArray(value) ? value : [];
        } else if (type === 'SINGLE' || type === 'PAIR' || type === 'TRIPLE') {
            cellDice = Array(type === 'SINGLE' ? 1 : type === 'PAIR' ? 2 : 3).fill(value);
        } else if (type === 'SUM') {
            cellDice = []; // Could be calculated if needed
        } else {
            cellDice = [];
        }
        console.log('Bet placed:', { type, value, token, userId, cellDice });
        // Save bet in Redux store
        dispatch(addBet({
            combination: type === 'SUM' || type === 'SINGLE' || type === 'PAIR' || type === 'TRIPLE' ? `${type}_${value}` : type,
            amount: Number(token),
            userId,
            cellDice
        }));
    };

    return (
        <div className="board">
            <h2>Dancing Dice Board</h2>

            <div className="game-mainboard">
                <div className="game-row">
                    <div className="game-column">
                        <div
                            className={`game-cell bigsmall half-height ${isHighlighted('SMALL') ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('SMALL', 'SMALL')}
                        >SMALL</div>
                        <div
                            className={`game-cell oddeven half-height ${isHighlighted('ODD') ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('ODD', 'ODD')}
                        >ODD</div>
                    </div>

                    <div className="game-column" id="pairs">
                        <div className='game-row'>
                            <div className='logic'>logic here</div>
                        </div>
                        <div className='game-row'>
                            {[1, 2, 3].map(n => (
                                <div
                                    key={n}
                                    className={`game-cell pair ${isHighlighted(`PAIR_${n}` as GameCombination) ? 'highlight' : ''}`}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop('PAIR', n)}
                                >
                                    <DiceFace value={n} size={22} />
                                    <DiceFace value={n} size={22} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="game-column" id="triples">
                        <div className='game-row'>
                            <div className='logic'>logic here</div>
                        </div>
                        <div className="game-row" >
                            {[1, 2, 3].map(n => (
                                <div
                                    key={n}
                                    className={`game-cell triple ${isHighlighted(`TRIPLE_${n}` as GameCombination) ? 'highlight' : ''}`}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop('TRIPLE', n)}
                                >
                                    <div className='game-column' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                        <DiceFace value={n} size={22} />
                                        <DiceFace value={n} size={22} />
                                        <DiceFace value={n} size={22} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="game-column" id="triples">
                        <div className='game-row'>
                            <div className='logic'>logic here</div>
                        </div>
                        <div className="game-row" ></div>
                        <div
                            className={`game-column game-cell any-triple ${isHighlighted('ANY_TRIPLE') ? 'highlight' : ''}`}
                            style={{ padding: 6 }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('ANY_TRIPLE', 'ANY_TRIPLE')}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 8 }}>
                                {[0, 1, 2, 3, 4, 5].map((n, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                        <DiceFace value={n + 1} size={26} />
                                        <DiceFace value={n + 1} size={26} />
                                        <DiceFace value={n + 1} size={26} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="game-column" id="triples">
                        <div className='game-row'>
                            <div className='logic'>logic here</div>
                        </div>
                        <div className="game-row" >
                            {[4, 5, 6].map(n => (
                                <div
                                    key={n}
                                    className={`game-cell triple ${isHighlighted(`TRIPLE_${n}` as GameCombination) ? 'highlight' : ''}`}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop('TRIPLE', n)}
                                >
                                    <div className='game-column' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                        <DiceFace value={n} size={22} />
                                        <DiceFace value={n} size={22} />
                                        <DiceFace value={n} size={22} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="game-column" id="pairs">
                        <div className='game-row'>
                            <div className='logic'>logic here</div>
                        </div>
                        <div className='game-row'>
                            {[4, 5, 6].map(n => (
                                <div
                                    key={n}
                                    className={`game-cell pair ${isHighlighted(`PAIR_${n}` as GameCombination) ? 'highlight' : ''}`}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop('PAIR', n)}
                                >
                                    <DiceFace value={n} size={22} />
                                    <DiceFace value={n} size={22} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="game-column">
                        <div
                            className={`game-cell bigsmall half-height ${isHighlighted('BIG') ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('BIG', 'BIG')}
                        >BIG</div>
                        <div
                            className={`game-cell oddeven half-height ${isHighlighted('EVEN') ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('EVEN', 'EVEN')}
                        >EVEN</div>
                    </div>
                </div>
                <div className="game-row sums">
                    {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(sum => (
                        <div
                            key={sum}
                            className={`game-cell sum ${isHighlighted(`SUM_${sum}` as GameCombination) ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('SUM', sum)}
                        >
                            <div className="game-sum-value">{sum}</div>
                            <div className="payout">{sumPayouts[sum]}</div>
                        </div>
                    ))}
                </div>
                {/* Two Dice Section */}
                <div className="game-row two-dice-section">
                    {twoDiceGroups.map((group, idx) => (
                        <div
                            key={idx}
                            className={`game-cell two-dice ${isTwoDiceHighlighted(diceValues, group) ? 'highlight' : ''}`}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('TWO_DICE', group)}
                        >
                            {group.map((n, i) => (
                                <DiceFace key={i} value={n} size={22} />
                            ))}
                        </div>
                    ))}
                </div>
                {/* Four Dice Section */}
                <div className="game-row four-dice-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                        {fourDiceGroups.map((group, idx) => (
                            <div
                                key={idx}
                                className={`game-cell four-dice ${isFourDiceHighlighted(diceValues, group) ? 'highlight' : ''}`}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleDrop('FOUR_DICE', group)}
                            >
                                {group.map((n, i) => (
                                    <DiceFace key={i} value={n} size={22} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="game-row singles">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div
                            key={n}
                            className={`game-cell single ${isHighlighted(`DICE_${n}` as GameCombination) ? 'highlight' : ''}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop('SINGLE', n)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DiceFace value={n} size={22} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
