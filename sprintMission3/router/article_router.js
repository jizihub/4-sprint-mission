import express from 'express';
import { Prisma, PrismaClient} from '@prisma/client'; 
import { CreateArticle, PatchArticle, } from '../struct.js';
import { asyncHandler } from '../asyncHandler.js';
//assert

const articleRouter = express.Router();
const prisma = new PrismaClient();

articleRouter.route('/')
  .post( asyncHandler(async (req, res) => {
    assert (req.body, CreateArticle);
    const data = req.body;
    const newArticle = await prisma.article.create({ data }); 
    // { key : value }, key === value -> { key } 
    return res.status(201).json(newArticle);
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
    return res.status(200).json(articleList);
    }
  }));
  

articleRouter.route('/:id')
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

  .delete(asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id },
    });
    res.status(204).send(); 
  }))

export default articleRouter;


/**
 * const results = await prisma.post.findMany({
  skip: (page - 1) * 5,
  take: 5,
});
이렇다면 page 1 일때는 skip하지 않고,
2일 때는 5개 skip
3일 때는 10개 skip ... 하면서 목표했던 페이지 분할 로딩 기능이 구현된다.
 */

//https://www.prisma.io/docs/orm/prisma-client/queries/pagination