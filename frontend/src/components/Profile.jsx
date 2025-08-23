// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');

  // ✅ Load profile from backend/localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setRole(storedUser.role);

      // fetch user details from backend
      const fetchProfile = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/${storedUser.role}/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUserData({ ...userData, ...data });
          } else {
            setMessage(`❌ ${data.error}`);
          }
        } catch (err) {
          setMessage('❌ Failed to fetch profile.');
        }
      };
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (userData.password && userData.password !== userData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/${role}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Profile updated successfully!');
        setUserData({ ...userData, currentPassword: '', password: '', confirmPassword: '' });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <div className="screen active" id="profile">
      <div className="header" style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{ cursor: 'pointer', fontSize: '1.8em', marginRight: '15px' }}
          onClick={() => {
            if (role === 'student') navigate('/student-dashboard');
            else if (role === 'hod') navigate('/hod-dashboard');
            else if (role === 'warden') navigate('/warden-dashboard');
            else if (role === 'security') navigate('/security-dashboard');
            else if (role === 'admin' || role === 'Admin') navigate('/admin-dashboard');
            else navigate('/');
          }}
          title="Go back"
        >
          &#8592;
        </span>
        <div className="logo">
          {role === 'student' && '👤 Student Profile'}
          {role === 'hod' && '👤 Hod Profile'}
          {role === 'warden' && '👤 Warden Profile'}
          {role === 'security' && '👤 Security Profile'}
          {!['student','hod','warden','security'].includes(role) && `👤 ${role?.toUpperCase()} Profile`}
        </div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Update Profile</h2>
        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}

        <form style={{ maxWidth: '500px', margin: '0 auto' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={userData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={userData.phone} onChange={handleChange} required />
          </div>

          {/* Role-specific fields */}
          {role === 'student' && (
            <>
              <div className="form-group">
                <label>Branch</label>
                <input type="text" name="branch" value={userData.branch} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="text" name="year" value={userData.year} onChange={handleChange} />
              </div>
            </>
          )}

          {/* Password change (common for all) */}
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={userData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;