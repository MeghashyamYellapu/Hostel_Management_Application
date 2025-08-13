// src/components/SecurityDashboard.jsx
import React from 'react';
import '../styles.css';

function SecurityDashboard() {
  return (
    <div className="screen active" id="security-dashboard">
      <div className="header">
        <div className="logo">🏠 Security Portal</div>
        <div className="user-info">
          <span>Guard Station</span>
          <div className="avatar">🛡️</div>
        </div>
      </div>
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Warden Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15</div>
            <div className="stat-label">Active Gate Passes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">28</div>
            <div className="stat-label">Issued Today</div>
          </div>
        </div>

        <div className="nav-tabs">
          <div className="nav-tab active">Final Approval</div>
          <div className="nav-tab">Active Passes</div>
          <div className="nav-tab">History</div>
        </div>

        <div className="request-card">
          <div className="request-header">
            <div className="request-title">John Doe - Medical Appointment</div>
            <span className="status-badge status-approved">Warden Approved</span>
          </div>
          <div className="request-details">
            <div className="detail-item">
              <div className="detail-label">Student</div>
              <div className="detail-value">John Doe (CS, 3rd Year)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Leave Type</div>
              <div className="detail-value">Day Pass</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Time</div>
              <div className="detail-value">Aug 1, 2025 (10:00 AM - 2:00 PM)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-value">Security Approved</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-success">View Gate Pass</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityDashboard;
