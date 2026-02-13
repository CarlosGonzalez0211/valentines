import React, { useState, useEffect } from 'react';
import './Letter.css';
import confetti from 'canvas-confetti';
import EvasiveNoButton from '../EvasiveNoButton/EvasiveNoButton';

const Letter = ({ isOpen, onReset }) => {
    const [isAccepted, setIsAccepted] = useState(false);
    const [showNoButton, setShowNoButton] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Delay showing the No button until the letter rising animation is mostly complete
            const timer = setTimeout(() => {
                setShowNoButton(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowNoButton(false);
        }
    }, [isOpen]);

    const handleYes = () => {
        setIsAccepted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#c9184a', '#ff8fa3', '#2ecc71']
        });
    };

    return (
        <div className={`letter ${isOpen ? 'visible' : ''}`}>
            <div className="letter-header">
                <button className="reset-btn" onClick={onReset} title="Repeat">
                    <span className="reset-icon">↺</span> Repeat
                </button>
            </div>

            <div className="letter-content">
                {!isAccepted ? (
                    <>
                        <h1 className="question">Will you be my<br />Valentine?</h1>
                        <div className="button-group">
                            <button className="yes-btn" onClick={handleYes}>Yes</button>
                            <EvasiveNoButton isVisible={showNoButton} />
                        </div>
                    </>
                ) : (
                    <div className="success-message">
                        <h1 className="happy-text">I knew you would say YES! 😉❤️</h1>
                        <div className="celebration-emoji">✨🥂🌹✨</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Letter;
