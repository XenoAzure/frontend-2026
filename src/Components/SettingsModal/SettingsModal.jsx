import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';
import AccountSettings from './AccountSettings';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
    const { language, t, toggleLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState('options');

    // Theme switching logic
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const toggleTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>{t('settings.title')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="settings-content-wrapper">
                    <div className="settings-sidebar">
                        <button
                            className={`settings-tab ${activeTab === 'options' ? 'active' : ''}`}
                            onClick={() => setActiveTab('options')}
                        >
                            {t('settings.options_tab')}
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            {t('settings.account_tab')}
                        </button>
                    </div>

                    <div className="settings-main">
                        {activeTab === 'options' ? (
                            <div className="settings-section">
                                <h3>{t('settings.options_tab')}</h3>

                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.change_theme')}</label>
                                        <span className="settings-desc">{t('settings.switch_theme')}</span>
                                    </div>
                                    <div className="settings-actions">
                                        <button
                                            className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
                                            onClick={() => toggleTheme('dark')}
                                        >
                                            {t('settings.dark')}
                                        </button>
                                        <button
                                            className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
                                            onClick={() => toggleTheme('light')}
                                        >
                                            {t('settings.light')}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.change_language')}</label>
                                        <span className="settings-desc">{t('settings.select_language')}</span>
                                    </div>
                                    <div className="settings-actions">
                                        <button
                                            className={`theme-btn ${language === 'en' ? 'active' : ''}`}
                                            onClick={() => toggleLanguage('en')}
                                        >
                                            {t('settings.english')}
                                        </button>
                                        <button
                                            className={`theme-btn ${language === 'es' ? 'active' : ''}`}
                                            onClick={() => toggleLanguage('es')}
                                        >
                                            {t('settings.spanish')}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-item credentials-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.credentials')}</label>
                                    </div>
                                    <div className="credentials-box">
                                        Build 2.0 Beta
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <AccountSettings />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
