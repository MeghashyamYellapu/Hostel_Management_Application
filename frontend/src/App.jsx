// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import NewRequest from './components/NewRequest';
import HodDashboard from './components/HodDashboard';
import WardenDashboard from './components/WardenDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import GatePass from './components/GatePass';
import './styles.css';

function App() {
  return (
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
        <Route path="/gate-pass" element={<GatePass />} />
      </Routes>
    </Router>
  );
}

export default App;
