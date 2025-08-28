import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './common/Header';
import '../styles.css';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        pin: '',
        department: '',
        designation: '',
        photo: null
    });
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [message, setMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:5000/api/auth/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setFormData({
                            fullName: data.user.fullName || '',
                            email: data.user.email || '',
                            phone: data.user.phone || '',
                            pin: data.user.pin || '',
                            department: data.user.department || '',
                            designation: data.user.designation || '',
                            photo: null
                        });
                        setPhotoPreviewUrl(data.user.photoUrl || null); // If your backend returns photoUrl
                    } else {
                        setMessage(`❌ ${data.message || 'Failed to fetch profile.'}`);
                    }
                } catch (err) {
                    setMessage('❌ Server error. Failed to fetch profile.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, []);

    const handleProfileChange = (e) => {
        if (e.target.name === 'photo') {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) form.append(key, value);
            });
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('✅ Profile updated successfully!');
                const updatedUser = { ...user, ...formData, photoUrl: data.user.photoUrl };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage(`❌ ${data.message || 'Failed to update profile.'}`);
            }
        } catch (err) {
            setMessage('❌ Server error. Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordMessage('❌ New passwords do not match!');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                })
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordMessage('✅ Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            } else {
                setPasswordMessage(`❌ ${data.message || 'Failed to update password.'}`);
            }
        } catch (err) {
            setPasswordMessage('❌ Server error. Failed to update password.');
        }
    };

    if (loading) return <div className="screen active">Loading...</div>;

    return (
        <div className="screen active" id="profile">
            <Header title="Profile Settings" />
            <div className="content">
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Update Profile</h2>
                {message && <p style={{ textAlign: 'center', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}

                <form style={{ maxWidth: '600px', margin: '0 auto' }} onSubmit={handleProfileSubmit} encType="multipart/form-data">
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <label htmlFor="photo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {photoPreviewUrl ? (
                                <img
                                    src={photoPreviewUrl}
                                    alt="Profile Preview"
                                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }}
                                />
                            ) : (
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ccc' }}>
                                    <span style={{ color: '#888' }}>Click to add/change photo</span>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleProfileChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleProfileChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleProfileChange} required />
                    </div>
                    <div className="form-group">
                        <label>PIN Number</label>
                        <input type="text" name="pin" value={formData.pin} onChange={handleProfileChange} required style={{ textTransform: 'uppercase' }} />
                    </div>
                    {user?.role.toLowerCase() === 'hod' && (
                        <>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleProfileChange} required />
                            </div>
                            <div className="form-group">
                                <label>Designation</label>
                                <input type="text" name="designation" value={formData.designation} onChange={handleProfileChange} required />
                            </div>
                        </>
                    )}
                    {(user?.role.toLowerCase() === 'warden' || user?.role.toLowerCase() === 'security') && (
                        <div className="form-group">
                            <label>Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={handleProfileChange} required />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
                        Save Profile
                    </button>
                </form>

                <h3 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Change Password</h3>
                {passwordMessage && <p style={{ textAlign: 'center', color: passwordMessage.startsWith('✅') ? 'green' : 'red' }}>{passwordMessage}</p>}
                <form style={{ maxWidth: '600px', margin: '0 auto' }} onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Change Password
                    </button>
                </form>

                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} style={{ width: '100%', marginTop: '20px' }}>
                    ← Back
                </button>
            </div>
        </div>
    );
}

export default Profile;