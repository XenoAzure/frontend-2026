import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';
import AccountSettings from './AccountSettings';
import BlockedUsersSettings from './BlockedUsersSettings';
import { useAuth } from '../../hooks/useAuth';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
    const { language, t, toggleLanguage } = useLanguage();
    const { autoUpdateMode, setAutoUpdateMode } = useAuth();
    const [activeTab, setActiveTab] = useState('options');
    const [perfMode, setPerfMode] = useState(() => localStorage.getItem('perf_mode') === 'true');

    const togglePerfMode = (value) => {
        setPerfMode(value);
        localStorage.setItem('perf_mode', String(value));
    };

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
                        <button
                            className={`settings-tab ${activeTab === 'blocked' ? 'active' : ''}`}
                            onClick={() => setActiveTab('blocked')}
                        >
                            {t('settings.blocked_tab')}
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

                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.auto_update')}</label>
                                        <span className="settings-desc">{t('settings.auto_update_desc')}</span>
                                    </div>
                                    <div className="settings-actions">
                                        <button
                                            className={`theme-btn ${autoUpdateMode === 'automatic' ? 'active' : ''}`}
                                            onClick={() => setAutoUpdateMode('automatic')}
                                        >
                                            {t('settings.automatic')}
                                        </button>
                                        <button
                                            className={`theme-btn ${autoUpdateMode === 'manual' ? 'active' : ''}`}
                                            onClick={() => setAutoUpdateMode('manual')}
                                        >
                                            {t('settings.manual')}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.perf_mode')}</label>
                                        <span className="settings-desc">{t('settings.perf_mode_desc')}</span>
                                    </div>
                                    <div className="settings-actions">
                                        <button
                                            className={`theme-btn ${!perfMode ? 'active' : ''}`}
                                            onClick={() => togglePerfMode(false)}
                                        >
                                            {t('settings.perf_mode_off')}
                                        </button>
                                        <button
                                            className={`theme-btn ${perfMode ? 'active' : ''}`}
                                            onClick={() => togglePerfMode(true)}
                                        >
                                            {t('settings.perf_mode_on')}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-item credentials-item">
                                    <div className="settings-item-info">
                                        <label>{t('settings.credentials')}</label>
                                    </div>
                                    <div className="credentials-box">
                                        Build 3.0 Beta
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'account' ? (
                            <AccountSettings />
                        ) : (
                            <BlockedUsersSettings />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
