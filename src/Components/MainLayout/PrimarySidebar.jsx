import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Hash, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import LogoutModal from './LogoutModal';

const PrimarySidebar = ({ currentFilter, onFilterChange }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
    };

    const handleOpenProfile = () => {
        setIsMenuOpen(false);
        setIsProfileOpen(true);
    };

    return (
        <>
            <aside className="primary-sidebar">
                <div className="sidebar-top">
                    <div 
                        className={`sidebar-icon ${currentFilter === 'dms' ? 'active' : ''}`}
                        onClick={() => onFilterChange(currentFilter === 'dms' ? null : 'dms')}
                        title="Direct Messages"
                    >
                        <MessageSquare size={24} />
                    </div>
                    <div 
                        className={`sidebar-icon ${currentFilter === 'workspaces' ? 'active' : ''}`}
                        onClick={() => onFilterChange(currentFilter === 'workspaces' ? null : 'workspaces')}
                        title="Workspaces"
                    >
                        <Hash size={24} />
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-icon" title="Settings">
                        <Settings size={24} />
                    </div>
                    <div className="profile-container" ref={menuRef}>
                        <div 
                            className={`sidebar-icon profile-pic ${isMenuOpen ? 'active' : ''}`} 
                            title="Profile"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt={user.name} />
                            ) : (
                                <UserIcon size={24} />
                            )}
                        </div>

                        {isMenuOpen && (
                            <div className="profile-context-menu">
                                <button className="menu-item" onClick={handleOpenProfile}>
                                    <UserIcon size={18} />
                                    <span>Profile</span>
                                </button>
                                <div className="menu-divider" />
                                <button className="menu-item logout" onClick={handleLogoutClick}>
                                    <LogOut size={18} />
                                    <span>Log out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {isProfileOpen && (
                <ProfilePanel onClose={() => setIsProfileOpen(false)} />
            )}

            {isLogoutModalOpen && (
                <LogoutModal 
                    onConfirm={handleConfirmLogout} 
                    onCancel={() => setIsLogoutModalOpen(false)} 
                />
            )}
        </>
    );
};

export default PrimarySidebar;
