import React, { useState } from 'react';
import '../styles.css';
import { Link } from 'react-router-dom';

function Home({ navigate }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header-wrapper">
        <div className="home-header-content">
          <div className="home-header-left">
            <div className="home-logo">Hostel Management</div>
            <div className="home-nav">
              <Link to="/" className="home-nav-link">Home</Link>
              <Link to="/about" className="home-nav-link">About</Link>
              <Link to="/contact" className="home-nav-link">Contact</Link>
            </div>
          </div>
          <div className="home-header-right">
            <Link to="/login" className="home-btn-outline">
              Login
            </Link>
            <Link to="/register" className="home-btn-primary">
              Register
            </Link>
            <div className="profile-menu-wrapper">
              <button
                className="home-btn-secondary"
                onClick={toggleProfileMenu}
              >
                Profile ▾
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown-menu">
                  <div
                    onClick={() => navigate('student-dashboard')}
                    className="profile-dropdown-item"
                  >
                    <div className="profile-dropdown-content">
                      <svg className="profile-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-main-content">
        <div className="home-hero-section">
          <h1 className="home-hero-title">
            Hostel Gate Pass Management System
          </h1>
          <p className="home-hero-subtitle">
            A comprehensive system for managing student leave requests with multi-level approval workflow,
            real-time notifications, and digital gate pass generation.
          </p>
          <div className="home-hero-actions">
            <Link to="/login" className="home-btn-hero-primary">
              Get Started
            </Link>
            <Link to="/register" className="home-btn-hero-secondary">
              Learn More
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="home-feature-cards">
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper home-bg-blue">
              <svg className="home-feature-icon home-text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="home-card-title">Student Portal</h3>
            <p className="home-card-text">
              Submit leave requests, track approval status, and download digital gate passes.
            </p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper home-bg-green">
              <svg className="home-feature-icon home-text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="home-card-title">HOD Approval</h3>
            <p className="home-card-text">
              Review and approve leave requests based on department and academic considerations.
            </p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper home-bg-purple">
              <svg className="home-feature-icon home-text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="home-card-title">Warden Approval</h3>
            <p className="home-card-text">
              Manage hostel-specific leave approvals and ensure proper documentation.
            </p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper home-bg-red">
              <svg className="home-feature-icon home-text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="home-card-title">Security Verification</h3>
            <p className="home-card-text">
              Verify gate passes with QR codes and manage student exit/entry records.
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="home-welcome-card">
          <h2 className="home-welcome-title">Welcome to the Hostel Management System</h2>
          <p className="home-welcome-text">
            Use the navigation above to log in, register, or visit your dashboard. Our system provides a comprehensive solution for managing student leave requests with an efficient approval workflow and digital gate pass generation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <p>&copy; 2024 Hostel Gate Pass Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;