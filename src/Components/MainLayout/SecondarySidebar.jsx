import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Hash, User, UserPlus, VolumeX, Trash2, Check, X, Ban } from 'lucide-react';
import useWorkspaces from '../../hooks/useWorkspaces';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';

const SecondarySidebar = ({ currentFilter }) => {
    const { workspaces, loading, loadWorkspaces } = useWorkspaces();
    const { user, refreshUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    const [friendId, setFriendId] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    const token = getToken();

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
        e.stopPropagation();
        if (!confirm('¿Eliminar amigo?')) return;
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleMuteFriend = async (id, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/${id}/mute`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleDeleteWorkspace = async (id, e) => {
        e.stopPropagation();
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
        e.stopPropagation();
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/workspaces/${id}/mute`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const handleFriendRequest = async (id, action) => {
        // action can be: 'accept', 'decline', 'block'
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends/requests/${id}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) refreshUser();
        } catch (error) { console.error(error); }
    };

    const filteredItems = [
        ...(currentFilter === 'workspaces' || !currentFilter ? (workspaces || []).map(w => ({ ...w, type: 'workspace', id: w.workspace_id, name: w.workspace_title })) : []),
        ...(currentFilter === 'dms' || !currentFilter ? (user?.friends || []).map(f => ({ ...f, type: 'user', id: f._id })) : [])
    ].filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
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
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <button 
                    className="add-friend-btn" 
                    onClick={() => setIsAddingFriend(!isAddingFriend)}
                >
                    <UserPlus size={16} /> Add Friend
                </button>
                
                {isAddingFriend && (
                    <form className="add-friend-form" onSubmit={handleAddFriend}>
                        <input 
                            type="text" 
                            placeholder="Friend's Public ID" 
                            value={friendId}
                            onChange={(e) => setFriendId(e.target.value)}
                            disabled={actionLoading}
                            autoFocus
                        />
                        <button type="submit" disabled={actionLoading || !friendId.trim()}>
                            Add
                        </button>
                    </form>
                )}
                
                {user?.pending_requests?.length > 0 && (
                    <div className="pending-requests-panel">
                        <div className="pr-header">Solicitudes ({user.pending_requests.length})</div>
                        {user.pending_requests.map(req => (
                            <div key={req._id} className="pr-item">
                                <span className="pr-name">{req.name}</span>
                                <div className="pr-actions">
                                    <button onClick={() => handleFriendRequest(req._id, 'accept')} title="Accept" className="pr-btn accept"><Check size={14}/></button>
                                    <button onClick={() => handleFriendRequest(req._id, 'decline')} title="Decline" className="pr-btn decline"><X size={14}/></button>
                                    <button onClick={() => handleFriendRequest(req._id, 'block')} title="Block" className="pr-btn block"><Ban size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="sidebar-list">
                {loading ? (
                    <div className="text-center p-4 text-muted">Loading...</div>
                ) : (
                    filteredItems.map((item) => (
                        <div 
                            key={`${item.type}-${item.id}`} 
                            className="list-item"
                            onClick={() => navigate(item.type === 'workspace' ? `/workspace/${item.id}` : `/dm/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="item-avatar">
                                {item.type === 'workspace' ? <Hash size={16} /> : <User size={16} />}
                            </div>
                            <span className="item-name">{item.name}</span>
                            
                            <div className="item-actions">
                                <button 
                                    className={`action-btn ${item.type === 'workspace' ? 
                                        (user?.muted_workspaces?.includes(item.id) ? 'muted' : '') : 
                                        (user?.muted_friends?.includes(item.id) ? 'muted' : '')}`}
                                    onClick={(e) => item.type === 'workspace' ? handleMuteWorkspace(item.id, e) : handleMuteFriend(item.id, e)}
                                    title="Mute"
                                >
                                    <VolumeX size={14} />
                                </button>
                                <button 
                                    className="action-btn delete"
                                    onClick={(e) => item.type === 'workspace' ? handleDeleteWorkspace(item.id, e) : handleRemoveFriend(item.id, e)}
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center p-4 text-muted">No results found</div>
                )}
            </div>
        </aside>
    );
};

export default SecondarySidebar;
