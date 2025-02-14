import { Server } from 'socket.io';

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        //소켓 이벤트 핸들러
        socket.on('joinRoom', ({sellId}) => {
            socket.join(sellId);
            console.log(`User joined room ${sellId}`);
        });

        socket.on('sendMessage', (msg) => {
            io.to(msg.sellId).emit('receiveMessage', msg);
        });

        socket.on('disconnect', ()=> {
            console.log('User disconnected');
        });
    });

    return io;
};

export default initializeSocket;