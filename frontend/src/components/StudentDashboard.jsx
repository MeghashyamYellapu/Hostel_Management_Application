import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './common/Header';
import '../styles.css';

const API_BASE = process.env.REACT_APP_API_BASE;

function StudentDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/student/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
          const total = data.length;
          const approved = data.filter(req => req.status.includes('approved')).length;
          const pending = data.filter(req => req.status.includes('pending')).length;
          const rejected = data.filter(req => req.status.includes('rejected')).length;
          setStats({ total, approved, pending, rejected });
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleGeneratePass = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/student/generate-pass/${requestId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate(`/gate-pass/${data.gatePass._id}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error. Failed to generate gate pass.");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/student/requests/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== requestId));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          approved: prev.approved - (data.status && data.status.includes('approved') ? 1 : 0),
          pending: prev.pending - (data.status && data.status.includes('pending') ? 1 : 0),
          rejected: prev.rejected - (data.status && data.status.includes('rejected') ? 1 : 0)
        }));
        alert('Request deleted successfully.');
      } else {
        alert(data.message || 'Failed to delete request.');
      }
    } catch (err) {
      alert('Server error. Failed to delete request.');
    }
  };

  if (loading) {
    return <div className="screen active" id="student-dashboard">Loading...</div>;
  }

  const getStatusBadge = (status) => {
    if (status.includes('approved')) return 'status-approved';
    if (status.includes('pending')) return 'status-pending';
    if (status.includes('rejected')) return 'status-rejected';
    if (status.includes('gate_pass_generated')) return 'status-approved';
    return '';
  };

  return (
    <div className="screen active" id="student-dashboard">
      <Header title="Student Portal" />
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>My Leave Requests</h3>
          <Link to="/new-request" className="btn btn-primary" style={{ textAlign: 'center' }}>
            New Request
          </Link>
        </div>
        {requests.length > 0 ? (
          requests.map(request => (
            <div className="request-card" key={request._id}>
              <div className="request-header">
                <div className="request-title">{request.leaveType} - {request.reason}</div>
                <span className={`status-badge ${getStatusBadge(request.status)}`}>{request.status.replace('_', ' ')}</span>
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
                    {request.leaveType === 'day-pass' && ` (${request.startTime} - ${request.endTime})`}
                  </div>
                </div>
              </div>
              <div className="approval-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {request.status === 'warden_approved' && (
                  <button onClick={() => handleGeneratePass(request._id)} className="btn btn-success" style={{ textAlign: 'center' }}>
                    Generate Gate Pass
                  </button>
                )}
                {request.status === 'gate_pass_generated' && (
                   <Link to={`/gate-pass/${request._id}`} className="btn btn-success" style={{ textAlign: 'center' }}>
                    View Gate Pass
                  </Link>
                )}
                <button className="btn btn-secondary">View Details</button>
                <button className="btn btn-danger" onClick={() => handleDeleteRequest(request._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#ccc' }}>No leave requests found.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;