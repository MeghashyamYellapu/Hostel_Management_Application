import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setMessage(data.message || 'Failed to fetch users.');
        }
      } catch (err) {
        setMessage('Server error. Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      role: e.target.role.value,
      department: e.target.department.value,
      designation: e.target.designation.value,
      password: e.target.password.value,
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Staff account created successfully!');
        e.target.reset();
        // Re-fetch users to update the list
        window.location.reload(); 
      } else {
        const data = await res.json();
        alert(`Failed to create staff: ${data.message}`);
      }
    } catch (err) {
      alert('Server error. Failed to create staff.');
    }
  };

  const handleUpdateUser = async (userId, newRole, newStatus) => {
    if (!window.confirm(`Are you sure you want to update this user?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole, isActive: newStatus })
      });
      if (res.ok) {
        alert('User updated successfully!');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to update user: ${data.message}`);
      }
    } catch (err) {
      alert('Server error. Failed to update user.');
    }
  };

  if (loading) return <div className="screen active">Loading...</div>;

  return (
    <div className="screen active" id="admin-dashboard">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
        <div className="logo">🏠 Admin Portal</div>
        <div className="user-info" style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginLeft: 'auto' // This pushes the element to the right
        }}>
          <span>Super Admin</span>
          <div
            className="adminProfile"
            style={{ 
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px'
            }}
            onClick={() => setShowDropdown((prev) => !prev)}
            title="Menu"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: '22px' }}>
              <div style={{ height: '3px', background: 'currentColor', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'currentColor', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'currentColor', borderRadius: '2px' }}></div>
            </div>
          </div>
          {showDropdown && (
            <div style={{ 
              position: 'absolute',
              top: '40px',
              right: 0,
              background: 'var(--bg-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '6px',
              zIndex: 10,
              minWidth: '150px'
            }}>
              <div
                style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                onClick={() => { setShowDropdown(false); navigate('/profile'); }}
              >
                Profile
              </div>
              <div
                style={{ padding: '10px 20px', cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => {
                  setShowDropdown(false);
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management</h2>

        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '1.1em', borderRadius: '6px' }}
            onClick={() => navigate('/new-staff')}
          >
            + New Staff
          </button>
        </div>

        <h3>All Users</h3>
        <div className="user-list">
          {users.map(user => (
            <div key={user._id} className="user-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{user.fullName}</strong> ({user.role}) - {user.email}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={user.role} onChange={(e) => handleUpdateUser(user._id, e.target.value, user.isActive)}>
                  <option value="student">Student</option>
                  <option value="hod">HOD</option>
                  <option value="warden">Warden</option>
                  <option value="security">Security</option>
                  <option value="admin">Admin</option>
                </select>
                <button 
                  className={`btn ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => handleUpdateUser(user._id, user.role, !user.isActive)}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;