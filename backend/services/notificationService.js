const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIo } = require('../config/socketio');
const { sendEmail } = require('../services/emailService');

exports.sendNotification = async (recipientId, title, message, type, data, priority = 'medium') => {
    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            console.error('Notification recipient not found');
            return;
        }

        const newNotification = new Notification({
            recipient: recipientId,
            type,
            title,
            message,
            priority,
            data
        });
        await newNotification.save();

        // Send via in-app (Socket.io)
        const io = getIo();
        if (io) {
            io.to(recipientId.toString()).emit('new-notification', newNotification);
        }

        // Send via email
        const formattedMessage = `
            <h1>${title}</h1>
            <p>${message}</p>
        `;
        await sendEmail(recipient.email, title, formattedMessage);

    } catch (err) {
        console.error('Error sending notification:', err);
    }
};