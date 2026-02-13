import React, { useState } from 'react';
import './Envelope.css';
import Letter from '../Letter/Letter';

const Envelope = ({ onReset }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLetterUp, setIsLetterUp] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Wait for flap animation to finish before raising letter
        setTimeout(() => {
            setIsLetterUp(true);
        }, 600);
    };

    return (
        <div className="envelope-wrapper">
            <div className={`intro-text ${isOpen ? 'fade-out' : ''}`}>
                Danessa, you got a letter from your lover
            </div>

            <div
                className={`envelope ${isOpen ? 'open' : ''}`}
                onClick={handleOpen}
            >
                <div className="flap"></div>
                <div className="pocket"></div>

                <div className={`letter-container ${isLetterUp ? 'rise' : ''}`}>
                    <Letter isOpen={isOpen} onReset={onReset} />
                </div>
            </div>

            {!isOpen && <div className="click-hint">Click to open</div>}
        </div>
    );
};

export default Envelope;
