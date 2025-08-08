import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createCommentValidator,
  patchCommentValidator } from '../middleware/validationMiddleWare.js';
import { asyncHandler } from '../asyncHandler.js';

const prisma = new PrismaClient();
const articleCommentRouter = express.Router();

articleCommentRouter.route('/')
  .post(createCommentValidator, asyncHandler(async(req, res)=>{
    const { content, articleId, userId } = req.body;
    const newArticleComment = await prisma.comment.create({
      data: {
        content: content,
        articleId: parsedInt(articleId),
        userId: parsedInt(userId)
      }
    });
    return res.status(201).json(newArticleComment);
  }))

  
articleCommentRouter.route('/:id')
  .patch(patchCommentValidator, asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    const patchedComment = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    return res.status(201).json(patchedComment);
    }))

  .delete(asyncHandler(async(req,res)=>{
    const id = parseInt(req.params.id);
    await prisma.comment.delete({
      where: { id },
    })
    return res.staus(204).send();
     }))
  
  .get(asyncHandler(async(req, res)=>{
    const id = parseInt(req.param.id);
    const { offset = 0, limit = 10 } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);
    const articleCommentList = await prisma.comment.findUniqueOrThrow({
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
    });
    return res.status(204).json(articleCommentList);
  }));

export default articleCommentRouter;