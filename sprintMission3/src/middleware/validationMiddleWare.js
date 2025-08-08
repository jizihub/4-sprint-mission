import { assert, StructError } from 'superstruct'
import { CreateArticle, CreateComment, CreateProduct, PatchArticle, PatchComment, PatchProduct } from "../struct.js"

// 유효성 미들웨어 만들기
// 1. 각 필드에 대한 유효성 검사는 superstruct가 해준다.
// 2. 그러면 Req.body로 들어온 파라미터가 superstruct에 들어가게 해서 유효성 검사를하게 한다.Req
// 3. 오류가 있으면 throw하고,
// 4. 괜찮으면 그 값을 넘긴다. 

export function createArticleValidator (req, res, next){
  try{
    assert(req.body, CreateArticle);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}

export function patchArticleValidator (req, res, next){
  try{
    assert(req.body, PatchArticle);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}

export function createProductValidator (req, res, next){
  try{
    assert(req.body, CreateProduct);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}

export function patchProductValidator (req, res, next){
  try{
    assert(req.body, PatchProduct);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}

export function createCommentValidator (req, res, next){
  try{
    assert(req.body, CreateComment);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}

export function patchCommentValidator (req, res, next){
  try{
    assert(req.body, PatchComment);
    next();
  } catch(err){
    next(err); //throw(err)
  }
}