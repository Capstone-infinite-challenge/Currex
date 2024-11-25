import express from 'express';
import mongoClient from './configs/mongodb-connection.js';

const app = express();

//req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//라우터
