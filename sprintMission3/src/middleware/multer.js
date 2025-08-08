/**
 * multer 미들웨어를 사용하여 이미지 업로드 API를 구현해주세요.
업로드된 이미지는 서버에 저장하고, 해당 이미지의 경로를 response 객체에 포함해 반환합니다.
 */
import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, f7ㅛile, cb){
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { filesize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error ('허용되지 않는 파일 형식입니다. (JPEG, JPG, GIF만 가능)'), false);
    }
  }
});

export default upload; 
