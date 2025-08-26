import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [otpStage, setOtpStage] = useState(false); // New state for OTP stage
  const [otpData, setOtpData] = useState({ otp: '', newPassword: '', confirmNewPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'student') {
          navigate('/student-dashboard');
        } else if (data.user.role === 'hod') {
          navigate('/hod-dashboard');
        } else if (data.user.role === 'warden') {
          navigate('/warden-dashboard');
        } else if (data.user.role === 'security') {
          navigate('/security-dashboard');
        } else if (data.user.role === 'Admin') {
          navigate('/admin-dashboard');
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail) {
      setForgotMsg('Please enter your email.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg('✅ Password reset OTP sent to your email.');
        setOtpStage(true);
      } else {
        setForgotMsg(`❌ ${data.error || 'Failed to send reset OTP.'}`);
      }
    } catch (err) {
      setForgotMsg('❌ Server error. Please try again.');
    }
  };

  const handleOtpAndReset = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (otpData.newPassword !== otpData.confirmNewPassword) {
      setForgotMsg('❌ Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpData.otp,
          newPassword: otpData.newPassword,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg('✅ Password has been reset successfully!');
        setTimeout(() => setShowForgot(false), 2000);
      } else {
        setForgotMsg(`❌ ${data.error || 'Failed to reset password.'}`);
      }
    } catch (err) {
      setForgotMsg('❌ Server error. Please try again.');
    }
  };

  return (
    <div className="screen active" id="login">
      <div className="header">
        <div className="logo">🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to Your Account</h2>
        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
        <form style={{ maxWidth: '400px', margin: '0 auto' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} placeholder="Enter your password" required />
            <div style={{ textAlign: 'right', marginTop: '5px' }}>
              <span
                style={{ color: '#4facfe', cursor: 'pointer', fontSize: '0.95em', textDecoration: 'underline' }}
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Login As</label>
            <select name="role" onChange={handleChange}>
              <option value="student">Student</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="security">Security</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
            Login
          </button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ color: '#4facfe', cursor: 'pointer', textDecoration: 'none' }}>
              Don't have an account? Register here
            </Link>
          </div>
        </form>

        {showForgot && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', minWidth: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginBottom: '15px' }}>{otpStage ? 'Verify OTP and Reset Password' : 'Forgot Password'}</h3>
              
              {!otpStage ? (
                <form onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Send Reset OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpAndReset}>
                  <p style={{marginBottom: '10px'}}>An OTP has been sent to your email.</p>
                  <input
                    type="text"
                    value={otpData.otp}
                    onChange={e => setOtpData({...otpData, otp: e.target.value})}
                    placeholder="Enter OTP"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    required
                  />
                  <input
                    type="password"
                    value={otpData.newPassword}
                    onChange={e => setOtpData({...otpData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    required
                  />
                  <input
                    type="password"
                    value={otpData.confirmNewPassword}
                    onChange={e => setOtpData({...otpData, confirmNewPassword: e.target.value})}
                    placeholder="Confirm new password"
                    style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Reset Password
                  </button>
                </form>
              )}
              
              {forgotMsg && <p style={{ color: forgotMsg.startsWith('✅') ? 'green' : 'red', marginTop: '10px' }}>{forgotMsg}</p>}
              <button
                onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotMsg(''); setOtpStage(false); setOtpData({ otp: '', newPassword: '', confirmNewPassword: '' }); }}
                style={{ marginTop: '15px', background: 'none', border: 'none', color: '#4facfe', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;