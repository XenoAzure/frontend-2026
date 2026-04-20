import React from 'react';
import { X, AtSign, Play, Code, Gamepad, User } from 'lucide-react';
import '../ProfilePanel/ProfilePanel.css'; // Reusing established panel styles

const FriendProfileModal = ({ friend, onClose }) => {
    if (!friend) return null;

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-panel view-only" onClick={(e) => e.stopPropagation()}>
                <header className="panel-header">
                    <h2>User Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="panel-content">
                    <section className="profile-section avatar-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                        <div className="avatar-wrapper" style={{ cursor: 'default' }}>
                            {friend.profile_picture ? (
                                <img src={friend.profile_picture} alt={friend.name} />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={64} />
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="profile-section" style={{ textAlign: 'center', paddingTop: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{friend.name || 'Unknown User'}</h2>
                        <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontFamily: 'Orbitron', letterSpacing: '1px' }}>
                            {friend.public_id}
                        </div>
                        
                        {friend.bio && (
                            <div className="field-group" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                                <label style={{ display: 'block', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Bio</label>
                                <p style={{ color: 'var(--text-light)', lineHeight: '1.5', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                    {friend.bio}
                                </p>
                            </div>
                        )}
                    </section>

                    {friend.social_links && (Object.values(friend.social_links).some(link => link)) && (
                        <section className="profile-section">
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'block' }}>Connections</h3>
                            <div className="social-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {friend.social_links.twitter && (
                                    <div className="social-field view-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                                        <AtSign className="icon twitter" size={20} />
                                        <a href={friend.social_links.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                                            {friend.social_links.twitter.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                {friend.social_links.youtube && (
                                    <div className="social-field view-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                                        <Play className="icon youtube" size={20} />
                                        <a href={friend.social_links.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                                            {friend.social_links.youtube.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                {friend.social_links.github && (
                                    <div className="social-field view-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                                        <Code className="icon github" size={20} />
                                        <a href={friend.social_links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                                            {friend.social_links.github.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                {friend.social_links.steam && (
                                    <div className="social-field view-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                                        <Gamepad className="icon steam" size={20} />
                                        <a href={friend.social_links.steam} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                                            {friend.social_links.steam.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendProfileModal;
