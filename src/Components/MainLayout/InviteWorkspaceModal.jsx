import React, { useState } from 'react';
import { UserPlus, Loader } from 'lucide-react';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import './MainLayout.css';

const InviteWorkspaceModal = ({ workspace_id, onClose, onSuccess }) => {
    const [friendId, setFriendId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!friendId.trim()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = getToken();
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/member/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email_or_id: friendId.trim() })
            });

            if (response.ok) {
                setSuccess('Invitation sent successfully!');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.message || 'Error sending invitation');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <UserPlus size={24} style={{ color: 'var(--primary-color)' }} />
                    <div>Invite to Workspace</div>
                </div>

                <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Friend's Email or ID</label>
                        <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            placeholder="Enter Email or Public ID"
                            value={friendId}
                            onChange={(e) => setFriendId(e.target.value)}
                            disabled={isLoading || success}
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-text" style={{ margin: 0, padding: '0.5rem' }}>{error}</div>}
                    {success && <div className="success-text" style={{ margin: 0, padding: '0.5rem' }}>{success}</div>}

                    <div className="modal-actions" style={{ marginTop: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn" disabled={isLoading || success || !friendId.trim()}>
                            {isLoading ? <Loader className="animate-spin" size={18} /> : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteWorkspaceModal;
