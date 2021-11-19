const express = require('express');
const router = express.Router();
const upload = require('../../modules/multer');
const certiController = require('../../controller/certiController');
const authUtil = require('../../middleware/authUtil')

// 인증 게시물 내용 업로드
router.post('/', authUtil.checkToken, certiController.postCertiBody);
// 인증 게시물 사진 업로드
router.post('/image/:certiId', authUtil.checkToken, upload.single('image'), certiController.postCertiImage);
// 인증 게시물 상세보기
router.get('/detail/:certiId', authUtil.checkToken, certiController.getCertiDetail);
// 해당 날짜의 인증 게시물 가져오기
router.get('/', authUtil.checkToken, certiController.getCertiByCal);
// 인증 게시물 수정하기
router.put('/', authUtil.checkToken, certiController.updateCerti);
// 인증 게시물 삭제하기
router.delete('/:certiId', authUtil.checkToken, certiController.deleteCerti);

module.exports = router;