const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  // --- ADD THIS CONSOLE.LOG TO DEBUG ---
  console.log("Received file object (req.file):", req.file);
  // ------------------------------------

  try {
    const { fullName, email, phone, branch, pin, year, parentPhone, guardianPhone, roomNumber, password } = req.body;
    let photo = {};

    // Check if a file was uploaded and process it
      if (req.file) {
        photo = {
            public_id: req.file.filename, // Corrected from req.file.public_id
            secure_url: req.file.path    // Corrected from req.file.secure_url
        };
    } else {
        console.log("Error: req.file is undefined. Profile picture not received by controller.");
        return res.status(400).json({ error: 'Profile picture is required.' });
    }
    // Check if user with this email or pin already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    user = await User.findOne({ pin });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this PIN number' });
    }

    // Create new user with all fields, including the photo object
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
      photo // Save the photo object here
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful. Please log in.', user: user.toObject() });
  } catch (err) {
    console.error("Error during registration:", err.message); // More specific error log
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