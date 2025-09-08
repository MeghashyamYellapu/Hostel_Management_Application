import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const API_BASE = process.env.REACT_APP_API_BASE;

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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      switch(data.user.role.toLowerCase()) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'hod':
          navigate('/hod-dashboard');
          break;
        case 'warden':
          navigate('/warden-dashboard');
          break;
        case 'security':
          navigate('/security-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(`❌ ${err.message || 'Server error. Please try again.'}`);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail) {
      setForgotMsg('❌ Please enter your email.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send reset OTP');
      }

      const data = await res.json();
      setForgotMsg('✅ Password reset OTP sent to your email.');
      setOtpStage(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setForgotMsg(`❌ ${err.message || 'Server error. Please try again.'}`);
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
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpData.otp,
          newPassword: otpData.newPassword,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      const data = await res.json();
      setForgotMsg('✅ Password has been reset successfully!');
      setTimeout(() => setShowForgot(false), 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setForgotMsg(`❌ ${err.message || 'Server error. Please try again.'}`);
    }
  };

  return (
    <div className="screen active" id="login">
      <div className="header" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <div className="logo" style={{ marginLeft: '20px' }}>🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Subtracting header height
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to Your Account</h2>
          {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-headly">Email</label>
              <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label className="form-headly">Password</label>
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
        </div>

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