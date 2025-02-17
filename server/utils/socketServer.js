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

        socket.on("updateChat", (data) => {
            console.log("📢 채팅방 알림:", data.message);
        })

        socket.on('joinRoom', ({chatRoomId}) => {
            socket.join(chatRoomId);
            console.log(`유저가 ${chatRoomId} 채팅방에 입장했습니다.`);
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