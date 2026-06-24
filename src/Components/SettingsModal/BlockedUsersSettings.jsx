import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import { useLanguage } from '../../Context/LanguageContext';
import { Ban, User } from 'lucide-react';

const BlockedUsersSettings = () => {
    const { t } = useLanguage();
    const { user, refreshUser } = useAuth();
    const token = getToken();
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState('');

    const handleUnblock = async (blockedId) => {
        setLoadingId(blockedId);
        setError('');
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/requests/${blockedId}/unblock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                refreshUser();
            } else {
                const data = await res.json();
                setError(data.message || t('settings.unblock_error'));
            }
        } catch (err) {
            setError(t('account.connection_err'));
        } finally {
            setLoadingId(null);
        }
    };

    const blockedUsers = user?.blocked_users || [];

    return (
        <div className="settings-section">
            <h3>{t('settings.blocked_title')}</h3>
            
            {error && <div className="settings-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            {blockedUsers.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 0, padding: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('settings.no_blocked_users')}</p>
                </div>
            ) : (
                <div className="blocked-users-list">
                    {blockedUsers.map((blockedUser) => (
                        <div key={blockedUser._id} className="blocked-user-card">
                            <div className="blocked-user-info">
                                <div className="blocked-user-avatar">
                                    {blockedUser.profile_picture ? (
                                        <img 
                                            src={blockedUser.profile_picture} 
                                            alt={blockedUser.name} 
                                        />
                                    ) : (
                                        <User size={20} className="text-muted" />
                                    )}
                                </div>
                                <div className="blocked-user-details">
                                    <span className="blocked-user-name">{blockedUser.name}</span>
                                    <span className="blocked-user-id">ID: {blockedUser.public_id}</span>
                                </div>
                            </div>
                            <button
                                className="btn-unblock"
                                onClick={() => handleUnblock(blockedUser._id)}
                                disabled={loadingId === blockedUser._id}
                            >
                                <Ban size={14} />
                                {loadingId === blockedUser._id ? t('sidebar.loading') : t('settings.unblock_btn')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlockedUsersSettings;
