import React, { useState } from 'react';
import { UserPlus, Loader, X, ShieldCheck, User } from 'lucide-react';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import '../ProfilePanel/ProfilePanel.css';
import './MainLayout.css';

const ROLES = [
    { value: 'user', label: 'User', description: 'Can view and participate', icon: <User size={16} /> },
    { value: 'admin', label: 'Admin', description: 'Can manage members & content', icon: <ShieldCheck size={16} /> },
];

const InviteWorkspaceModal = ({ workspace_id, activeRole, onClose, onSuccess }) => {
    const [emailOrId, setEmailOrId] = useState('');
    const [role, setRole] = useState('user');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Only owner can assign admin; admins can only add users
    const availableRoles = activeRole === 'owner' ? ROLES : ROLES.filter(r => r.value === 'user');

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!emailOrId.trim()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = getToken();
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email_or_id: emailOrId.trim(), role })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || 'Member added successfully!');
                setTimeout(() => { onSuccess(); onClose(); }, 1500);
            } else {
                setError(data.message || 'Error adding member');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-panel view-only" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>


                <header className="panel-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <UserPlus size={22} style={{ color: 'var(--primary-color)' }} />
                        Add Member
                    </h2>
                    <button className="close-btn" onClick={onClose}><X size={22} /></button>
                </header>

                <form className="panel-content" onSubmit={handleInvite}>


                    <section className="profile-section">
                        <h3>Find User</h3>
                        <div className="field-group">
                            <label>Email or Public ID</label>
                            <input
                                type="text"
                                placeholder="user@email.com or ABC12345"
                                value={emailOrId}
                                onChange={e => setEmailOrId(e.target.value)}
                                disabled={isLoading || !!success}
                                autoFocus
                            />
                        </div>
                    </section>

                    {/* Role selector */}
                    <section className="profile-section">
                        <h3>Assign Role</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {availableRoles.map(r => (
                                <label
                                    key={r.value}
                                    onClick={() => !isLoading && !success && setRole(r.value)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.9rem 1rem',
                                        background: role === r.value ? 'rgba(99,102,241,0.12)' : 'rgba(15,23,42,0.4)',
                                        border: `2px solid ${role === r.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        userSelect: 'none'
                                    }}
                                >
                                    <span style={{ color: role === r.value ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                                        {r.icon}
                                    </span>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.9rem' }}>{r.label}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.description}</div>
                                    </div>
                                    {role === r.value && (
                                        <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: 'var(--primary-color)' }} />
                                    )}
                                </label>
                            ))}
                        </div>
                    </section>

                    {error && <div className="panel-error">{error}</div>}
                    {success && <div className="panel-success">{success}</div>}

                    <footer className="panel-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-save" disabled={isLoading || !!success || !emailOrId.trim()}>
                            {isLoading ? <Loader className="animate-spin" size={18} /> : <UserPlus size={18} />}
                            Add to Workspace
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default InviteWorkspaceModal;
