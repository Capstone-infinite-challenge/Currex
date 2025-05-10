import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./configs/mongodb-connection.js";
import Routes from "./routes/paths.js";
import http from "http";
import initializeSocket from "./utils/socketServer.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://currex.kro.kr"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "sessionsecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// 몽고디비 연결
connectToDatabase();


//express http 서버 생성
const server = http.createServer(app);

//Socket.io 초기화
const io = initializeSocket(server);

//라우터 경로 설정 & io객체 모든 라우터에 전달
app.use("/api", Routes(io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port: ${PORT}`);
});


export default app;
