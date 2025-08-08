import express from 'express';
import { asyncHandler } from '../app.js';
import upload from '../upload';
import multer from 'multer';

const app = express();
app.use(express.json());

const uploadRouter = express.Router();

uploadRouter.route('/')
  .post(upload.array('attachment', 5), asyncHandler(async (req, res) => {
    try{
      if (!req.files || req.files.length === 0) {
        console.error("message: '파일이 업로드되지 않았습니다.'")
        return res.status(400).json({ meessage: '파일이 업로드되지 않았습니다.' });
      }
        console.log('업로드된 파일들: ', req.files);
        console.log('텍스트 필드 데이터; ', req.body);
        return res.status(200).json({
          message: '파일들이 성공적으로 업로드되었습니다.',
          file: req.files.map(file => ({
            filename: file.filename,
            filepath: `uploads/${file.filename}` 
          }))
        });
      } catch(error){
        if(error instanceof multer.MulterError && error.code === 'LIMIT_FIELD_COUNT'){
          return res.status(400).json({ error: '최대 5개의 파일만 업로드할 수 있습니다.'})
        }
        console.error('파일 업로드 중 오류발생:', error);
        res.status(500).json({ error: '파일 업로드 중 오류 발생' })
      }
    }));

  export default uploadRouter;

// app.post('/upload', (req, res)=> {
//   try{
//     if(!req.file || req.file.length === 0){
//       return res.status(400).send('파일이 업로드되지 않았습니다.')
//     }
//     res. status(200).json({
//       message: '파일이 성공적으로 업로드되었습니다.',
//       files: req.files.map(file => ({
//         filename: file.filename,
//         filepath: '/upload/${file.filename}'
//       }))
//     });
//   } catch (error){
//     if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).send('최대 5개의 파일만 업로드할 수 있습니다.');
//     }
//     console.error('파일 업로드 중 오류 발생:', error);
//     res.status(500).send(error.message || '파일 업로드 실패');
//     }
//   });
