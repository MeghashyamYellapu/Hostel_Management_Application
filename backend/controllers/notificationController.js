const Notification = require('../models/Notification');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification || notification.recipient.toString() !== req.user.id.toString()) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.channels.inApp.read = true;
        notification.channels.inApp.readAt = new Date();
        await notification.save();
        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};