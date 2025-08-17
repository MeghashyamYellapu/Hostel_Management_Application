import React, { useState, useEffect } from 'react';
import '../styles.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      <div className="header">
        <div className="logo">🏠 Admin Portal</div>
        <div className="user-info">
          <span>Super Admin</span>
          <div className="avatar">👑</div>
        </div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management</h2>

        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}

        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Create New Staff Account</h3>
          <form onSubmit={handleCreateStaff} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" name="fullName" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="tel" name="phone" placeholder="Phone Number" required />
            <select name="role" required>
              <option value="">Select Role</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="security">Security</option>
            </select>
            <input type="text" name="department" placeholder="Department (for HOD)" />
            <input type="text" name="designation" placeholder="Designation" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Create Account</button>
          </form>
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