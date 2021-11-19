var express = require('express');
var router = express.Router();

router.use('/certi', require('./certi'));
router.use('/mypage', require('./myPage'));
router.use('/user', require('./user'));

module.exports = router;
