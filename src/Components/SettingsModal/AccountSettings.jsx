import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import { useLanguage } from '../../Context/LanguageContext';

const AccountSettings = () => {
    const { t } = useLanguage();
    const { logout } = useAuth();
    const token = getToken();
    
    // Change password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    
    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        
        if (newPassword.length < 6) {
            setPasswordError(t('account.password_length_err'));
            return;
        }
        
        setPasswordLoading(true);
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/user/me/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                alert(t('account.password_success'));
                logout();
            } else {
                setPasswordError(data.message || t('account.password_err'));
            }
        } catch (error) {
            setPasswordError(t('account.connection_err'));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteError('');
        
        if (!deletePassword) {
            setDeleteError(t('account.delete_confirm_err'));
            return;
        }
        
        setDeleteLoading(true);
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/user/me`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: deletePassword
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                alert(t('account.delete_success'));
                logout();
            } else {
                setDeleteError(data.message || t('account.delete_err'));
            }
        } catch (error) {
            setDeleteError(t('account.connection_err'));
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="settings-section">
            <h3>{t('account.title')}</h3>
            
            <div className="account-form-container">
                <h4>{t('account.change_password')}</h4>
                <form onSubmit={handleChangePassword} className="settings-form">
                    <div className="input-group">
                        <label>{t('account.current_password')}</label>
                        <input 
                            type="password" 
                            value={currentPassword} 
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('account.new_password')}</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    {passwordError && <div className="settings-error">{passwordError}</div>}
                    <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                        {passwordLoading ? t('account.updating') : t('account.change_password_btn')}
                    </button>
                </form>
            </div>
            
            <div className="settings-divider"></div>
            
            <div className="account-form-container danger-zone">
                <h4>{t('account.delete_account')}</h4>
                <p className="danger-text">{t('account.delete_warning')}</p>
                
                {!showDeleteConfirm ? (
                    <button 
                        className="btn btn-danger" 
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        {t('account.delete_account')}
                    </button>
                ) : (
                    <form onSubmit={handleDeleteAccount} className="settings-form delete-confirm-form">
                        <div className="input-group">
                            <label>{t('account.confirm_password')}</label>
                            <input 
                                type="password" 
                                value={deletePassword} 
                                onChange={e => setDeletePassword(e.target.value)}
                                required
                            />
                        </div>
                        {deleteError && <div className="settings-error">{deleteError}</div>}
                        <div className="settings-actions-row">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeletePassword('');
                                    setDeleteError('');
                                }}
                            >
                                {t('account.cancel')}
                            </button>
                            <button type="submit" className="btn btn-danger" disabled={deleteLoading}>
                                {deleteLoading ? t('account.deleting') : t('account.accept')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
