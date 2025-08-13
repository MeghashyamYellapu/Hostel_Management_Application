// src/components/NewRequest.jsx
import React, { useState } from 'react';
import '../styles.css';

function NewRequest({ navigate }) {
  const [leaveType, setLeaveType] = useState('day-pass');

  return (
    <div className="screen active" id="new-request">
      <div className="header">
        <div className="logo">🏠 New Leave Request</div>
        <div className="user-info">
          <span>John Doe</span>
          <div className="avatar">JD</div>
        </div>
      </div>
      <div className="content">
        <form style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-group">
            <label>Leave Type</label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="day-pass">Day Pass (Few Hours)</option>
              <option value="overnight">Overnight Leave (1-2 Days)</option>
              <option value="extended">Extended Leave (Multiple Days)</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason for Leave</label>
            <textarea rows="4" placeholder="Please provide detailed reason for your leave request"></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" defaultValue="2025-08-01" />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" defaultValue="2025-08-01" />
            </div>
          </div>

          {leaveType === 'day-pass' && (
            <div className="form-row" id="timeFields">
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" defaultValue="10:00" />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" defaultValue="14:00" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Emergency Contact (if different from registered)</label>
            <input type="tel" placeholder="Emergency contact number" />
          </div>

          <div className="form-group">
            <label>Additional Comments</label>
            <textarea rows="3" placeholder="Any additional information"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('student-dashboard')}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('student-dashboard')}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRequest;
