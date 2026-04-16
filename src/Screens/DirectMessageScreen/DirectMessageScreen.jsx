import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import ENVIRONMENT from '../../config/environment';
import { getToken } from '../../Context/AuthContext';
import { Send, Paperclip, File, Download } from 'lucide-react';
import './DirectMessageScreen.css';

const DirectMessageScreen = () => {
    const { friend_id } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [friend, setFriend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Keep scroll pinned to bottom when new messages load, but only if we were already near bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user || !user.friends) return;
        const matchingFriend = user.friends.find(f => f._id === friend_id);
        if (matchingFriend) {
            setFriend(matchingFriend);
        }
    }, [user, friend_id]);

    const fetchMessages = async () => {
        try {
            const token = getToken();
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/dm/${friend_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.data.messages);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Polling effect 1 second
    useEffect(() => {
        fetchMessages(); // initial fetch
        const interval = setInterval(fetchMessages, 1000);
        return () => clearInterval(interval);
    }, [friend_id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachment({
                filename: file.name,
                fileType: file.type,
                data: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !attachment) return;

        setIsSending(true);
        try {
            const token = getToken();
            const payload = {
                content: newMessage.trim(),
                attachment: attachment
            };

            setNewMessage('');
            setAttachment(null);

            const response = await fetch(`${ENVIRONMENT.API_URL}/api/dm/${friend_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchMessages();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    if (loading) {
        return <div className="dm-loading">Cargando chat...</div>;
    }
    return (
        <div className="dm-container">
            <div className="background-cubes">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`cube-wrapper cube-${i + 1}`}>
                        <div className="cube">
                            <div className="face front"></div>
                            <div className="face back"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face top"></div>
                            <div className="face bottom"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="dm-header">
                <div className="dm-header-info">
                    <h2>{friend ? friend.name : 'Unknown'}</h2>
                    <span className="dm-public-id">ID: {friend ? friend.public_id : '...'}</span>
                </div>
            </div>

            <div className="dm-messages-area">
                {messages.length === 0 ? (
                    <div className="dm-empty-state">
                        <p>No hay mensajes todavía. ¡Escribe algo para empezar!</p>
                    </div>
                ) : (
                    messages.map(msg => {
                        const isMine = msg.from === user.id;
                        return (
                            <div key={msg._id} className={`dm-message ${isMine ? 'mine' : 'theirs'}`}>
                                <div className="dm-message-bubble">
                                    {msg.attachment && (
                                        <div className="dm-attachment">
                                            {msg.attachment.fileType.startsWith('image/') ? (
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
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    className="attachment-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSending}
                >
                    <Paperclip size={20} />
                </button>
                <div className="input-with-preview">
                    {attachment && (
                        <div className="file-preview">
                            <span>📎 {attachment.filename}</span>
                            <button type="button" onClick={() => setAttachment(null)}>×</button>
                        </div>
                    )}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={`Enviar mensaje a ${friend ? friend.name : '...'}`}
                        autoFocus
                        disabled={isSending}
                    />
                </div>
                <button type="submit" disabled={isSending || (!newMessage.trim() && !attachment)}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default DirectMessageScreen;
