const express = require('express');
const router = express.Router();
const mypageController = require('../../controller/mypageController');
const authUtil = require('../../middleware/authUtil')

// 총 기록 게시물 가져오기
router.get('/', authUtil.checkToken, mypageController.getAllCerti);
// 이번주 달성률, 총 기록 개수
router.get('/info', authUtil.checkToken, mypageController.getMypageInfo);
// 주 운동 목표 횟수 수정하기
router.put('/cycle', authUtil.checkToken, mypageController.updateExCycle);

module.exports = router;