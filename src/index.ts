import express from 'express';
import dotenv from 'dotenv';
import { CONFIG } from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// 환경변수 설정
dotenv.config();

// MongoDB 연결
connectDB();

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JSON 응답
app.get('/json', (req, res) => {
  res.json({ message: 'Donkey Slack App is running!' });
});

// HTML 응답
app.get('/html', (req, res) => {
  res.send('<h1>Donkey Slack App is running!</h1>');
});

// 일반 텍스트 응답
app.get('/', (req, res) => {
  res.type('text/plain').send('Donkey Slack App is running!');
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 서버 시작
app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});
