import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { User, MoreVertical, LogOut, Users, VolumeX, CheckSquare, Edit3, Plus, Save, X, UserPlus, MessageSquare, ClipboardList, Send, Paperclip, File, Download } from 'lucide-react';
import { getToken } from '../../Context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import WorkspaceScreenMembersModal from './WorkspaceScreenMembersModal';
import TaskRectangle from './TaskRectangle';
import InviteWorkspaceModal from '../../Components/MainLayout/InviteWorkspaceModal';
import { useLanguage } from '../../Context/LanguageContext';
import './WorkspaceScreen.css';
import '../DirectMessageScreen/DirectMessageScreen.css';

const WorkspaceScreen = () => {
    const { t } = useLanguage();
    const { workspace_id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [workspace, setWorkspace] = useState(null);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // tab state — 'chat' | 'assignments'
    const [activeTab, setActiveTab] = useState('chat');

    //chat state
    const [channel, setChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevMessagesLength = useRef(0);

    //UI
    const [showMenu, setShowMenu] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [inviteWorkspaceId, setInviteWorkspaceId] = useState(null);

    //edit states
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const menuRef = useRef(null);
    const token = getToken();

    //close  menu on outside cclick
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    //auto-scroll chat 
    useEffect(() => {
        const container = messagesAreaRef.current;
        if (!container) return;
        if (messages.length > prevMessagesLength.current) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            const lastMine = messages.length > 0 && messages[messages.length - 1].member?.user_id === user?.id;
            if (isNearBottom || lastMine) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages, user?.id]);

    //fetch workspace data
    const fetchWorkspaceData = async () => {
        setLoading(true);
        try {
            const resDetails = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resDetails.ok) {
                const data = await resDetails.json();
                setWorkspace(data.data.workspace);
                const sortedMembers = (data.data.members || []).sort((a, b) => {
                    const rank = { owner: 1, admin: 2, user: 3 };
                    return (rank[a.member_role?.toLowerCase()] || 3) - (rank[b.member_role?.toLowerCase()] || 3);
                });
                setMembers(sortedMembers);
                setEditTitle(data.data.workspace.title);
                setEditDesc(data.data.workspace.description || '');
            }

            const resTasks = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resTasks.ok) {
                const taskData = await resTasks.json();
                setTasks(taskData.data.tasks || []);
            }

            // fetch channels and pick the first (general)
            const resCh = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channel`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resCh.ok) {
                const chData = await resCh.json();
                let firstChannel = (chData.data.channels || [])[0];

                // If no channel exists yet (workspace pre-dates auto-create), create one
                if (!firstChannel) {
                    const resCreate = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channel`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ title: 'general', description: 'Workspace group chat' })
                    });
                    if (resCreate.ok) {
                        const createData = await resCreate.json();
                        firstChannel = createData.data.channel;
                    }
                }

                setChannel(firstChannel || null);
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

    // fetch messages (polling)
    const fetchMessages = async () => {
        if (!channel?._id) return;
        try {
            const res = await fetch(
                `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channel/${channel._id}/message`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (res.ok) {
                const data = await res.json();
                setMessages(data.data.messages || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!channel?._id) return;
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [channel?._id]);

    // Computed 
    const activeUserMember = members.find(m => m.user_id === user?.id);
    const activeRole = activeUserMember?.member_role?.toLowerCase() || 'user';
    const isPrivileged = activeRole === 'owner' || activeRole === 'admin';
    const visibleAvatars = members.slice(0, 3);


    const handleUpdateHeader = async () => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: editTitle, description: editDesc })
            });
            if (res.ok) {
                setWorkspace({ ...workspace, title: editTitle, description: editDesc });
                setIsEditingHeader(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskCreate = async () => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: t('workspace_screen.new_assignment'), subtasks: [] })
            });
            if (res.ok) {
                const data = await res.json();
                setTasks([data.data.task, ...tasks]);
            }
        } catch (err) { console.error(err); }
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task/${updatedTask._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedTask)
            });
            if (res.ok) {
                setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
            }
        } catch (err) { console.error(err); }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/task/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTasks(tasks.filter(t => t._id !== taskId));
        } catch (err) { console.error(err); }
    };

    const handleLeaveWorkspace = async () => {
        if (!confirm('Are you sure you want to leave this workspace?')) return;
        try {
            const res = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/member/${activeUserMember.member_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) navigate('/');
        } catch (e) { console.error(e); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachment({ filename: file.name, fileType: file.type, data: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachment) return;
        if (!channel?._id) return;

        setIsSending(true);
        const payload = { content: newMessage.trim(), attachment };
        setNewMessage('');
        setAttachment(null);

        try {
            const res = await fetch(
                `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channel/${channel._id}/message`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                }
            );
            if (res.ok) fetchMessages();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    if (loading) return <div className="workspace-loading">{t('loading_states.initializing')}</div>;
    if (!workspace) return <div className="workspace-loading" style={{ color: 'var(--error-color)' }}>{t('workspace_screen.not_found')}</div>;

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
                                {m.user_profile_picture
                                    ? <img src={m.user_profile_picture} alt={m.user_name} />
                                    : <User size={16} color="var(--text-muted)" />
                                }
                            </div>
                        ))}
                    </div>
                    {members.length > 3 && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'var(--bg-surface)', border: '2px solid var(--border-color)',
                            color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                        }}>+{members.length - 3}</span>
                    )}
                </div>

                <div className="workspace-header-actions" ref={menuRef}>
                    {isPrivileged && (
                        <button
                            className="action-btn"
                            onClick={() => setInviteWorkspaceId(workspace_id)}
                            title="Add Member"
                            style={{ color: 'var(--primary-color)' }}
                        >
                            <UserPlus size={20} />
                        </button>
                    )}
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
                                <Save size={14} /> {t('workspace_screen.save')}
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


                <div className="workspace-tab-bar">
                    <button
                        className={`workspace-tab ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        <MessageSquare size={15} />
                        Chat
                    </button>
                    <button
                        className={`workspace-tab ${activeTab === 'assignments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        <ClipboardList size={15} />
                        {t('workspace_screen.assignments')}
                    </button>
                </div>
            </div>


            {activeTab === 'chat' && (
                <div className="workspace-chat-container">
                    {!channel ? (
                        <div className="workspace-chat-empty">
                            <MessageSquare size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                            <p>No chat channel found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="workspace-messages-area" ref={messagesAreaRef}>
                                {messages.length === 0 ? (
                                    <div className="dm-empty-state">
                                        <p>No messages yet. Say something!</p>
                                    </div>
                                ) : (
                                    messages.map(msg => {
                                        const isMine = msg.member?.user_id === user?.id;
                                        return (
                                            <div key={msg.message_id} className={`dm-message ${isMine ? 'mine' : 'theirs'}`}>
                                                {!isMine && (
                                                    <div className="ws-msg-avatar" title={msg.member?.user_name}>
                                                        {msg.member?.user_profile_picture
                                                            ? <img src={msg.member.user_profile_picture} alt={msg.member.user_name} />
                                                            : <User size={14} />
                                                        }
                                                    </div>
                                                )}
                                                <div className="dm-message-bubble">
                                                    {!isMine && (
                                                        <span className="ws-msg-sender">{msg.member?.user_name}</span>
                                                    )}
                                                    {msg.attachment && (
                                                        <div className="dm-attachment">
                                                            {msg.attachment.fileType?.startsWith('image/') ? (
                                                                <img
                                                                    src={msg.attachment.data}
                                                                    alt={msg.attachment.filename}
                                                                    className="dm-image-attachment"
                                                                    onClick={() => window.open(msg.attachment.data, '_blank')}
                                                                />
                                                            ) : (
                                                                <div className="dm-file-attachment">
                                                                    <File size={24} />
                                                                    <div className="file-info">
                                                                        <span>{msg.attachment.filename}</span>
                                                                        <a href={msg.attachment.data} download={msg.attachment.filename} className="download-btn">
                                                                            <Download size={16} />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {msg.content && <p>{msg.content}</p>}
                                                    <span className="dm-time">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="dm-input-area" onSubmit={handleSendMessage}>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

                                {attachment && (
                                    <div className="file-preview-container">
                                        <div className="file-preview">
                                            <span>📎 {attachment.filename}</span>
                                            <button type="button" onClick={() => setAttachment(null)}>×</button>
                                        </div>
                                    </div>
                                )}

                                <div className="input-main-row">
                                    <button type="button" className="attachment-btn" onClick={() => fileInputRef.current.click()} disabled={isSending}>
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder={`Message #${channel?.title || 'general'}...`}
                                        disabled={isSending}
                                    />
                                    <button type="submit" className="send-btn" disabled={isSending || (!newMessage.trim() && !attachment)}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}


            {activeTab === 'assignments' && (
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
            )}

            {showMembersModal && (
                <WorkspaceScreenMembersModal members={members} onClose={() => setShowMembersModal(false)} />
            )}

            {inviteWorkspaceId && (
                <InviteWorkspaceModal
                    workspace_id={inviteWorkspaceId}
                    activeRole={activeRole}
                    onClose={() => setInviteWorkspaceId(null)}
                    onSuccess={fetchWorkspaceData}
                />
            )}
        </div>
    );
};

export default WorkspaceScreen;
