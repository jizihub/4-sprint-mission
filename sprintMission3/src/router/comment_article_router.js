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
        content,
        articleId: parseInt(articleId),
        userId: parseInt(userId)
      }
    });
    console.log(['게시물에 새로 댓글이 생성되었습니다.', newArticleComment]);
    return res.status(201).json(newArticleComment);
  }))

  /** 
   * POST는 새로 생성한다는 것 그러면 어떤 정보를 가져오는지가 중요함! 
   * 정보를 가져오는 건 비동기적 작업(async, await), 오류 처리 (오류 관련 헬퍼함수 + 오류 미들웨어 + 데이터 유효성검사
   * 
   * 코드 흐름
   * 1) .메소드(Url주소, 미들웨어 1, async() => {})
   * 2) url 주소는 Express 미들웨어로 묶어버려서 여기서는 생략 
   * 3) Prisma를 이용한 데이터 생성 
   *  const newArticleComment = await prisma.comment.create({}) 
   *  -> 데이터베이스에 새로운 댓글 레코드를 만든다.  
   *  -> 만들기 위한 정보는 Create() 안에 객체 형태로 data 속성을 정의하고 전달함
   * 4) Return으로 클라이언트에서 상태코드와 관련 내용을 json으로 보냄. 
   * 
   * 
   * 
   * .post(createCommentValidator, asyncHandler(async(req,res)=>{
   * const newArticleComment= await prisma.comment.create({
   *    data: req.body})
   * });
   * return res.status(201).json(newArticleComment);
   * 이렇게 data: req.body로 안하고 
   * const { content, articleId, userId } = req.body;
   * const newArticleComment = await prisma.comment.create({
      data: {
        content: content,
        articleId: parseInt(articleId),
        userId: parseInt(userId)
      }
        -> 통으로 data: req.body라고 해버리면 데이터 타입 문제(params와 body는 문자열로 반환) + 유효성 검사 + 불필요한 데이터 전달 가능
        -> 그래서 먼저 구조분해할당 진행
          const { content, articleId, userId } = req.body; (객체구조분할로 각 Key, value가 변수와 값으로 할당된다.)
        -> data : {} 방식으로 객체 형성
        -> 각 각 데이터 타입 명시 해주기, 이때 content는 문자열 + Key = value이므로 content: content라고 할 필요없이 Content만 적어줘도 됨. 
        
   */

  
articleCommentRouter.route('/:id')
  .patch(patchCommentValidator, asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    const { content, articleId } = req.body;
    const dataToUpdate = {};
  
    if(!content == undefined){
      dataToUpdate.content = content;
    }
    if (!articleId == undefined){
      dataToUpdate.articleId = parseInt(articleId);
    }
   const updatedArticleComment = await prisma.comment.update({
    where: { id },
    data: dataToUpdate,
   })
    console.log('댓글이 수정되었습니다,:', updatedArticleComment)
    return res.status(201).json(updatedArticleComment);
    }))

    //pat초

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