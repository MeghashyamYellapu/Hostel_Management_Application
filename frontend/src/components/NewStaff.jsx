import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function NewStaff() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
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
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Staff account created successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          password: ''
        });
      } else {
        setMessage(`❌ ${data.message || 'Failed to create staff.'}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="screen active" id="new-staff">
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
        {/* Back Arrow */}
        <span
          style={{ cursor: 'pointer', fontSize: '1.8rem' }}
          title="Back to Admin Dashboard"
          onClick={() => navigate('/admin-dashboard')}
        >
          &#8592;
        </span>
        {/* Top Right: Add new staff name */}
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Add New Staff
        </div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Staff Account</h2>
        {message && <p style={{ textAlign: 'center', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
        <form style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="security">Security</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department (for HOD)</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={formData.role !== 'hod'}
              required={formData.role === 'hod'}
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">ECE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MECH">MECH</option>
              <option value="EEE">EEE</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewStaff;
