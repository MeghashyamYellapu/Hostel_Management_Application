// src/components/GatePass.jsx
import React from 'react';
import '../styles.css';

function GatePass({ navigate }) {
  return (
    <div className="screen active" id="gate-pass">
      <div className="header">
        <div className="logo">🏠 Official Gate Pass</div>
        <div className="user-info">
          <span>Print/Download</span>
        </div>
      </div>
      <div className="content">
        <div className="gate-pass">
          <h2>🏫 COLLEGE HOSTEL</h2>
          <h3>OFFICIAL GATE PASS</h3>

          <div className="qr-code">QR CODE</div>

          <div className="pass-details">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                textAlign: 'left',
              }}
            >
              <div>
                <strong>Pass ID:</strong>
                <br /> GP-2025-001235
              </div>
              <div>
                <strong>Issue Date:</strong>
                <br /> Aug 1, 2025 - 9:45 AM
              </div>
              <div>
                <strong>Student Name:</strong>
                <br /> John Doe
              </div>
              <div>
                <strong>PIN Number:</strong>
                <br /> CS21B001
              </div>
              <div>
                <strong>Branch/Year:</strong>
                <br /> Computer Science - 3rd Year
              </div>
              <div>
                <strong>Contact:</strong>
                <br /> +91 9876543210
              </div>
              <div>
                <strong>Leave Type:</strong>
                <br /> Day Pass
              </div>
              <div>
                <strong>Valid Until:</strong>
                <br /> Aug 1, 2025 - 2:00 PM
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Reason:</strong>
                <br /> Medical appointment at city hospital
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginTop: '20px',
              fontSize: '14px',
            }}
          >
            <div>
              <strong>HOD Approval</strong>
              <br /> ✅ Dr. Smith
              <br /> <small>Aug 1, 9:30 AM</small>
            </div>
            <div>
              <strong>Warden Approval</strong>
              <br /> ✅ Mr. Johnson
              <br /> <small>Aug 1, 9:40 AM</small>
            </div>
            <div>
              <strong>Security Clearance</strong>
              <br /> ✅ Gate 1
              <br /> <small>Aug 1, 9:45 AM</small>
            </div>
          </div>

          <div
            style={{
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              fontSize: '12px',
            }}
          >
            <p>
              <strong>IMPORTANT INSTRUCTIONS:</strong>
            </p>
            <p>• This pass must be presented at the gate for exit and entry</p>
            <p>• Student must return before the specified time</p>
            <p>• Any extension requires prior approval</p>
            <p>• Lost passes should be reported immediately</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-primary" style={{ marginRight: '10px' }}>
            📱 Send to Phone
          </button>
          <button className="btn btn-secondary" style={{ marginRight: '10px' }}>
            🖨️ Print Pass
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('student-dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default GatePass;
