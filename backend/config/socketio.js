let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        // Add Socket.io connection logic here
        io.on('connection', socket => {
            console.log('A user connected:', socket.id);

            // You might want to associate the socket with a user ID
            // const userId = socket.handshake.query.userId;
            // if (userId) {
            //     socket.join(userId);
            // }

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};