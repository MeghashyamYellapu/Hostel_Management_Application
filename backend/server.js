const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const socketio = require('./config/socketio');

dotenv.config();

const app = express();
const httpServer = createServer(app);

socketio.init(httpServer);

const connectDB = require('./config/database');
connectDB();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/hod', require('./routes/hod'));
app.use('/api/warden', require('./routes/warden'));
app.use('/api/security', require('./routes/security'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student/gate-pass', require('./routes/gatePass'));
app.use('/api/notifications', require('./routes/notifications')); // Add this line

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));