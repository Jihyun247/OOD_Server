const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const user = require('../../models/user');

router.post('/signup', userController.signup)
router.post('/signin', userController.signin);
// 첫 로그인 판단
//router.get('/:kakaoId', userController.isFirstLogin);
// 취향 수정하기
//router.put('/:kakaoId', userController.updateExPrefer);

module.exports = router;