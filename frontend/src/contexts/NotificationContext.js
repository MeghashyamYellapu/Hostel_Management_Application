import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: user.id }
      });
      setSocket(newSocket);

      // Fetch existing notifications
      const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.channels.inApp.read).length);
        }
      };
      fetchNotifications();
      
      // Listen for new notifications via WebSocket
      newSocket.on('new-notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        alert(`New Notification: ${notification.title}`); // Simple in-app alert
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications((prev) => 
        prev.map(n => n._id === id ? { ...n, channels: { ...n.channels, inApp: { ...n.channels.inApp, read: true } } } : n)
      );
      setUnreadCount((prev) => prev > 0 ? prev - 1 : 0);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const value = { notifications, unreadCount, markAsRead };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};