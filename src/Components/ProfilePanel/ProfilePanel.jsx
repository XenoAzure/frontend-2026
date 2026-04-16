import React, { useState, useEffect } from 'react';
import { X, Camera, AtSign, Play, Code, Gamepad, Save, User, Loader, Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';
import { getToken } from '../../Context/AuthContext';
import './ProfilePanel.css';

const ProfilePanel = ({ onClose }) => {
    const { user, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copied, setCopied] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        profile_picture: user?.profile_picture || '',
        social_links: {
            twitter: user?.social_links?.twitter || '',
            youtube: user?.social_links?.youtube || '',
            github: user?.social_links?.github || '',
            steam: user?.social_links?.steam || ''
        }
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('La imagen es demasiado grande (máximo 2MB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_picture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [key]: value
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const token = getToken();
            const response = await updateProfile(formData, token);
            
            if (response.ok) {
                setSuccess('Perfil actualizado exitosamente');
                refreshUser();
                setTimeout(() => onClose(), 1500);
            } else {
                setError(response.message || 'Error al actualizar el perfil');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
                <header className="panel-header">
                    <h2>Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form className="panel-content" onSubmit={handleSave}>
                    <section className="profile-section avatar-section">
                        <div className="avatar-wrapper">
                            {formData.profile_picture ? (
                                <img src={formData.profile_picture} alt="Preview" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={64} />
                                </div>
                            )}
                            <label className="avatar-upload-label">
                                <Camera size={20} />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange} 
                                    hidden 
                                />
                            </label>
                        </div>
                    </section>

                    <section className="profile-section">
                        <div className="field-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Display name"
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label>Public ID</label>
                            <div className="public-id-container" onClick={() => {
                                navigator.clipboard.writeText(user?.public_id || '');
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}>
                                <span className="public-id-text">{user?.public_id || 'Generating...'}</span>
                                <button type="button" className="copy-btn">
                                    {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="field-group">
                            <div className="label-with-counter">
                                <label>Bio</label>
                                <span className={`char-counter ${formData.bio.length > 300 ? 'error' : ''}`}>
                                    {formData.bio.length}/300
                                </span>
                            </div>
                            <textarea 
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 300) })}
                                placeholder="Tell us about yourself..."
                                rows="4"
                            />
                        </div>
                    </section>

                    <section className="profile-section">
                        <h3>Connections</h3>
                        <div className="social-inputs">
                            <div className="social-field">
                                <AtSign className="icon twitter" size={20} />
                                <input 
                                    type="url" 
                                    placeholder="Twitter profile URL" 
                                    value={formData.social_links.twitter}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                />
                            </div>
                            <div className="social-field">
                                <Play className="icon youtube" size={20} />
                                <input 
                                    type="url" 
                                    placeholder="YouTube channel URL" 
                                    value={formData.social_links.youtube}
                                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                />
                            </div>
                            <div className="social-field">
                                <Code className="icon github" size={20} />
                                <input 
                                    type="url" 
                                    placeholder="GitHub profile URL" 
                                    value={formData.social_links.github}
                                    onChange={(e) => handleSocialChange('github', e.target.value)}
                                />
                            </div>
                            <div className="social-field">
                                <Gamepad className="icon steam" size={20} />
                                <input 
                                    type="url" 
                                    placeholder="Steam profile URL" 
                                    value={formData.social_links.steam}
                                    onChange={(e) => handleSocialChange('steam', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {error && <div className="panel-error">{error}</div>}
                    {success && <div className="panel-success">{success}</div>}

                    <footer className="panel-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-save" disabled={isLoading || formData.bio.length > 300}>
                            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ProfilePanel;
