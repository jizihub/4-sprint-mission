import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import {
  CreateProduct,
  PatchProduct,
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
        e.name === 'sturctError' ||
        e instanceof Prisma.PrismaClientValidationError
      ){
        res.status(400).json({ message: e.message});
      } else if(
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ){
        res.status(404).json({ message: e.message});
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  };
}

const productRouter = express.Router();