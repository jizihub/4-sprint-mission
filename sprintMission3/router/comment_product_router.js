import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateComment, PatchComment } from '../struct.js';
import { asyncHandler } from '../app.js';
import articleCommnetRouter from './comment_article_router.js';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


productCommentRouter('/')
  .post(asyncHandler(async(req,res)=>{
    assert (req.body, CreateComment);
    const content  = req.body.content;
    const newProductComment = await prisma.comment.create({ //
      data: { content },
      });
    return res.status(201).json(newProductComment);
  }))


productCommentRouter('/:id') // 아래에 먼저 const id = parseInt(req.params.id)-->x;
  .patch(asyncHandler(async(req, res)=>{
    assert (req.body, PatchComment);
    const id = parseInt(req.params.id);
    const patchedComment = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    return res.status(201).json(patchedComment);
  }))

  .delete(asyncHandler(async(req,res)=>{
    const id = parseInt(req.params.id)
    await prisma.comment.delete({
      where: { id },
    })
    return res.staus(204).send()
  }))

    .get(asyncHandler(async(req, res)=>{
      const id = parseInt(req.params.id);
      const { offset = 0, limit = 10 } = req.query;
      const skip = parseInt(offset);
      const take = parseInt(limit);
      const artcleCommentList = await prisma.comment.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        skip,
        take, 
        cursor : {
          id: myCusor,
        }
      })
      return res.status(201).json({articleCommnetList});
    }));

export default productCommentRouter;