import React from 'react';
import './TransitionOverlay.css';

const TransitionOverlay = ({ type = 'in' }) => {
    // Generate 200 tiles for full coverage
    const tiles = Array.from({ length: 200 });

    return (
        <div className="portal-transition-overlay">
            <div className={`transition-grid ${type === 'out' ? 'is-exiting' : ''}`}>
                {tiles.map((_, i) => (
                    <div 
                        key={i} 
                        className={`transition-tile ${type === 'out' ? 'tile-exit' : 'tile-enter'}`} 
                        style={{ 
                            animationDelay: `${(Math.floor(i / 10) * 50) + (i % 10 * 20)}ms` 
                        }} 
                    />
                ))}
            </div>
        </div>
    );
};

export default TransitionOverlay;
