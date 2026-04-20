import React from 'react';
import { X, User } from 'lucide-react';
import '../../Components/MainLayout/MainLayout.css';

const WorkspaceScreenMembersModal = ({ members, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '400px', maxWidth: '90vw' }}>
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={24} style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontFamily: 'Orbitron' }}>Workspace Members</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {members.map(member => (
                        <div key={member.member_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>{member.user_name || `User ID: ${member.user_id.substring(0, 8)}...`}</span>
                            </div>

                            {(member.member_role === 'owner' || member.member_role === 'admin') && (
                                <span style={{ fontSize: '0.75rem', fontFamily: 'Orbitron', color: member.member_role === 'owner' ? 'var(--primary-color)' : 'var(--text-muted)', padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                                    {member.member_role.toUpperCase()}
                                </span>
                            )}
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No members found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceScreenMembersModal;
