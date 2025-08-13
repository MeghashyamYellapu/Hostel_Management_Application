// src/components/Home.jsx
import React, { useState } from 'react';
import '../styles.css';
import { Link } from 'react-router-dom';

function Home({ navigate }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <div className="screen active">
      <div className="header">
        <div className="logo">Hostel Management</div>
        <div className="user-info">
          <Link to="/login" className="btn btn-secondary">Login</Link>
      <Link to="/register" className="btn btn-secondary">Register</Link>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" onClick={toggleProfileMenu}>
              Profile ▾
            </button>
            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  zIndex: 100,
                }}
              >
                <div
                  onClick={() => navigate('student-dashboard')}
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  Dashboard
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="content" style={{ minHeight: '400px', textAlign: 'center' }}>
        <h2>Welcome to the Hostel Management System</h2>
        <p style={{ marginTop: '10px' }}>
          Use the navigation above to log in, register, or visit your dashboard.
        </p>
      </div>
    </div>
  );
}

export default Home;
