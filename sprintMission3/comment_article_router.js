import express from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateComment, PatchComment,} from './struct.js';
import { asyncHandler } from './app.js';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

articleCommnetRouter('/')
  .post(asyncHandler(async(req, res)=> 
    assert(req.body, CreateComment)))
    const content = req.body.content;
    const newArticleComment = await prisma.comment.create({content});//
    res.status(201).json(newArticleComment)


articleCommnetRouter('/:id')
  .patch(asyncHandler(async(req, res)=>{
    aseert (req.body, PatchComment);
    const id = parseInt(req.params.id);
    const patchedComment = await prisma.comment.update({
      where: { id },
      data: req.body,
    })
    res.status(201).json(patchedComment)
    }))

  .delete(asyncHandler(async(req,res)=>{
    const id = parseInt(req.params.id)
    await prisma.comment.delete({
      where: { id },
    })
    res.staus(204).send()
     }))
  
  .get(asyncHandler(async(req, res)=>{
    const id = parseInt(req.param.id);
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
  }));

export default articleCommnetRouter;