import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { User, MoreVertical, LogOut, Users, VolumeX, CheckSquare, Edit3, Plus, Save, X } from 'lucide-react';
import { getToken } from '../../Context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import WorkspaceScreenMembersModal from './WorkspaceScreenMembersModal';
import TaskRectangle from './TaskRectangle';
import { useLanguage } from '../../Context/LanguageContext';
import './WorkspaceScreen.css';

const WorkspaceScreen = () => {
    const { t } = useLanguage();
    const { workspace_id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [workspace, setWorkspace] = useState(null);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI States
    const [showMenu, setShowMenu] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    
    // Edit States
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    
    const menuRef = useRef(null);
    const token = getToken();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchWorkspaceData = async () => {
        setLoading(true);
        try {
            // Fetch Workspace Details
            const resDetails = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resDetails.ok) {
                const data = await resDetails.json();
                setWorkspace(data.data.workspace);
                
                // Sort members: OWNER > ADMIN > normal
                const sortedMembers = (data.data.members || []).sort((a, b) => {
                    const rank = { owner: 1, admin: 2, user: 3 };
                    return (rank[a.member_role?.toLowerCase()] || 3) - (rank[b.member_role?.toLowerCase()] || 3);
                });
                setMembers(sortedMembers);
                setEditTitle(data.data.workspace.title);
                setEditDesc(data.data.workspace.description || '');
            }

            // Fetch Tasks
            const resTasks = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resTasks.ok) {
                const taskData = await resTasks.json();
                setTasks(taskData.data.tasks || []);
            }
            
        } catch (error) {
            console.error("Error fetching workspace details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspace_id) fetchWorkspaceData();
    }, [workspace_id]);

    const activeUserMember = members.find(m => m.user_id === user?.id);
    const activeRole = activeUserMember?.member_role?.toLowerCase() || 'user';
    const isPrivileged = activeRole === 'owner' || activeRole === 'admin';

    const handleUpdateHeader = async () => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: editTitle, description: editDesc })
            });

            if (res.ok) {
                setWorkspace({ ...workspace, title: editTitle, description: editDesc });
                setIsEditingHeader(false);
            } else {
                alert('Failed to update workspace');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskCreate = async () => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: t('workspace_screen.new_assignment'), subtasks: [] })
            });
            if (res.ok) {
                const data = await res.json();
                setTasks([data.data.task, ...tasks]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task/${updatedTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedTask)
            });
            if (res.ok) {
                setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTasks(tasks.filter(t => t._id !== taskId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLeaveWorkspace = async () => {
        if (!confirm('Are you sure you want to leave this workspace?')) return;
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/member/${activeUserMember.member_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                navigate('/');
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="workspace-loading">{t('loading_states.initializing')}</div>;
    if (!workspace) return <div className="workspace-loading" style={{ color: 'var(--error-color)' }}>{t('workspace_screen.not_found')}</div>;

    const visibleAvatars = members.slice(0, 3);

    return (
        <div className="workspace-container">
            <div className="background-cubes">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`cube-wrapper cube-${i + 1}`}>
                        <div className="cube"><div className="face front"></div><div className="face back"></div><div className="face left"></div><div className="face right"></div><div className="face top"></div><div className="face bottom"></div></div>
                    </div>
                ))}
            </div>

            <div className="workspace-header" style={{ position: 'relative' }}>
                <div className="header-avatars">
                    <div className="avatar-stack-container">
                        {visibleAvatars.map((m, i) => (
                            <div key={i} className="avatar-stack-item" title={m.user_name}>
                                {m.profile_picture ? <img src={m.profile_picture} alt="avatar"/> : <User size={16} color="var(--text-muted)"/>}
                            </div>
                        ))}
                    </div>
                    {members.length > 3 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>+{members.length - 3}</span>}
                </div>

                <div className="workspace-header-actions" ref={menuRef}>
                    <button className="action-btn" onClick={() => setShowMenu(!showMenu)}>
                        <MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="item-context-menu">
                            <button className="menu-item" onClick={() => { setShowMenu(false); setShowMembersModal(true); }}>
                                <Users size={16} /> {t('sidebar.view_all_members')}
                            </button>
                            <button className="menu-item" onClick={() => setShowMenu(false)}>
                                <VolumeX size={16} /> {t('sidebar.mute_notifications')}
                            </button>
                            <button className="menu-item" onClick={() => setShowMenu(false)}>
                                <CheckSquare size={16} /> {t('sidebar.mark_as_read')}
                            </button>
                            {activeRole !== 'owner' && (
                                <>
                                    <div className="menu-divider" />
                                    <button className="menu-item logout" onClick={handleLeaveWorkspace}>
                                        <LogOut size={16} /> {t('sidebar.leave_workspace')}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isEditingHeader ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '70%' }}>
                        <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="task-input-title" style={{ fontSize: '1.25rem' }} />
                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="task-input-desc" rows={2} />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={handleUpdateHeader} className="btn-save" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Save size={14}/> {t('workspace_screen.save')}
                            </button>
                            <button onClick={() => setIsEditingHeader(false)} className="btn-secondary" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem' }}>
                                {t('workspace_screen.cancel')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div>
                            <h2>{workspace.title}</h2>
                            {workspace.description && <p className="workspace-description" style={{ marginTop: '0.5rem' }}>{workspace.description}</p>}
                        </div>
                        {isPrivileged && (
                            <button onClick={() => setIsEditingHeader(true)} className="edit-task-btn" style={{ padding: '0.2rem' }}>
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="workspace-content" style={{ zIndex: 5, position: 'relative' }}>
                <div className="assignments-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'Orbitron', color: 'var(--primary-color)' }}>{t('workspace_screen.assignments')}</h3>
                        {isPrivileged && (
                            <button onClick={handleTaskCreate} className="icon-btn primary" title="Add Assignment Block">
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                    
                    <div className="assignments-grid">
                        {tasks.map(task => (
                            <TaskRectangle 
                                key={task._id} 
                                task={task} 
                                isPrivileged={isPrivileged} 
                                onUpdate={handleTaskUpdate}
                                onDelete={handleTaskDelete}
                            />
                        ))}
                    </div>
                    
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            {t('workspace_screen.no_assignments')}
                        </div>
                    )}
                </div>
            </div>

            {showMembersModal && (
                <WorkspaceScreenMembersModal members={members} onClose={() => setShowMembersModal(false)} />
            )}
        </div>
    );
};

export default WorkspaceScreen;
