const socketIo = require('socket.io');

let io;

const init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected: ' + socket.id);

        // Join project room
        socket.on('join_project', (projectId) => {
            socket.join(projectId);
            console.log(`Socket ${socket.id} joined project ${projectId}`);
        });

        // Leave project room
        socket.on('leave_project', (projectId) => {
            socket.leave(projectId);
            console.log(`Socket ${socket.id} left project ${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIo };
