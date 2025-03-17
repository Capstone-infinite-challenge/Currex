import { Server } from 'socket.io';
import redisService from '../services/redisService.js';

let io;     //io 객체를 외부에서도 가져올 수 있도록 선언

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:5000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        //소켓 이벤트 핸들러

        //채팅방 입장
        socket.on('joinRoom', ({chatRoomId}) => {
            socket.join(chatRoomId);
            console.log(`유저가 ${chatRoomId} 채팅방에 입장했습니다.`);
        });

        //메세지 보내기
        socket.on("sendMessage", ({ chatRoomId, senderId, message }) => {
            if (!chatRoomId || !senderId || !message) return;

            // 메시지를 Redis에 저장
            try{
                redisService.saveChatMessage(chatRoomId, senderId, message);
                console.log('✔️메세지 저장 완료');
            }catch(error){
                console.error("메시지 저장 중 오류 발생: ", error);
                return;
            }

            // 해당 채팅방의 모든 참여자에게 메시지 전송
            io.to(chatRoomId).emit("receiveMessage", { senderId, message });
        });       

        socket.on('disconnect', ()=> {
            console.log('User disconnected');
        });
    });

    return io;
};

export default initializeSocket;