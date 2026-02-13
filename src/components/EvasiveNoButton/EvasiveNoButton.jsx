import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './EvasiveNoButton.css';

const EvasiveNoButton = ({ isVisible }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isInitialized, setIsInitialized] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const jumpTimeout = useRef(null);

    const getRandomPosition = useCallback((currentPos) => {
        const padding = 100;
        const minJump = 350;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX, newY;
        let distance = 0;
        let attempts = 0;

        do {
            newX = Math.random() * (viewportWidth - padding * 2) + padding;
            newY = Math.random() * (viewportHeight - padding * 2) + padding;

            distance = Math.sqrt(
                Math.pow(newX - currentPos.x, 2) + Math.pow(newY - currentPos.y, 2)
            );
            attempts++;
        } while ((distance < minJump) && attempts < 50);

        return { x: newX, y: newY };
    }, []);

    const jump = useCallback(() => {
        if (jumpTimeout.current) return;

        jumpTimeout.current = setTimeout(() => {
            setPosition(prev => getRandomPosition(prev));
            jumpTimeout.current = null;
        }, 50);
    }, [getRandomPosition]);

    useEffect(() => {
        if (isVisible) {
            // Find the Yes button to position No button next to it initially
            const yesBtn = document.querySelector('.yes-btn');
            if (yesBtn) {
                const rect = yesBtn.getBoundingClientRect();
                // Position it side-by-side with a consistent gap
                // This ensures it starts inside the card's horizontal span
                setPosition({
                    x: rect.left + rect.width / 2 + 140, // Perfectly aligned with the new 5rem gap
                    y: rect.top + rect.height / 2
                });
            } else {
                // Fallback to center area
                setPosition({ x: window.innerWidth / 2 + 200, y: window.innerHeight / 2 + 100 });
            }
            setIsInitialized(true);
        }
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const handleMouseMove = (e) => {
            if (!buttonRef.current) return;

            const rect = buttonRef.current.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - buttonCenterX, 2) +
                Math.pow(e.clientY - buttonCenterY, 2)
            );

            if (distance < 150) {
                jump();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (jumpTimeout.current) clearTimeout(jumpTimeout.current);
        };
    }, [jump, isVisible]);

    const handleClick = () => {
        setShowModal(true);
        jump();
    };

    const closeModal = (e) => {
        e.stopPropagation();
        setShowModal(false);
    };

    if (!isVisible || !isInitialized) return null;

    const content = (
        <>
            <button
                ref={buttonRef}
                className="evasive-no-btn premium-shadow"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    position: 'fixed',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                }}
                onMouseEnter={jump}
                onClick={handleClick}
            >
                No
            </button>

            {showModal && (
                <div className="error-modal-overlay" onClick={closeModal}>
                    <div className="error-modal" onClick={e => e.stopPropagation()}>
                        <h3>System Error</h3>
                        <p>Application requires a 'Yes' input to proceed.</p>
                        <button onClick={closeModal}>Retry</button>
                    </div>
                </div>
            )}
        </>
    );

    return ReactDOM.createPortal(content, document.body);
};

export default EvasiveNoButton;
