import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import TransitionOverlay from '../../Components/TransitionOverlay/TransitionOverlay';
import { useLanguage } from '../../Context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import c2 from '../../../images/c2.png';
import c3 from '../../../images/c3.png';
import c8 from '../../../images/c8.png';
import './LandingScreen.css';

const carouselImages = [c2, c3, c8];

const LandingScreen = () => {
    const { language, t, toggleLanguage } = useLanguage();
    const { isLogged } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [perfMode, setPerfMode] = useState(() => localStorage.getItem('perf_mode') === 'true');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogged) {
            navigate('/home');
        }
    }, [isLogged, navigate]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleNavigation = (path) => {
        if (perfMode) {
            // Skip the tile transition entirely in performance mode
            navigate(path, { state: { fromLanding: true } });
            return;
        }
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path, { state: { fromLanding: true } });
        }, 800); // Wait for the grid to flip before navigating
    };

    const togglePerfMode = () => {
        const next = !perfMode;
        setPerfMode(next);
        localStorage.setItem('perf_mode', String(next));
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 50) {
            handleNextImage();
        } else if (diff < -50) {
            handlePrevImage();
        }
        setTouchStartX(null);
    };

    return (
        <div className="landing-page">
            {!perfMode && (
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
            )}

            {!perfMode && (
                <div className="background-text-boxes">
                    {['ADVENT', 'ASPECT', 'SHARP', 'NODDY', '@', 'KEEN', 'ADVANCE', '青い', 'X-AXIS', 'EMPRESS', 'NUMB', 'OPPOSE', 'VOCAL', 'ERGO', 'LABYRINTH', 'VOID', 'EXPRESS', 'TRAGEDY'].map((word, i) => (
                        <div key={i} className={`text-box-wrapper box-${i + 1}`}>
                            <div className="text-box">{word}</div>
                        </div>
                    ))}
                </div>
            )}

            {isTransitioning && <TransitionOverlay type="in" />}

            <header className="landing-header">
                <div className="logo-container">
                    <span className="delta-symbol">Δ</span>
                    <span className="brand-name">Cobalt</span>
                </div>
                <div className="header-nav">
                    <button onClick={() => handleNavigation('/login')} className="btn btn-secondary nav-btn">{t('landing.login')}</button>
                    <button onClick={() => handleNavigation('/register')} className="btn nav-btn">{t('landing.signup')}</button>
                    <div className="menu-container">
                        <button className="menu-toggle-btn" onClick={toggleMenu}>
                            <i className="bi bi-list"></i>
                        </button>
                        {isMenuOpen && (
                            <div className="menu-dropdown">
                                <button className="dropdown-item" onClick={() => toggleLanguage(language === 'en' ? 'es' : 'en')}>
                                    <i className="bi bi-translate"></i> {language === 'en' ? 'Español' : 'English'}
                                </button>
                                <button className="dropdown-item" onClick={toggleTheme}>
                                    <i className={`bi bi-${theme === 'dark' ? 'brightness-high' : 'moon-stars'}`}></i> {theme === 'dark' ? t('landing.menu.light_theme') : t('landing.menu.dark_theme')}
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
                    <h1 className="hero-title">{t('landing.title')}</h1>
                    <p className="hero-subtitle">
                        {t('landing.subtitle')}
                    </p>
                    <div className="hero-actions">
                        <button onClick={() => handleNavigation('/register')} className="btn hero-btn">{t('landing.cta')}</button>
                        <button
                            id="landing-perf-toggle"
                            className={`perf-mode-btn${perfMode ? ' perf-active' : ''}`}
                            onClick={togglePerfMode}
                            title={t('landing.perf_mode_desc')}
                        >
                            <i className={`bi bi-${perfMode ? 'lightning-charge-fill' : 'lightning-charge'}`}></i>
                            {perfMode ? t('landing.perf_mode_off') : t('landing.perf_mode_on')}
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="glass-blob blob-1"></div>
                    <div className="glass-blob blob-2"></div>
                    <div 
                        className="hero-card-preview hero-image-carousel"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button 
                            className="carousel-arrow left" 
                            onClick={handlePrevImage}
                            aria-label="Previous Image"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <div className="carousel-image-wrapper">
                            <img 
                                src={carouselImages[currentImageIndex]} 
                                alt={`Carousel Image ${currentImageIndex + 1}`} 
                                className="carousel-image"
                            />
                        </div>

                        <button 
                            className="carousel-arrow right" 
                            onClick={handleNextImage}
                            aria-label="Next Image"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>

                        <div className="carousel-indicators">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p className="text-sm">{t('landing.footer')}</p>
            </footer>
        </div>
    );
};

export default LandingScreen;
