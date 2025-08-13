// src/components/WardenDashboard.jsx
import React from 'react';
import '../styles.css';

function WardenDashboard() {
  return (
    <div className="screen active" id="warden-dashboard">
      <div className="header">
        <div className="logo">🏠 Warden Portal</div>
        <div className="user-info">
          <span>Mr. Johnson (Hostel Warden)</span>
          <div className="avatar">MJ</div>
        </div>
      </div>
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Pending from HOD</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">32</div>
            <div className="stat-label">Approved This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="nav-tabs">
          <div className="nav-tab active">HOD Approved</div>
          <div className="nav-tab">My Approved</div>
          <div className="nav-tab">Rejected</div>
        </div>

        <div className="request-card">
          <div className="request-header">
            <div className="request-title">John Doe - Weekend Home Visit</div>
            <span className="status-badge status-approved">HOD Approved</span>
          </div>
          <div className="request-details">
            <div className="detail-item">
              <div className="detail-label">Student</div>
              <div className="detail-value">John Doe (CS, 3rd Year)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Leave Type</div>
              <div className="detail-value">Overnight Leave</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Duration</div>
              <div className="detail-value">Aug 5-6, 2025</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">HOD Comments</div>
              <div className="detail-value">"Good academic standing, approved."</div>
            </div>
          </div>
          <div className="approval-actions">
            <button className="btn btn-success">Approve & Forward</button>
            <button className="btn btn-danger">Reject</button>
            <button className="btn btn-secondary">View Details</button>
          </div>
          <div className="comment-section">
            <label>Warden Comments</label>
            <textarea rows="2" placeholder="Add your comments"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WardenDashboard;
