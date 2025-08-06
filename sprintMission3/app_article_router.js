import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import {
  CreateArticle,
  PatchArticle,
} from './struct.js';

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;  

app.use(express.json());

function asyncHandler (handler){
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

const articleRouter = express.Router();

articleRouter.route('/')
  .post( asyncHandler(async (req, res) => {
    assert (req.body, CreateArticle);
    const data = req.body;
    const newArticle = await prisma.article.create({ data });
    res.status(201).json(newArticle);
  }))
  .get( asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = 'recent' } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    if(skip < 0 || take < 0){
      return res.status(400).json({ error: '페이지네이션 설정값은 음수가 될 수 없습니다.'})

    let orderBy;
    switch (order) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    const articleList = await prisma.article.findManyOrThrow({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      orderBy,
      skip,
      take,
    });
    res.status(200).json(articleList);
    }
  }));
  

// 상품 상세 조회 API 
articleRouter('/:id')
  .get(asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const detailedArticle = await prisma.article.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
     },
    });
    if(detailedArticle){
    res.status(200).json(detailedArticle);
    } else {
    res.status(404).json({ error: '조건에 맞는 게시물을 찾을 수 없습니다.'}); 
    }
  }))

  .patch(asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedArticle = await prisma.article.update({
      where: { id } ,
      data,
      });
      res.status(200).json(updatedArticle);
  }))

  .delete('/articles/:id', asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id },
    });
    res.status(204).send(); 
  }))

app.use('/articles',articleRoute);

// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});
