import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function NewRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: 'day-pass',
    reason: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    emergencyContact: '',
    additionalComments: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Leave request submitted successfully!');
        setTimeout(() => navigate('/student-dashboard'), 1500);
      } else {
        setMessage(`❌ ${data.message || 'Failed to submit request'}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

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
        <form style={{ maxWidth: '800px', margin: '0 auto' }} onSubmit={handleSubmit}>
          {message && <p style={{ textAlign: 'center', color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}
          <div className="form-group">
            <label>Leave Type</label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
            >
              <option value="day-pass">Day Pass (Few Hours)</option>
              <option value="overnight">Overnight Leave (1-2 Days)</option>
              <option value="extended">Extended Leave (Multiple Days)</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason for Leave</label>
            <textarea
              rows="4"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide detailed reason for your leave request"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
          </div>

          {formData.leaveType === 'day-pass' && (
            <div className="form-row" id="timeFields">
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Emergency Contact (if different from registered)</label>
            <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency contact number" />
          </div>

          <div className="form-group">
            <label>Additional Comments</label>
            <textarea rows="3" name="additionalComments" value={formData.additionalComments} onChange={handleChange} placeholder="Any additional information"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button type="button" onClick={() => navigate('/student-dashboard')} className="btn btn-secondary" style={{ textAlign: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ textAlign: 'center' }}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRequest;