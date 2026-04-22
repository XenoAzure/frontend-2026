import React from 'react';
import { LogOut } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const { t } = useLanguage();
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title">
                    <LogOut size={24} style={{ color: 'var(--error-color)', marginBottom: '0.5rem' }} />
                    <div>{t('logout.confirmation_title')}</div>
                </div>
                <div className="modal-message">
                    {t('logout.confirmation_message')}
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        {t('logout.cancel')}
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        {t('logout.logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
