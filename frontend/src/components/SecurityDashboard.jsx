import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './common/Header';
import QRScanner from './QRScanner';
import '../styles.css';

function SecurityDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activePasses, setActivePasses] = useState([]);
  const [stats, setStats] = useState({ approved: 0, activePasses: 0, issuedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Final Approval');
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/security/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
          setStats(prev => ({ ...prev, approved: data.length }));
        }
      } catch (err) {
        console.error('Error fetching security requests:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchActivePasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/security/passes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setActivePasses(data);
          setStats(prev => ({ ...prev, activePasses: data.length }));
        }
      } catch (err) {
        console.error('Error fetching active passes:', err);
      }
    };
    fetchRequests();
    fetchActivePasses();
  }, []);

  const handleGeneratePass = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/security/requests/${requestId}/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(requests.filter(req => req._id !== requestId));
        alert('Gate Pass generated successfully.');
        if (data.gatePass && data.gatePass._id) {
          navigate(`/gate-pass/${data.gatePass._id}`);
        } else {
          alert("Gate Pass generated but could not navigate. Check dashboard.");
        }
      } else {
        alert(`Failed to generate pass: ${data.message}`);
      }
    } catch (err) {
      console.error("Error generating gate pass:", err);
      alert('Server error. Failed to generate pass.');
    }
  };

  const handleScanSuccess = async (result) => {
    setScanResult('Scanning...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/security/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ encryptedData: result, gate: 'Main Gate' })
      });
      const data = await res.json();
      if (res.ok) {
        setScanResult(data.message);
        window.location.reload();
      } else {
        setScanResult(`Error: ${data.message}`);
      }
    } catch (err) {
      setScanResult('Server error during scan.');
      console.error(err);
    }
  };

  const getSecondPhotoUrl = (pin) => {
    return `https://external-photo-source.com/${pin}.jpg`;
  };
  
  if (loading) {
    return <div className="screen active" id="security-dashboard">Loading...</div>;
  }
  
  return (
    <div className="screen active" id="security-dashboard">
      <Header title="Security Portal" />
      <div className="content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Warden Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.activePasses}</div>
            <div className="stat-label">Active Gate Passes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.issuedToday}</div>
            <div className="stat-label">Issued Today</div>
          </div>
        </div>
        <div className="nav-tabs">
          <div className={`nav-tab ${activeTab === 'Final Approval' ? 'active' : ''}`} onClick={() => setActiveTab('Final Approval')}>Final Approval</div>
          <div className={`nav-tab ${activeTab === 'Active Passes' ? 'active' : ''}`} onClick={() => setActiveTab('Active Passes')}>Active Passes</div>
          <div className={`nav-tab ${activeTab === 'QR Scanner' ? 'active' : ''}`} onClick={() => setActiveTab('QR Scanner')}>QR Scanner</div>
        </div>
        {activeTab === 'Final Approval' && (
          requests.length > 0 ? (
            requests.map(request => (
              <div className="request-card" key={request._id}>
                <div className="request-header">
                  <div className="request-title">{request.student.fullName} - {request.reason}</div>
                  <span className="status-badge status-approved">Warden Approved</span>
                </div>
                <div className="profile-container" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                  <div className="profile-pic-wrapper">
                      {request.student?.photo?.secure_url ? (
                          <img src={request.student.photo.secure_url} alt="Uploaded Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                          <div style={{ width: '100px', height: '100px', backgroundColor: '#ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Photo</div>
                      )}
                  </div>
                  <div className="profile-pic-wrapper">
                      <img src={getSecondPhotoUrl(request.student.pin)} alt="Official Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
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
                    <div className="detail-label">Time</div>
                    <div className="detail-value">
                      {new Date(request.startDate).toLocaleDateString()}
                      {request.leaveType === 'day-pass' && ` (${request.startTime} - ${request.endTime})`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-success" onClick={() => handleGeneratePass(request._id)}>Generate Gate Pass</button>
                  <button className="btn btn-secondary">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No requests pending gate pass generation.</p>
          )
        )}
        {activeTab === 'Active Passes' && (
          activePasses.length > 0 ? (
            activePasses.map(pass => (
              <div className="request-card" key={pass._id}>
                <div className="request-header">
                  <div className="request-title">{pass.student.fullName} - {pass.passId}</div>
                  <span className="status-badge status-approved">Active</span>
                </div>
                <div className="profile-container" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                  <div className="profile-pic-wrapper">
                      {pass.student?.photo?.secure_url ? (
                        <img src={pass.student.photo.secure_url} alt="Uploaded Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '100px', height: '100px', backgroundColor: '#ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Photo</div>
                      )}
                  </div>
                  <div className="profile-pic-wrapper">
                      <img src={getSecondPhotoUrl(pass.student.pin)} alt="Official Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                </div>
                <div className="request-details">
                  <div className="detail-item">
                    <div className="detail-label">Student PIN</div>
                    <div className="detail-value">{pass.student.pin}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Valid Until</div>
                    <div className="detail-value">{new Date(pass.validUntil).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary">View Pass</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No active gate passes.</p>
          )
        )}
        {activeTab === 'QR Scanner' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <QRScanner onScanSuccess={handleScanSuccess} />
            {scanResult && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
                <strong>Scan Result:</strong> {scanResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityDashboard;