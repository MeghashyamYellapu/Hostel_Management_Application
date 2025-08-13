import React from 'react';
import '../styles.css';

function Login({ navigate }) {
  return (
    <div className="screen active" id="login">
      <div className="header">
        <div className="logo">🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to Your Account</h2>
        <form style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-group">
            <label>Login As</label>
            <select>
              <option>Student</option>
              <option>HOD</option>
              <option>Warden</option>
              <option>Security</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={() => navigate('student-dashboard')}>Login</button>
          <div style={{ textAlign: 'center' }}>
            <span onClick={() => navigate('register')} style={{ color: '#4facfe', cursor: 'pointer' }}>Don't have an account? Register here</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
