// src/components/Register.jsx
import React from 'react';
import '../styles.css';

function Register({ navigate }) {
  return (
    <div className="screen active" id="register">
      <div className="header">
        <div className="logo">🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Student Registration</h2>
        <form style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter phone number" />
            </div>
            <div className="form-group">
              <label>Branch/Department</label>
              <select>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Electrical</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>PIN Number</label>
              <input type="text" placeholder="Student PIN" />
            </div>
            <div className="form-group">
              <label>Year</label>
              <select>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create password" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" />
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={() => navigate('login')}>Register</button>
          <div style={{ textAlign: 'center' }}>
            <span onClick={() => navigate('login')} style={{ color: '#4facfe', cursor: 'pointer' }}>Already have an account? Login here</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
