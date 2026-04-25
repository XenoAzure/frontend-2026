import React, { useState } from 'react';
import { X, User, Crown, ShieldCheck, Copy } from 'lucide-react';
import '../../Components/ProfilePanel/ProfilePanel.css';

const ROLE_CONFIG = {
    owner: { label: 'OWNER', color: 'var(--primary-color)', Icon: Crown },
    admin: { label: 'ADMIN', color: 'var(--secondary-color)', Icon: ShieldCheck },
    user: { label: 'USER', color: 'var(--text-muted)', Icon: null },
};

const WorkspaceScreenMembersModal = ({ members, onClose }) => {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div
                className="profile-panel view-only"
                style={{ maxWidth: 480 }}
                onClick={e => e.stopPropagation()}
            >

                <header className="panel-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <User size={20} style={{ color: 'var(--primary-color)' }} />
                        Workspace Members
                    </h2>
                    <button className="close-btn" onClick={onClose}><X size={22} /></button>
                </header>


                <div className="panel-content" style={{ gap: '0.75rem' }}>
                    {members.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            No members found.
                        </p>
                    )}

                    {members.map(member => {
                        const role = member.member_role?.toLowerCase() || 'user';
                        const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
                        const isCopied = copiedId === member.user_public_id;

                        return (
                            <div
                                key={member.member_id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(15,23,42,0.4)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = cfg.color}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 44, height: 44,
                                    borderRadius: '50%',
                                    border: `2px solid ${cfg.color}`,
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: 'var(--bg-surface)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {member.user_profile_picture ? (
                                        <img
                                            src={member.user_profile_picture}
                                            alt={member.user_name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <User size={20} style={{ color: 'var(--text-muted)' }} />
                                    )}
                                </div>

                                {/* Name + public id */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {member.user_name || 'Unknown'}
                                    </div>
                                    {member.user_public_id && (
                                        <div
                                            className="public-id-copy-hint"
                                            onClick={() => handleCopy(member.user_public_id)}
                                            style={{
                                                fontSize: '0.75rem',
                                                color: isCopied ? 'var(--primary-color)' : 'var(--text-muted)',
                                                fontFamily: 'Orbitron',
                                                letterSpacing: '0.5px',
                                                marginTop: '0.1rem',
                                                cursor: 'copy',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                transition: 'color 0.2s'
                                            }}
                                            title="Click to copy Public ID"
                                        >
                                            {isCopied ? 'COPIED!' : member.user_public_id}
                                            {!isCopied && <Copy size={10} />}
                                        </div>
                                    )}
                                </div>

                                {/* Role badge */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                                    padding: '0.25rem 0.6rem',
                                    background: `${cfg.color}18`,
                                    border: `1px solid ${cfg.color}55`,
                                    color: cfg.color,
                                    fontSize: '0.7rem',
                                    fontFamily: 'Orbitron',
                                    letterSpacing: '1px',
                                    flexShrink: 0,
                                }}>
                                    {cfg.Icon && <cfg.Icon size={12} />}
                                    {cfg.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceScreenMembersModal;
