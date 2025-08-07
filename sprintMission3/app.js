import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import articleRouter from './router/article_router.js';
import productRouter from './router/product_router.js';
import articleCommnetRouter from './router/comment_article_router.js';
import productCommentRouter from './router/comment_product_router.js';
import { errorMiddleWare } from './middleware/errorMiddleWare.js';

dotenv.config();

const app = express();

const prisma = new PrismaClient(); 
const PORT = process.env.PORT || 3000;  

app.use(express.json());

app.use ('/articles', articleRouter);
app.use ('/products', productRouter);
app.use('/products/comment',productCommnetRouter);
app.use('/articles/comment',articleCommnetRouter);

app.use(errorMiddleWare);

//app.use(에러핸들러....미들웨어...)

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});

