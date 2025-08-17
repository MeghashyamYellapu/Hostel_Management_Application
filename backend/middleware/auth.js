const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (err) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.studentOnly = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'student') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a student' });
    }
};

exports.hodOnly = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'hod') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an HOD' });
    }
};

exports.wardenOnly = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'warden') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a warden' });
    }
};

exports.securityOnly = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'security') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as security staff' });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};