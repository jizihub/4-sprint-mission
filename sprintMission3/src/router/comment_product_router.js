import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createCommentValidator, 
  patchCommentValidator } from '../middleware/validationMiddleWare.js';
import { asyncHandler } from '../asyncHandler.js';

const prisma = new PrismaClient();
const productCommentRouter = express.Router();

productCommentRouter.route('/')
  .post(createCommentValidator, asyncHandler(async(req,res)=>{
    const {content, articleId, userId } = req.body;
    const newProductComment = await prisma.comment.create({
      data: {
        content: content,
        articleId: parsedInt(articleId),
        userId: parsedInt(userId)
      }
    });
    return res.status(201).json(newProductComment);
  }))


productCommentRouter.route('/:id') 
  .patch(patchCommentValidator, asyncHandler(async(req, res)=>{
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