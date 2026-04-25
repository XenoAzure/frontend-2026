import React from 'react';
import { useNavigate } from 'react-router';
import { X, AtSign, Play, Code, Gamepad, User, MessageSquare } from 'lucide-react';
import '../ProfilePanel/ProfilePanel.css';

const FriendProfileModal = ({ friend, onClose }) => {
    const navigate = useNavigate();
    if (!friend) return null;

    const handleMessage = () => {
        onClose();
        navigate(`/dm/${friend._id}`);
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-panel view-only" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="panel-header">
                    <h2>User Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                {/* Body */}
                <div className="panel-content">

                    {/* Avatar + name row */}
                    <section className="profile-section avatar-section">
                        <div className="avatar-wrapper" style={{ cursor: 'default' }}>
                            {friend.profile_picture ? (
                                <img src={friend.profile_picture} alt={friend.name} />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={64} />
                                </div>
                            )}
                        </div>

                        <div className="section-info" style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1.4rem',
                                color: 'var(--text-light)',
                                textTransform: 'none',
                                letterSpacing: 0,
                                marginBottom: '0.4rem'
                            }}>
                                {friend.name || 'Unknown User'}
                            </h3>

                            {friend.public_id && (
                                <div className="public-id-container" style={{ cursor: 'default', pointerEvents: 'none' }}>
                                    <span className="public-id-text">{friend.public_id}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Bio */}
                    <section className="profile-section">
                        <h3>Bio</h3>
                        <div className="field-group">
                            <p style={{
                                color: friend.bio ? 'var(--text-light)' : 'var(--text-muted)',
                                lineHeight: '1.6',
                                fontSize: '0.95rem',
                                whiteSpace: 'pre-wrap',
                                fontStyle: friend.bio ? 'normal' : 'italic',
                                background: 'rgba(15,23,42,0.4)',
                                border: '1px solid var(--border-color)',
                                padding: '1rem',
                                borderRadius: '0px'
                            }}>
                                {friend.bio || 'No bio set.'}
                            </p>
                        </div>
                    </section>

                    {/* Connections */}
                    <section className="profile-section">
                        <h3>Connections</h3>
                        <div className="social-inputs">
                            {/* Twitter */}
                            <div className="social-field">
                                <AtSign className="icon twitter" size={20} />
                                {friend.social_links?.twitter
                                    ? <a href={friend.social_links.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        {friend.social_links.twitter.replace(/^https?:\/\//, '')}
                                    </a>
                                    : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not set</span>
                                }
                            </div>
                            {/* YouTube */}
                            <div className="social-field">
                                <Play className="icon youtube" size={20} />
                                {friend.social_links?.youtube
                                    ? <a href={friend.social_links.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        {friend.social_links.youtube.replace(/^https?:\/\//, '')}
                                    </a>
                                    : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not set</span>
                                }
                            </div>
                            {/* GitHub */}
                            <div className="social-field">
                                <Code className="icon github" size={20} />
                                {friend.social_links?.github
                                    ? <a href={friend.social_links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        {friend.social_links.github.replace(/^https?:\/\//, '')}
                                    </a>
                                    : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not set</span>
                                }
                            </div>
                            {/* Steam */}
                            <div className="social-field">
                                <Gamepad className="icon steam" size={20} />
                                {friend.social_links?.steam
                                    ? <a href={friend.social_links.steam} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                        {friend.social_links.steam.replace(/^https?:\/\//, '')}
                                    </a>
                                    : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not set</span>
                                }
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="panel-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button type="button" className="btn btn-save" onClick={handleMessage}>
                        <MessageSquare size={18} />
                        Message
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FriendProfileModal;
