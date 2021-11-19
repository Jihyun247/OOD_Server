const util = require('../modules/util');
const code = require('../modules/statusCode');
const message = require('../modules/responseMessage');
const jwt = require('../modules/jwt')
const { User, UserSport, Sport, Certification } = require('../models');
const {Op} = require('sequelize');
const userService = require('../service/userService');
const certiService = require('../service/certiService');

const sch = require('node-schedule');
const rule = new sch.RecurrenceRule();

// 매주 월요일 오전 12시 마다 Join achive_rate 초기화
// const schedule = sch.scheduleJob('0 0 * * 1', async () => {
//     try {

//         const updateJoin = await Join.update

//     } catch (err) {
//         console.log(err);
//     }
// })

module.exports = {

    // iOS 회원가입
    signup: async (req, res) => {
        const { email, nickname, password, ex_cycle} = req.body;
        
        if (!email || !password || !nickname || !ex_cycle) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }

        try {
            // 이미 존재하는 email, nickname 인지 확인
            const paramsExist = await userService.isEmailNicknameExist(email, nickname);
            if ( paramsExist ) {
                return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, paramsExist));
            }

            // hashedPassword 생성
            const {salt, hashedPassword} = await userService.hashPassword(password);
            
            
            //const image = await userService.getImageUrl(req.file);
             
            const user = await User.create({
                nickname,
                email,
                password: hashedPassword,
                salt,
                ex_cycle,
                week_count: 0,
                //profile_img : image,
            });
            
            return res.status(code.CREATED).send(util.success(code.CREATED, message.SIGN_UP_SUCCESS, {id : user.id, email : user.email, nickname : user.nickname, ex_cycle : user.ex_cycle}));
            
        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },

    // iOS 로그인
    signin : async (req, res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }
        try {
            //const image = await certiService.getImageUrl(req.file);

            const user = await User.findOne({
                where : {
                    email
                },
            });
            if (!user) {
                return res.status(code.BAD_REQUEST).send(util.failWithData(code.BAD_REQUEST, message.NO_USER, { token : null }));
            }

            const isValidPassword = await userService.isValidPassword(user, password)
            if (!isValidPassword) {
                return res.status(code.BAD_REQUEST).send(util.failWithData(code.BAD_REQUEST, message.MISS_MATCH_PW, { token : null }));
            }

            const { token } = await jwt.sign(user);

            return res.status(code.OK).send(util.success(code.OK, message.USER_LOGIN_SUCCESS, { token }));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },
}