const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');// Add this import
const crypto = require('crypto');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, branch, pin, year, parentPhone, guardianPhone, roomNumber, password } = req.body;
    let photo = {};
    if (req.file) {
        photo = {
            public_id: req.file.public_id,
            secure_url: req.file.secure_url
        };
    } else {
        return res.status(400).json({ error: 'Profile picture is required.' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    user = await User.findOne({ pin });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this PIN number' });
    }
    user = new User({
      fullName,
      email,
      phone,
      branch,
      pin,
      year,
      parentPhone,
      guardianPhone,
      roomNumber,
      password,
      role: 'student',
      photo
    });
    await user.save();
    res.status(201).json({ message: 'Registration successful. Please log in.', user: user.toObject() });
  } catch (err) {
    console.error(err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Max 5MB allowed.' });
    }
    res.status(500).json({ error: 'Server error during registration. Check console for details.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials or role' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user._id, user.role);
    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role, photo: user.photo } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Forgot Password - Send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User with that email not found.' });
        }

        const resetOtp = user.getResetPasswordOtp();
        await user.save({ validateBeforeSave: false });

        const message = `
            <h1>Hostel Management System - Password Reset</h1>
            <p>You have requested a password reset. Your One-Time Password (OTP) is:</p>
            <h2 style="font-size: 24px; font-weight: bold;">${resetOtp}</h2>
            <p>This OTP is valid for 15 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        const emailSent = await sendEmail(user.email, 'Password Reset OTP', message);

        if (emailSent) {
            res.status(200).json({ message: 'Password reset OTP sent to your email.' });
        } else {
            user.resetPasswordOtp = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
        }

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Server error during password reset request.' });
    }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const hashedOtp = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        if (hashedOtp !== user.resetPasswordOtp || user.resetPasswordExpire < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }
        
        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });

    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Server error during password reset.' });
    }
};