import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext({
    unreadCounts: {},
    markAsRead: () => {},
    setUnread: () => {},
});

const LAST_READ_PREFIX = 'dm_last_read_';

export const getLastRead = (friend_id) => {
    const val = localStorage.getItem(`${LAST_READ_PREFIX}${friend_id}`);
    return val ? Number(val) : 0;
};

export const persistLastRead = (friend_id, timestamp) => {
    localStorage.setItem(`${LAST_READ_PREFIX}${friend_id}`, String(timestamp));
};

export function NotificationProvider({ children }) {
    const [unreadCounts, setUnreadCounts] = useState({});

    const markAsRead = useCallback((friend_id) => {
        persistLastRead(friend_id, Date.now());
        setUnreadCounts(prev => {
            if (!prev[friend_id]) return prev;
            const next = { ...prev };
            delete next[friend_id];
            return next;
        });
    }, []);

    const setUnread = useCallback((friend_id, count) => {
        setUnreadCounts(prev => {
            if (prev[friend_id] === count) return prev;
            return { ...prev, [friend_id]: count };
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ unreadCounts, markAsRead, setUnread }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);

export default NotificationProvider;
