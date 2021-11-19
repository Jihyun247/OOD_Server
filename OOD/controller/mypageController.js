const util = require('../modules/util');
const code = require('../modules/statusCode');
const message = require('../modules/responseMessage');

const { User, Sport, Certification, CertiImage, CertiSport } = require('../models');
const {Op} = require('sequelize');
const dateService = require('../service/dateService');
const certiService = require('../service/certiService');


module.exports = {

    getAllCerti : async (req,res) => {

        const user_id = req.decoded.id;
        if (!user_id) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }
        try {

            let certiList = await Certification.findAll({
                where : {
                    user_id
                },
                attributes : ['id', 'user_id', 'created_at'],
                order : [['created_at', 'DESC']],
                raw : true,
            });

           certiList = await certiService.formatCertiList(certiList);
           
           return res.status(code.OK).send(util.success(code.OK, message.GET_ALL_CERTILIST_SUCCESS, certiList));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }

    },

    updateExCycle : async (req,res) => {

        const user_id = req.decoded.id;
        const ex_cycle = req.body.ex_cycle;
        if (!user_id || !ex_cycle) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }

        try {

            const changeCycle = await User.update({ex_cycle}, {
                where : {
                    id : user_id
                }
            });

            res.status(code.OK).send(util.success(code.OK, message.UPDATE_CYCLE_SUCCESS));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },

    getMypageInfo : async (req,res) => {

        const user_id = req.decoded.id;
        if (!user_id) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }

        try {
            
            // 달성률 계산
            const user = await User.findByPk(user_id);
            const achive_rate = parseInt((user.week_count / user.ex_cycle) * 100);

            // 기록 게시물 총 개수
            const total_certi_count = await Certification.count({
                where : {
                    user_id
                }
            });

            res.status(code.OK).send(util.success(code.OK, message.GET_MYPAGE_INFO_SUCCESS, {achive_rate, total_certi_count}));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },
}



