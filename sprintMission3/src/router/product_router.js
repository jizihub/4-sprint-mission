import express from 'express';
import { PrismaClient,Prisma } from '@prisma/client';
import { createProductValidator, 
  patchProductValidator } from '../middleware/validationMiddleWare.js';
import { asyncHandler } from '../asyncHandler.js';
import { integer } from 'superstruct';

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route('/')
  .post(createProductValidator, asyncHandler(async (req,res)=>{
    const data = req.body  
    const newProduct = await prisma.product.create({data}) 
    return res.status(201).json(newProduct); 
    }))

  .get(asyncHandler(async(req, res)=>{
    const { offset =0, limit=0, order, name, description } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    if( skip!== integer || take!== integer || skip < 0 || take < 0 ){  
      return res.status(404).json({ error: '페이지네이션 설정값은 양수로 설정되어야 합니다..'});
  } // 정수여야 하는건강...? 
    const productList = await prisma.product.findManyOrThrow({
      where: {
        name,
        description,
      },
      skip, 
      take, 
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
      createdAt: order === 'newest'? 'desc' : 'asc',
      }, 
      });
    return res. status(201).json(productList);
    }));

productRouter.route('/:id')
  .get(asyncHandler(async (req,res)=>{
    const id = parseInt(req.params.id);
    const datailedProduct = await prisma.product.findUniqueOrThrow({
      where : { id },
      select : { 
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true, 
        createdAt: true,
      },
    });
  }))

  .patch(patchProductValidator, asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    const data = req.body; 
    const patchedProduct = await prisma.product.update({
      where : { id }, 
      data , 
    });
    return res.status(201).json(patchedProduct);
  }))

  .delete(asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id },
      });
    return res.status(204).send(); 
    }));

export default productRouter;