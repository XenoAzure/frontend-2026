import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import TransitionOverlay from '../../Components/TransitionOverlay/TransitionOverlay';
import './LandingScreen.css';

const LandingScreen = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path, { state: { fromLanding: true } });
        }, 800); // Wait for the grid to flip before navigating
    };

    return (
        <div className="landing-page">
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

            {isTransitioning && <TransitionOverlay type="in" />}

            <header className="landing-header">
                <div className="logo-container">
                    <span className="delta-symbol">Δ</span>
                    <span className="brand-name">Cobalt</span>
                </div>
                <div className="header-nav">
                    <button onClick={() => handleNavigation('/login')} className="btn btn-secondary nav-btn">Log in</button>
                    <button onClick={() => handleNavigation('/register')} className="btn nav-btn">Sign up</button>
                    <div className="menu-container">
                        <button className="menu-toggle-btn" onClick={toggleMenu}>
                            <i className="bi bi-list"></i>
                        </button>
                        {isMenuOpen && (
                            <div className="menu-dropdown">
                                <button className="dropdown-item">
                                    <i className="bi bi-translate"></i> Languages
                                </button>
                                <button className="dropdown-item">
                                    <i className="bi bi-brightness-high"></i> Light theme
                                </button>
                                <a 
                                    href="https://github.com/XenoAzure" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="dropdown-item"
                                >
                                    <i className="bi bi-github"></i> Github
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Communication systems for the modern age</h1>
                    <p className="hero-subtitle">
                        Streamline your workflow and connect with your team in a workspace designed for clarity and speed.
                    </p>
                    <div className="hero-actions">
                        <button onClick={() => handleNavigation('/register')} className="btn hero-btn">Get Started for Free</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="glass-blob blob-1"></div>
                    <div className="glass-blob blob-2"></div>
                    <div className="hero-card-preview">
                        <div className="preview-header">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <div className="preview-content">
                            <div className="preview-line long"></div>
                            <div className="preview-line medium"></div>
                            <div className="preview-line short"></div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p className="text-sm">© 2026 Cobalt Communication Systems. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingScreen;
