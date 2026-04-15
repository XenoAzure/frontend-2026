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

            {/* Delta */}
            <div className={`delta-container ${isExiting ? 'zoom-in' : ''}`}>
                <span className="huge-delta">Δ</span>
            </div>

            {/* Ocean Waves */}
            <div className={`waves-container ${isExiting ? 'waves-exit' : ''}`}>
                <svg className="wave wave-back" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path fill="var(--primary-color)" fillOpacity="0.3" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,149.3C672,117,768,75,864,80C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg className="wave wave-mid" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path fill="var(--primary-color)" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,149.3C384,139,480,85,576,85.3C672,85,768,139,864,165.3C960,192,1056,192,1152,165.3C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg className="wave wave-front" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path fill="var(--primary-color)" fillOpacity="0.8" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,149.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

        </div>
    );
};

export default PostLoginLoadingScreen;
