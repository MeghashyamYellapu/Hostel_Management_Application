import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

const API_BASE = process.env.REACT_APP_API_BASE;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "Computer Science",
    pin: "",
    year: "1st Year",
    parentPhone: "",
    guardianPhone: "",
    roomNumber: "",
    password: "",
    confirmPassword: "",
    photo: null // To store the file object
  });

  const [message, setMessage] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        setPhotoPreviewUrl(URL.createObjectURL(file));
      } else {
        setPhotoPreviewUrl(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    // Client-side validation for photo and other required fields
    if (!formData.photo) {
        setMessage("❌ Profile picture is required!");
        return;
    }
    if (!formData.parentPhone || !formData.roomNumber) {
        setMessage("❌ Parent Phone and Room Number are required!");
        return;
    }

    setMessage("Registering..."); // Show loading message

    const dataToSend = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword" && formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: dataToSend
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="screen active" id="register">
      <div className="header">
        <div className="logo">🏠 Hostel Gate Pass System</div>
      </div>
      <div className="content">
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Student Registration</h2>

        {message && <p style={{ textAlign: "center", color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}

        <form style={{ maxWidth: "600px", margin: "0 auto" }} onSubmit={handleSubmit}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                border: '2px solid #ccc',
                overflow: 'hidden',
                margin: '0 auto 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {photoPreviewUrl ? (
                <img
                  src={photoPreviewUrl}
                  alt="Profile Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
                  Click to add profile picture
                </span>
              )}
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
              id="photo-upload"
              required
            />
            <label htmlFor="photo-upload" className="btn btn-secondary">
              Upload Photo
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Branch/Department</label>
              <select name="branch" value={formData.branch} onChange={handleChange} required>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="EEE">EEE</option>
                <option value="AI">AI(ML & DS)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>PIN Number</label>
              <input type="text" name="pin" value={formData.pin} onChange={handleChange} required style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="form-group">
              <label>Year</label>
              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Parent Phone (Guardian Primary)</label>
              <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Guardian Phone (Emergency, Optional)</label>
              <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Room Number</label>
            <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "15px" }}>
            Register
          </button>
          <div style={{ textAlign: "center" }}>
            <Link to="/login" style={{ color: "#4facfe", textDecoration: "none" }}>
              Already have an account? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;