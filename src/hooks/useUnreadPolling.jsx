import { useEffect, useRef } from 'react';
import ENVIRONMENT from '../config/environment';
import { getToken } from '../Context/AuthContext';
import { useNotifications } from '../Context/NotificationContext';
import { getLastRead } from '../Context/NotificationContext';

/**
 * Polls DMs for all friends every POLL_INTERVAL ms.
 * If the latest message in a conversation is:
 *   - newer than the stored last-read timestamp, AND
 *   - was sent by the friend (not the current user),
 * then it increments the unread count in NotificationContext.
 *
 * @param {string}   userId   - current logged-in user's id
 * @param {Array}    friends  - user.friends array
 * @param {string|null} activeFriendId - friend_id currently open in DM screen (skip polling for that one)
 */
const POLL_INTERVAL = 5000;

const useUnreadPolling = (userId, friends, activeFriendId = null) => {
    const { setUnread, markAsRead } = useNotifications();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!userId || !friends || friends.length === 0) return;

        const poll = async () => {
            const token = getToken();
            if (!token) return;

            for (const friend of friends) {
                const fid = friend._id;

                // If the user is actively viewing this conversation, just keep it marked as read
                if (fid === activeFriendId) {
                    markAsRead(fid);
                    continue;
                }

                try {
                    const response = await fetch(
                        `${ENVIRONMENT.API_URL}/api/dm/${fid}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (!response.ok) continue;

                    const data = await response.json();
                    const messages = data?.data?.messages;
                    if (!messages || messages.length === 0) continue;

                    // Find all messages sent by this friend (not by us) that are newer than last-read
                    const lastRead = getLastRead(fid);
                    const unread = messages.filter(
                        msg =>
                            msg.from !== userId &&
                            msg.from === fid &&
                            new Date(msg.created_at).getTime() > lastRead
                    );

                    setUnread(fid, unread.length);
                } catch {
                    // Silently ignore network errors during background poll
                }
            }
        };

        // Run once immediately, then on interval
        poll();
        intervalRef.current = setInterval(poll, POLL_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [userId, friends, activeFriendId]);
};

export default useUnreadPolling;
