// src/App.jsx
import React, { useState } from 'react';
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
  const [screen, setScreen] = useState('home');

  const navigate = (target) => setScreen(target);

  return (
    <div>
      {screen === 'home' && <Home navigate={navigate} />}
      {screen === 'login' && <Login navigate={navigate} />}
      {screen === 'register' && <Register navigate={navigate} />}
      {screen === 'student-dashboard' && <StudentDashboard navigate={navigate} />}
      {screen === 'new-request' && <NewRequest navigate={navigate} />}
      {screen === 'hod-dashboard' && <HodDashboard />} 
      {screen === 'warden-dashboard' && <WardenDashboard />} 
      {screen === 'security-dashboard' && <SecurityDashboard />} 
      {screen === 'gate-pass' && <GatePass navigate={navigate} />} 
    </div>
  );
}

export default App;
