import React, { useState, useEffect } from 'react';
import Header from './common/Header';
import '../styles.css';
import { admissionData } from '../data/admissionData'; // Import the admission data

const API_BASE = process.env.REACT_APP_API_BASE;

function HodDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approvedThisMonth: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/hod/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
          setStats(prev => ({ ...prev, pending: data.length }));
        }
      } catch (err) {
        console.error('Error fetching HOD requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprovalAction = async (requestId, status) => {
    const comments = prompt(`Enter comments for ${status}:`);
    if (comments === null) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/hod/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, comments })
      });
      if (res.ok) {
        setRequests(requests.filter(req => req._id !== requestId));
        alert(`Request ${status} successfully.`);
      } else {
        const data = await res.json();
        alert(`Failed to update request: ${data.message}`);
      }
    } catch (err) {
      alert('Server error. Failed to update request.');
    }
  };

  const getOfficialPhotoUrl = (pin) => {
    const admissionNumber = admissionData[pin]?.admissionNumber;
    if (admissionNumber) {
        return `https://media.campx.in/cec/student-photos/${admissionNumber}.jpg`;
    }
    return ''; // Return an empty string if admission number is not found
  };
  
  const getOfficialPhotoName = (pin) => {
    return admissionData[pin]?.name || 'N/A';
  };
  
  const getOfficialPhotoBranch = (pin) => {
    return admissionData[pin]?.branch || 'N/A';
  };

  if (loading) {
    return <div className="screen active" id="hod-dashboard">Loading...</div>;
  }

  return (
    <div className="screen active" id="hod-dashboard">
      <Header title="HOD Portal" />
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.approvedThisMonth}</div>
            <div className="stat-label">Approved This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        <div className="nav-tabs">
          <div className="nav-tab active">Pending Requests</div>
          <div className="nav-tab">Approved</div>
          <div className="nav-tab">Rejected</div>
        </div>
        {requests.length > 0 ? (
          requests.map(request => (
            <div className="request-card" key={request._id}>
              <div className="request-header">
                <div className="request-title">{request.student.fullName} - {request.reason}</div>
                <span className="status-badge status-pending">Pending</span>
              </div>
              <div className="profile-container" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                <div className="profile-pic-wrapper">
                    <div style={{ textAlign: 'center' }}>
                        <div className="profile-pic-wrapper" style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
                            {request.student?.photo?.secure_url ? (
                                <img src={request.student.photo.secure_url} alt="Uploaded Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100px', height: '100px', backgroundColor: '#ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Photo</div>
                            )}
                        </div>
                        <small>User Uploaded</small>
                    </div>
                </div>
                <div className="profile-pic-wrapper">
                    <div style={{ textAlign: 'center' }}>
                        <div className="profile-pic-wrapper" style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
                            <img src={getOfficialPhotoUrl(request.student.pin)} alt="Official Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <small>{getOfficialPhotoName(request.student.pin)}</small>
                        <br/>
                        <small>{getOfficialPhotoBranch(request.student.pin)}</small>
                    </div>
                </div>
              </div>
              <div className="request-details">
                <div className="detail-item">
                  <div className="detail-label">Student</div>
                  <div className="detail-value">{request.student.fullName} ({request.student.branch}, {request.student.year})</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Leave Type</div>
                  <div className="detail-value">{request.leaveType}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Reason</div>
                  <div className="detail-value">{request.reason}</div>
                </div>
              </div>
              <div className="approval-actions">
                <button className="btn btn-success" onClick={() => handleApprovalAction(request._id, 'approved')}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleApprovalAction(request._id, 'rejected')}>Reject</button>
                <button className="btn btn-secondary">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>No pending requests for your department.</p>
        )}
      </div>
    </div>
  );
}

export default HodDashboard;