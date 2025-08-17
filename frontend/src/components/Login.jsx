import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'student') {
          navigate('/student-dashboard');
        } else if (data.user.role === 'hod') {
          navigate('/hod-dashboard');
        }
        else if (data.user.role === 'warden') {
          navigate('/warden-dashboard');
        } else if (data.user.role === 'security') {
          navigate('/security-dashboard');
        } else if (data.user.role === 'Admin') { // Add this check for the 'Admin' role
          navigate('/admin-dashboard');
        } 
        // Add other role-based navigation here
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <div className="screen active" id="login">
      <div className="header">
        <div className="logo">🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to Your Account</h2>
        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
        <form style={{ maxWidth: '400px', margin: '0 auto' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} placeholder="Enter your password" required />
          </div>
          <div className="form-group">
            <label>Login As</label>
            <select name="role" onChange={handleChange}>
              <option value="student">Student</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="security">Security</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
            Login
          </button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ color: '#4facfe', cursor: 'pointer', textDecoration: 'none' }}>
              Don't have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;