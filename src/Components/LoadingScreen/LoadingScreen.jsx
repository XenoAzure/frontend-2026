import React from 'react';
import './LoadingScreen.css';
import { useLanguage } from '../../Context/LanguageContext';

const LoadingScreen = ({ isExiting }) => {
  const { t } = useLanguage();
  return (
    <div className={`loading-screen-container ${isExiting ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <span className="delta-symbol">Δ</span>
        <div className="brand-text-container">
          <h1 className="cobalt-text">Cobalt</h1>
          <p className="cobalt-subtitle">{t('loading.subtitle')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
