const { Group, Certification, CertiImage, Join, User, CertiSport, Sport, Like  }  = require('../models/');
const dateService = require('./dateService');
const {Op} = require('sequelize');
const moment = require('moment');

module.exports = {

    getImageUrl: async (files) => {
        try {
            // 원래 여러개인데 임시적으로 하나 받아오도록 바꿈 (이름 통일안됨)
            // if (files) {

            //     let imageArray = [];
            //     let image = "";
            //     for (file of files) {
            //         image = file.location
            //         imageArray.push(image);
            //     }
            //     return imageArray;
            // }
            if (files) {
                const image = files.location;
                return image;
            }
            return null;
        } catch (err) {
            console.error(err);
        }
    },

    // addImages: async (certi_id, imageArray) => {

    //     let file = ""
    //     console.log(imageArray);
    //     for (image of imageArray) {
    //         file = await CertiImage.create({
    //             certi_id,
    //             image
    //         })
    //     }

    //     return 1;

    // },

        addImages: async (certi_id, image) => {

        // let file = ""
        // console.log(image);
        // for (image of imageArray) {
        //     file = await CertiImage.create({
        //         certi_id,
        //         image
        //     })
        // }
        console.log(image)
        let file = await CertiImage.create({
            certi_id,
            image
        })
        return 1;

    },

    formatCerti : async (user_id, certi_id) => {
        try {

            // 인증 게시물 올린 유저
            const user = await User.findOne({
                where : {
                    id: user_id
                },
                attributes : ['id', 'nickname']

            })

            const certi = await Certification.findOne({
                where : {
                    id : certi_id,
                    user_id
                },
                attributes : ['ex_time', 'certi_sport', 'ex_intensity', 'ex_evalu', 'ex_comment', 'user_id', 'created_at'],
                raw : true,
            });
            certi.parse_date = await dateService.parseDate(certi.created_at);
            
            // 인증 게시물에 포함된 인증 사진들
            let images = await CertiImage.findAll({
                where : {
                    certi_id,
                },
                attributes : ['image']
            });
            images = images.map(i => i.image)
            const certiImages = images.join()

            certi.certi_images = certiImages;
            if (!certiImages) {
                certi.certi_images = ""
            }

            // 운동 종목
            // let sports = await CertiSport.findAll({
            //     where : {
            //         certi_id,
            //     },
            //     attributes : ['sport_id']
            // });
            // sports = sports.map(s => s.sport_id)
            // const certiSports = sports.join()
            //certi.sports = certiSports;

            return {user, certi}

        } catch (err) {
            throw err;
        }
    },

    formatCertiList : async (certiList) => { // certi image & user name

        try {

            for (certi of certiList) {
                
                let certiUser = await User.findOne({
                    where : {
                        id : certi.user_id
                    },
                    attributes : ['nickname'],
                    raw: true,
                });
                certi.user_nickname = certiUser.nickname;
                
                let certiImage = await CertiImage.findOne({
                    where : {
                        certi_id : certi.id
                    }, 
                    attributes : ['image']
                });

                if (certiImage) {
                    certi.image = certiImage.image;
                } else {
                    certi.image = "";
                }

            }

            return certiList;

        } catch (err) {
            throw err;
        }
    },

    saveCertiSport : async (certi_id, certi_sport) => {

        console.log(certi_sport)
        const certiSports = certi_sport.split(",");
        for (sport_id of certiSports) {

            //  인증 운동종목 저장
            let newCertiSports = await CertiSport.create({
                certi_id,
                sport_id
            });
        }

        return 1;
    },

    reduceCount : async (user_id, certi_date) => {

        let now = new Date();
        now.setHours(now.getHours() + 9)

        const nowDayOfWeek = now.getDay();
        const nowDay = now.getDate();
        const nowMonth = now.getMonth();
        let nowYear = now.getYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        weekStartDate = new Date(moment(weekStartDate).format('YYYY-MM-DD'));
        let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek) + 1);
        weekEndDate = new Date(moment(weekEndDate).format('YYYY-MM-DD'));

        if (weekStartDate <= certi_date && certi_date <= weekEndDate) {

            //reduce Count
            const user = await User.findByPk(user_id)
            const updateCount = User.update({week_count:user.week_count-1}, {
                where : {
                    id: user_id,
                }
            })
        }

        return 1;
    }


}