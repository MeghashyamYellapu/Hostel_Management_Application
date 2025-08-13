// src/components/StudentDashboard.jsx
import React from 'react';
import '../styles.css';

function StudentDashboard({ navigate }) {
  return (
    <div className="screen active" id="student-dashboard">
      <div className="header">
        <div className="logo">🏠 Student Portal</div>
        <div className="user-info">
          <span>Welcome, John Doe</span>
          <div className="avatar">JD</div>
        </div>
      </div>
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>My Leave Requests</h3>
          <button className="btn btn-primary" onClick={() => navigate('new-request')}>New Request</button>
        </div>

        {/* Example request card */}
        <div className="request-card">
          <div className="request-header">
            <div className="request-title">Day Pass - Medical Appointment</div>
            <span className="status-badge status-approved">Approved</span>
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
              <div className="detail-label">Warden Comments</div>
              <div className="detail-value">"Medical emergency, urgent approval."</div>
            </div>
          </div>
          <div className="approval-actions">
            <button className="btn btn-success" onClick={() => navigate('gate-pass')}>Generate Gate Pass</button>
            <button className="btn btn-danger">Reject</button>
            <button className="btn btn-secondary">View Details</button>
          </div>
        </div>

        {/* Additional card (example) */}
        <div className="request-card">
          <div className="request-header">
            <div className="request-title">Active Gate Pass - Sarah Wilson</div>
            <span className="status-badge status-approved">Active</span>
          </div>
          <div className="request-details">
            <div className="detail-item">
              <div className="detail-label">Student</div>
              <div className="detail-value">Sarah Wilson (CS, 2nd Year)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Pass ID</div>
              <div className="detail-value">GP-2025-001234</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Valid Until</div>
              <div className="detail-value">Aug 1, 2025 - 6:00 PM</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-value">Out of Campus</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-warning">Mark as Returned</button>
            <button className="btn btn-secondary">View Pass</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
