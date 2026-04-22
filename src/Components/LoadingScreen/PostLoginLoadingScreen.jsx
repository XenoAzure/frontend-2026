import React, { useEffect, useState } from 'react';
import './PostLoginLoadingScreen.css';

const PostLoginLoadingScreen = ({ onFinished }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start the zoom-in & fade-out at 2.5 seconds
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 2500);

        // unmount the component at 3.0 seconds
        const finishTimer = setTimeout(() => {
            if (onFinished) {
                onFinished();
            }
        }, 3000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinished]);

    return (
        <div className={`post-login-overlay ${isExiting ? 'fade-out' : ''}`}>

            {/* Background Cubes Logic */}
            <div className="background-cubes">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`cube-wrapper cube-${i + 1}`}>
                        <div className="cube">
                            <div className="face front"></div>
                            <div className="face back"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face top"></div>
                            <div className="face bottom"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`delta-container ${isExiting ? 'zoom-in' : ''}`}>
                <span className="huge-delta">Δ</span>
            </div>
            <div className={`strings-container ${isExiting ? 'strings-exit' : ''}`}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`string string-${i + 1}`}></div>
                ))}
            </div>

        </div>
    );
};

export default PostLoginLoadingScreen;
