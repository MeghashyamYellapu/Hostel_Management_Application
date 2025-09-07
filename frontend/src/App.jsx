import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import NewRequest from './components/NewRequest';
import HodDashboard from './components/HodDashboard';
import WardenDashboard from './components/WardenDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import GatePass from './components/GatePass';
import AdminDashboard from './components/AdminDashboard';
import NewStaff from './components/NewStaff';
import Profile from './components/Profile';
import './styles.css';

function App() {
  useEffect(() => {
    // Initialize theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/hod-dashboard" element={<HodDashboard />} />
          <Route path="/warden-dashboard" element={<WardenDashboard />} />
          <Route path="/security-dashboard" element={<SecurityDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/gate-pass/:id" element={<GatePass />} />
          <Route path="/new-staff" element={<NewStaff />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;