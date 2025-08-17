const Notification = require('../models/Notification');
const User = require('../models/User');
// const nodemailer = require('nodemailer'); // For email notifications
// const twilio = require('twilio'); // For SMS/WhatsApp

// TODO: Configure your email and Twilio services
// const transporter = nodemailer.createTransport({ ... });
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
        // const io = require('../config/socketio').getIo();
        // io.to(recipientId.toString()).emit('new-notification', newNotification);
        
        // TODO: Implement other channels (email, sms, whatsapp)
        // if (recipient.email && newNotification.channels.email) {
        //     const mailOptions = { ... };
        //     await transporter.sendMail(mailOptions);
        //     newNotification.channels.email.sent = true;
        //     newNotification.channels.email.sentAt = new Date();
        // }
        
        // if (recipient.phone && newNotification.channels.sms) {
        //     await twilioClient.messages.create({ ... });
        //     newNotification.channels.sms.sent = true;
        //     newNotification.channels.sms.sentAt = new Date();
        // }

        await newNotification.save();
        
    } catch (err) {
        console.error('Error sending notification:', err);
    }
};