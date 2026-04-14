import React from 'react';
import { MessageSquare, Hash, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PrimarySidebar = ({ currentFilter, onFilterChange }) => {
    const { user } = useAuth();

    return (
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
                <div className="sidebar-icon profile-pic" title="Profile">
                    {user?.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name} />
                    ) : (
                        <UserIcon size={24} />
                    )}
                </div>
            </div>
        </aside>
    );
};

export default PrimarySidebar;
