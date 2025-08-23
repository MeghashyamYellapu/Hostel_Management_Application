import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './Notifications'; // New component
import '../../styles.css';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Add missing function definitions
  const getUserDashboardRoute = (role) => {
    switch(role) {
      case 'student': return '/student-dashboard';
      case 'hod': return '/hod-dashboard';
      case 'warden': return '/warden-dashboard';
      case 'security': return '/security-dashboard';
      case 'Admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="header">
      <div className="logo">🏠 {title}</div>
      <div className="user-info" style={{ position: 'relative' }}>
        {user && user.role !== 'student' && <Notifications />}
        <span onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          {user ? `Welcome, ${user.fullName}` : 'Guest'}
        </span>
        <div 
          className="avatar" 
          onClick={() => setShowProfileMenu(!showProfileMenu)} 
          style={{ cursor: 'pointer' }}
        >
          {user?.photo?.secure_url ? (
            <img 
              src={user.photo.secure_url} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            user?.fullName?.split(' ').map(n => n[0]).join('') || '?'
          )}
        </div>
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '10px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              minWidth: '150px'
            }}
          >
            {user && (
              <>
                <Link
                  to={getUserDashboardRoute(user.role)}
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    textDecoration: 'none',
                    color: 'black'
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/Profile"
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    textDecoration: 'none',
                    color: 'black'
                  }}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" style={{ padding: '10px 20px', textDecoration: 'none', color: 'black' }}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;