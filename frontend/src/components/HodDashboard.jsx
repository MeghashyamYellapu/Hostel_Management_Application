// src/components/HodDashboard.jsx
import React from 'react';
import '../styles.css';

function HodDashboard() {
  return (
    <div className="screen active" id="hod-dashboard">
      <div className="header">
        <div className="logo">🏠 HOD Portal</div>
        <div className="user-info">
          <span>Dr. Smith (CS Dept)</span>
          <div className="avatar">DS</div>
        </div>
      </div>
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">45</div>
            <div className="stat-label">Approved This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="nav-tabs">
          <div className="nav-tab active">Pending Requests</div>
          <div className="nav-tab">Approved</div>
          <div className="nav-tab">Rejected</div>
        </div>

        <div className="request-card">
          <div className="request-header">
            <div className="request-title">John Doe - Weekend Home Visit</div>
            <span className="status-badge status-pending">Pending</span>
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
              <div className="detail-label">Reason</div>
              <div className="detail-value">Family function at home</div>
            </div>
          </div>
          <div className="approval-actions">
            <button className="btn btn-success">Approve</button>
            <button className="btn btn-danger">Reject</button>
            <button className="btn btn-secondary">View Details</button>
          </div>
          <div className="comment-section">
            <label>Comments (Optional)</label>
            <textarea rows="2" placeholder="Add comments for this request"></textarea>
          </div>
        </div>

        <div className="request-card">
          <div className="request-header">
            <div className="request-title">Sarah Wilson - Medical Appointment</div>
            <span className="status-badge status-pending">Pending</span>
          </div>
          <div className="request-details">
            <div className="detail-item">
              <div className="detail-label">Student</div>
              <div className="detail-value">Sarah Wilson (CS, 2nd Year)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Leave Type</div>
              <div className="detail-value">Day Pass</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Time</div>
              <div className="detail-value">Aug 2, 2025 (9:00 AM - 12:00 PM)</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Reason</div>
              <div className="detail-value">Dental appointment</div>
            </div>
          </div>
          <div className="approval-actions">
            <button className="btn btn-success">Approve</button>
            <button className="btn btn-danger">Reject</button>
            <button className="btn btn-secondary">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodDashboard;
