import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Hash, User, UserPlus, MoreVertical, VolumeX, Trash2, Check, X, Ban, User as UserIcon, LogOut, CheckSquare } from 'lucide-react';
import useWorkspaces from '../../hooks/useWorkspaces';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import FriendProfileModal from './FriendProfileModal';
import InviteWorkspaceModal from './InviteWorkspaceModal';
import { useLanguage } from '../../Context/LanguageContext';

const SecondarySidebar = ({ currentFilter }) => {
    const { t } = useLanguage();
    const { workspaces, loading, loadWorkspaces } = useWorkspaces();
    const { user, refreshUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    const [friendId, setFriendId] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    // UI states
    const [activeContextMenu, setActiveContextMenu] = useState(null);
    const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);
    const [inviteWorkspaceId, setInviteWorkspaceId] = useState(null);
    
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveContextMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleContextMenu = (id, e) => {
        e.stopPropagation();
        setActiveContextMenu(prev => prev === id ? null : id);
    };

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!friendId.trim()) return;
        setActionLoading(true);
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ friend_public_id: friendId.trim() })
            });
            if (response.ok) {
                setFriendId('');
                setIsAddingFriend(false);
                refreshUser();
            } else {
                const data = await response.json();
                alert(data.message || 'Error al agregar amigo');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveFriend = async (id, e) => {
        e?.stopPropagation();
        setActiveContextMenu(null);
        if (!confirm('Are you sure you want to delete this friend?')) return;
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleMuteFriend = async (id, e) => {
        e?.stopPropagation();
        setActiveContextMenu(null);
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/${id}/mute`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleBlockFriend = async (id, e) => {
        e?.stopPropagation();
        setActiveContextMenu(null);
        handleFriendRequest(id, 'block');
    };

    const handleDeleteWorkspace = async (id, e) => {
        e?.stopPropagation();
        setActiveContextMenu(null);
        if (!confirm('¿Eliminar workspace? Solo aplicable si eres OWNER.')) return;
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) loadWorkspaces();
        } catch (error) { console.error(error); }
    };

    const handleMuteWorkspace = async (id, e) => {
        e?.stopPropagation();
        setActiveContextMenu(null);
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/workspaces/${id}/mute`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleFriendRequest = async (id, action) => {
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/requests/${id}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const filteredItems = [
        ...(currentFilter === 'workspaces' || !currentFilter ? (workspaces || []).map(w => ({ ...w, type: 'workspace', id: w.workspace_id, name: w.workspace_title, role: w.member_role })) : []),
        ...(currentFilter === 'dms' || !currentFilter ? (user?.friends || []).map(f => ({ ...f, type: 'user', id: f._id })) : [])
    ].filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <aside className="secondary-sidebar">
                <div className="background-text-boxes-sidebar">
                    {['SHARP', 'NODDY', '青い', 'X-AXIS', 'VOID', 'OPPOSE'].map((word, i) => (
                        <div key={i} className={`text-box-wrapper sb-box-${i + 1}`}>
                            <div className="text-box">{word}</div>
                        </div>
                    ))}
                </div>
                <div className="search-container">
                    <div className="search-box">
                        <Search size={18} className="text-muted" />
                        <input 
                            type="text" 
                            placeholder={t('sidebar.search_placeholder')} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        className="add-friend-btn" 
                        onClick={() => setIsAddingFriend(!isAddingFriend)}
                    >
                        <UserPlus size={16} /> {t('sidebar.add_friend')}
                    </button>
                    
                    {isAddingFriend && (
                        <form className="add-friend-form" onSubmit={handleAddFriend}>
                            <input 
                                type="text" 
                                placeholder={t('sidebar.friend_id_placeholder')} 
                                value={friendId}
                                onChange={(e) => setFriendId(e.target.value)}
                                disabled={actionLoading}
                                autoFocus
                            />
                            <button type="submit" disabled={actionLoading || !friendId.trim()}>
                                {t('sidebar.add')}
                            </button>
                        </form>
                    )}
                    
                    {user?.pending_requests?.length > 0 && (
                        <div className="pending-requests-panel">
                            <div className="pr-header">{t('sidebar.requests')} ({user.pending_requests.length})</div>
                            {user.pending_requests.map(req => (
                                <div key={req._id} className="pr-item">
                                    <span className="pr-name">{req.name}</span>
                                    <div className="pr-actions">
                                        <button onClick={() => handleFriendRequest(req._id, 'accept')} title={t('sidebar.accept')} className="pr-btn accept"><Check size={14}/></button>
                                        <button onClick={() => handleFriendRequest(req._id, 'decline')} title={t('sidebar.decline')} className="pr-btn decline"><X size={14}/></button>
                                        <button onClick={() => handleFriendRequest(req._id, 'block')} title={t('sidebar.block')} className="pr-btn block"><Ban size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-list" ref={menuRef}>
                    {loading ? (
                        <div className="text-center p-4 text-muted">{t('sidebar.loading')}</div>
                    ) : (
                        filteredItems.map((item) => {
                            const isWorkspace = item.type === 'workspace';
                            const isMenuOpen = activeContextMenu === item.id;
                            
                            return (
                                <div 
                                    key={`${item.type}-${item.id}`} 
                                    className="list-item"
                                    onClick={() => navigate(isWorkspace ? `/workspace/${item.id}` : `/dm/${item.id}`)}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <div className="item-avatar">
                                        {isWorkspace ? <Hash size={16} /> : <User size={16} />}
                                    </div>
                                    <span className="item-name">{item.name}</span>
                                    
                                    <div className="item-actions">
                                        <button 
                                            className="action-btn"
                                            onClick={(e) => toggleContextMenu(item.id, e)}
                                            title="Options"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    {isMenuOpen && (
                                        <div className="item-context-menu" onClick={(e) => e.stopPropagation()}>
                                            {isWorkspace ? (
                                                <>
                                                    <button className="menu-item" onClick={() => { setActiveContextMenu(null); navigate(`/workspace/${item.id}`); }}>
                                                        <Hash size={16} /> {t('sidebar.open_workspace')}
                                                    </button>
                                                    <button className="menu-item" onClick={() => { setActiveContextMenu(null); setInviteWorkspaceId(item.id); }}>
                                                        <UserPlus size={16} /> {t('sidebar.add_friend_workspace')}
                                                    </button>
                                                    <button className="menu-item" onClick={(e) => handleMuteWorkspace(item.id, e)}>
                                                        <VolumeX size={16} /> {user?.muted_workspaces?.includes(item.id) ? t('sidebar.unmute_workspace') : t('sidebar.mute_workspace')}
                                                    </button>
                                                    {(item.role?.toLowerCase() === 'owner') && (
                                                        <>
                                                            <div className="menu-divider" />
                                                            <button className="menu-item delete" onClick={(e) => handleDeleteWorkspace(item.id, e)}>
                                                                <Trash2 size={16} /> {t('sidebar.delete_workspace')}
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <button className="menu-item" onClick={() => { setActiveContextMenu(null); setSelectedFriendProfile(item); }}>
                                                        <UserIcon size={16} /> {t('sidebar.view_profile')}
                                                    </button>
                                                    <button className="menu-item" onClick={(e) => handleMuteFriend(item.id, e)}>
                                                        <VolumeX size={16} /> {user?.muted_friends?.includes(item.id) ? t('sidebar.unmute_friend') : t('sidebar.mute_friend')}
                                                    </button>
                                                    <button className="menu-item" onClick={() => setActiveContextMenu(null)}>
                                                        <CheckSquare size={16} /> {t('sidebar.mark_as_read')}
                                                    </button>
                                                    <div className="menu-divider" />
                                                    <button className="menu-item delete" onClick={(e) => handleBlockFriend(item.id, e)}>
                                                        <Ban size={16} /> {t('sidebar.block_friend')}
                                                    </button>
                                                    <button className="menu-item delete" onClick={(e) => handleRemoveFriend(item.id, e)}>
                                                        <Trash2 size={16} /> {t('sidebar.delete_friend')}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                    {!loading && filteredItems.length === 0 && (
                        <div className="text-center p-4 text-muted">{t('sidebar.no_results')}</div>
                    )}
                </div>
            </aside>

            {selectedFriendProfile && (
                <FriendProfileModal 
                    friend={selectedFriendProfile} 
                    onClose={() => setSelectedFriendProfile(null)} 
                />
            )}

            {inviteWorkspaceId && (
                <InviteWorkspaceModal 
                    workspace_id={inviteWorkspaceId} 
                    onClose={() => setInviteWorkspaceId(null)}
                    onSuccess={() => {}}
                />
            )}
        </>
    );
};

export default SecondarySidebar;
