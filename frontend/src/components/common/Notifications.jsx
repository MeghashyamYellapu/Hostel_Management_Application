import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

function Notifications() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notifications-container">
      <button className="notifications-toggle" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="notifications-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n._id}
                className={`notification-item ${!n.channels.inApp.read ? 'unread' : ''}`}
                onClick={() => markAsRead(n._id)}
              >
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No new notifications.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;