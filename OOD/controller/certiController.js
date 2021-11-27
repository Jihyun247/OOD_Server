const util = require('../modules/util');
const code = require('../modules/statusCode');
const message = require('../modules/responseMessage');
const moment = require('moment');

const { User, Sport, Certification, CertiImage, CertiSport } = require('../models');
const {Op} = require('sequelize');
const dateService = require('../service/dateService');
const certiService = require('../service/certiService');

module.exports = {

    // iOS 인증게시물 사진 post
    postCertiImage : async (req, res) => {

        const certi_id = req.params.certiId;
        const image = await certiService.getImageUrl(req.file);
        if ( !certi_id || !image ) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }
        try {
            
            console.log(image)
            const addImages = await certiService.addImages(certi_id, image);

            return res.status(code.OK).send(util.success(code.OK, message.POST_CERTI_IMAGE_SUCCESS));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },

    // iOS 인증게시물 사진 제외 정보 post
    postCertiBody : async (req, res) => {

        const user_id = req.decoded.id;
            let { ex_time, ex_intensity, ex_evalu, ex_comment, certi_sport } = req.body;
            //console.log(req.body)
            if (!user_id || !ex_time || !ex_intensity || !ex_evalu || !certi_sport) {
                return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
            }

        try {

            // 기록 생성
            const newCerti = await Certification.create({
                ex_time,
                certi_sport,
                ex_intensity,
                ex_evalu,
                ex_comment,
                user_id,
            })
            const id = newCerti.id

            // add Count
            const user = await User.findByPk(user_id)
            const updateCount = User.update({week_count:user.week_count+1}, {
                where : {
                    id: user_id,
                }
            })

            // 기록 운동 종목 저장
            //const saveCertiSport = await certiService.saveCertiSport(id, certi_sport);

            return res.status(code.OK).send(util.success(code.OK, message.POST_CERTI_BODY_SUCCESS, id));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },

    // iOS 기록 게시물 수정
    updateCerti: async (req, res) => {

        const user_id = req.decoded.id;
        const { certi_id, ex_time, ex_intensity, ex_evalu, ex_comment, certi_sport } = req.body;
        //console.log(req.body)
        if (!user_id || !ex_time || !ex_intensity || !ex_evalu || !certi_sport) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }

        try {

            const updateContent = {ex_time, certi_sport, ex_intensity, ex_evalu, ex_comment};
            const changedCerti = await Certification.update(updateContent, {
                where : {
                    id : certi_id,
                    user_id
                }
            });

            // const deleteCertiSport = await CertiSport.destroy({
            //     where: {
            //         certi_id
            //     }

            // });
            // const saveCertiSport = await certiService.saveCertiSport(certi_id, certi_sport);

            res.status(code.OK).send(util.success(code.OK, message.UPDATE_CERTI_SUCCESS));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
        
    },

    // iOS 기록 게시물 삭제
    deleteCerti : async (req, res) => {

        const certi_id = req.params.certiId;
        const user_id = req.decoded.id;

        if (!certi_id || !user_id) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }
        try {

            const certi = await Certification.findByPk(certi_id);
            if (certi.user_id != user_id) {
                return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.USER_UNAUTHORIZED));
            }
            const certi_date = await dateService.formatDate(certi.createdAt);
            const reduceCount = await certiService.reduceCount(user_id, certi_date);

            const deleteCerti = await Certification.destroy({
                where : {
                    id: certi_id
                }
            });
            const deleteCertiImage = await CertiImage.destroy({
                where : { 
                    certi_id
                }
            });
            // const deleteCertiSport = await CertiSport.destroy({
            //     where : {
            //         certi_id
            //     }
            // });

            return res.status(code.OK).send(util.success(code.OK, message.DELETE_COMMENT_SUCCESS));


        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }

    },

    // iOS 주간캘린더 별 인증게시물 조회
    getCertiByCal : async (req, res) => {

        const user_id = req.decoded.id;
        const date = req.query.date;
        if (!date) {
            return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
        }
        try {

            let startDate = date + " 00:00:00";
            startDate = Date.parse(startDate);
            let endDate = date + " 23:59:59";
            endDate = Date.parse(endDate);

            
            let certiList = await Certification.findAll({
                where : {
                    user_id,
                    created_at : {
                        [Op.between] : [startDate, endDate]
                    }
                },
                attributes : ['id', 'user_id', 'created_at'],
                order : [['created_at', 'DESC']],
                raw : true,
            });

           certiList = await certiService.formatCertiList(certiList);
           
           return res.status(code.OK).send(util.success(code.OK, message.GET_DATE_CERTILIST_SUCCESS, certiList));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },

    // iOS 인증게시물 상세 조회
    getCertiDetail : async (req, res) => {

        const user_id = req.decoded.id;
        const certi_id = req.params.certiId;

            if (!certi_id || !user_id) {
                return res.status(code.BAD_REQUEST).send(util.fail(code.BAD_REQUEST, message.NULL_VALUE));
            }

        try {

            const formatCerti = await certiService.formatCerti(user_id, certi_id);

            return res.status(code.OK).send(util.success(code.OK, message.GET_CERTIDETAIL_SUCCESS, formatCerti));

        } catch (err) {
            console.error(err);
            return res.status(code.INTERNAL_SERVER_ERROR).send(util.fail(code.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
        }
    },
}