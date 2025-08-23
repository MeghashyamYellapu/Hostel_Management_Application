import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Header from './common/Header';
import '../styles.css';
import { admissionData } from '../data/admissionData';

function GatePass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gatePass, setGatePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentPin, setStudentPin] = useState('Loading...');
  const [watermarkText, setWatermarkText] = useState('');

  useEffect(() => {
    // Generate watermark text with the current date and time
    const currentDateTime = new Date().toLocaleString();
    setWatermarkText(currentDateTime);

    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        alert("Screenshots are disabled for this page.");
        return false;
      }
    };
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const fetchGatePass = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/student/gate-pass/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setGatePass(data);
          setStudentPin(data.student.pin);
        } else {
          setError(data.message || 'Failed to fetch gate pass.');
        }
      } catch (err) {
        setError('Server error. Could not fetch gate pass.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGatePass();
  }, [id]);

  if (loading) return <div className="screen active">Loading Gate Pass...</div>;
  if (error) return <div className="screen active" style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!gatePass) return <div className="screen active">No gate pass data found.</div>;
  
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getSecondPhotoUrl = (pin) => {
    const admissionNumber = admissionData[pin]?.admissionNumber;
    if (admissionNumber) {
        return `https://media.campx.in/cec/student-photos/${admissionNumber}.jpg`;
    }
    return '';
  };
  
  const getSecondPhotoName = (pin) => {
    return admissionData[pin]?.name || 'N/A';
  };
  
  const getSecondPhotoBranch = (pin) => {
    return admissionData[pin]?.branch || 'N/A';
  };

  return (
    <div className="gatepass-container">
          <div className="watermark-grid">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i}>{watermarkText}</span>
        ))}
      </div>
      <div className="screen active" id="gate-pass">
        <Header title="Official Gate Pass" />
        <div className="content">
          <div className="gate-pass">
            <h2>🏫 COLLEGE HOSTEL</h2>
            <h3>OFFICIAL GATE PASS</h3>

            <div className="gate-pass-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '30px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="profile-pic-wrapper" style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
                        <img src={gatePass.student.photo?.secure_url} alt="User Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>User Uploaded Photo</div>
                    <small>{gatePass.student.fullName}</small>
                </div>
                <div className="qr-code">
                    {gatePass.encryptedData && (
                        <QRCodeCanvas value={gatePass.encryptedData} size={120} />
                    )}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div className="profile-pic-wrapper" style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
                        <img src={getSecondPhotoUrl(gatePass.student.pin)} alt="Official" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>Official Photo</div>
                    <small>{getSecondPhotoName(gatePass.student.pin)}</small>
                    <br />
                    <small>{getSecondPhotoBranch(gatePass.student.pin)}</small>
                </div>
            </div>

            <div className="pass-details">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                textAlign: 'left',
              }}>
                <div><strong>Pass ID:</strong><br /> {gatePass.passId}</div>
                <div><strong>Issue Date:</strong><br /> {formatDate(gatePass.issuedDate)} - {formatTime(gatePass.issuedDate)}</div>
                <div><strong>Student Name:</strong><br /> {gatePass.student.fullName}</div>
                <div><strong>PIN Number:</strong><br /> {gatePass.student.pin}</div>
                <div><strong>Branch/Year:</strong><br /> {gatePass.student.branch} - {gatePass.student.year}</div>
                <div><strong>Leave Type:</strong><br /> {gatePass.leaveRequest.leaveType}</div>
                <div><strong>Valid Until:</strong><br /> {formatDate(gatePass.validUntil)} - {formatTime(gatePass.validUntil)}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Reason:</strong><br /> {gatePass.leaveRequest.reason}
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginTop: '20px',
              fontSize: '14px',
            }}>
              <div>
                <strong>HOD Approval</strong><br /> 
                {gatePass.leaveRequest.hodApproval?.status === 'approved' ? '✅' : '❌'} {gatePass.leaveRequest.hodApproval?.approvedBy?.fullName || 'Pending'}
                <br /> <small>{gatePass.leaveRequest.hodApproval?.timestamp ? formatDate(gatePass.leaveRequest.hodApproval.timestamp) : 'N/A'}</small>
              </div>
              <div>
                <strong>Warden Approval</strong><br /> 
                {gatePass.leaveRequest.wardenApproval?.status === 'approved' ? '✅' : '❌'} {gatePass.leaveRequest.wardenApproval?.approvedBy?.fullName || 'Pending'}
                <br /> <small>{gatePass.leaveRequest.wardenApproval?.timestamp ? formatDate(gatePass.leaveRequest.wardenApproval.timestamp) : 'N/A'}</small>
              </div>
              <div>
                <strong>Security Clearance</strong><br /> 
                {gatePass.securityOfficer?.exit ? '✅' : 'Pending'} {gatePass.securityOfficer?.exit?.fullName || 'Gate 1'}
                <br /> <small>{gatePass.securityOfficer?.exit ? formatDate(gatePass.exitTime) : 'N/A'}</small>
              </div>
            </div>

            <div style={{
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              fontSize: '12px',
            }}>
              <p><strong>IMPORTANT INSTRUCTIONS:</strong></p>
              <p>• This pass must be presented at the gate for exit and entry</p>
              <p>• Student must return before the specified time</p>
              <p>• Any extension requires prior approval</p>
              <p>• Lost passes should be reported immediately</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>
              📱 Show to Security
            </button>
            <button className="btn btn-secondary" style={{ marginRight: '10px' }}>
              🖨️ Print Pass
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/student-dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GatePass;