const User = require('../models/User');

// @desc    Create a new staff account (HOD, Warden, or Security)
// @route   POST /api/admin/staff
// @access  Private (Admin only)
exports.createStaffAccount = async (req, res) => {
    try {
        const { fullName, email, phone, role, department, designation, password } = req.body;

        const staffExists = await User.findOne({ email });
        if (staffExists) {
            return res.status(400).json({ message: 'Staff member with this email already exists' });
        }

        const newStaff = new User({
            fullName,
            email,
            phone,
            role,
            department: role === 'hod' ? department : undefined,
            designation,
            password,
        });

        await newStaff.save();
        res.status(201).json({ message: 'Staff account created successfully', staff: newStaff });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users (students and staff)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a user's role or status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { role, isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};