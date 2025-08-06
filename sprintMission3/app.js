import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import * as articleRouter from './article_router.js';
import * as productRouter from './product_router.js'

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;  

app.use(express.json());

//에러핸들링 함수ㅡ에러처리 미들웨어 아님.. 생각해야 햄
export function asyncHandler (handler){
  return async function (req,res){
    try{
      await handler(req, res);
    } catch(e){
      if(
        e.name === 'StructError' ||
        e instanceof Prisma.PrismaClientValidationError
      ){
        res.status(400).json({ message: e.message});
      } else if(
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ){
        res.status(404).json({ message: e.message });
      } else {
        res.status(500).json({ message: e.message});
      }
    }
  };
}

app.use ('/articles', articleRouter);
app.use ('/products', productRouter);
app.use('/products/comment',productCommnetRouter);
app.use('/articles/comment',articleCommnetRouter);

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});
