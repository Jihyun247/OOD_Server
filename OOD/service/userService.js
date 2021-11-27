const { User, UserSport, Sport }  = require('../models/');
const message = require('../modules/responseMessage');
const crypto = require('crypto')
const dateService = require('./dateService');
const {Op} = require('sequelize');

const hashPassword =  async (password, salt = null) => {
    try {
        if (!salt) {
            salt = crypto.randomBytes(64).toString('base64');
        }
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        return {salt, hashedPassword};
    } catch (err) {
        console.error(err);
    }
}
// userService
module.exports = {
    isEmailNicknameExist: async (email, nickname) => {

        try {
            const alreadyNickname = await User.findOne({
                where : {
                    nickname
                }
            });
     
            if (alreadyNickname) {
                return message.ALREADY_NICKNAME;
            }

            const alreadyEmail = await User.findOne({
                where : {
                    email
                }
            });
     
            if (alreadyEmail) {
                return message.ALREADY_EMAIL;
            } 

            return null;
        } catch (err) {
            console.error(err);
        }
    },
    hashPassword,
    getImageUrl: async (file) => {
        try {
            if (file) {
                const image = file.location;
                return image;
            }
            return null;
        } catch (err) {
            console.error(err);
        }
    },
    isValidPassword: async (user, password) => {
        try {
            const { salt, password : hashedPassword } = user;
            const {hashedPassword : inputPassword} = await hashPassword(password, salt);
            if (inputPassword == hashedPassword) {
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
        }
    },

    setUserSports : async (user_id, sports) => {

        try {

            console.log(sports);
            const userSports = sports.split(",");
            for (sport of userSports) {

                // 스포츠 아이디 find
                let sportName = await Sport.findOne({
                    where : {
                        name: sport
                    },
                    attributes : ['id']
                })

                // 유저 취향 저장
                let newCertiSports = await UserSport.create({
                    user_id, 
                    sport_id : sportName.id
                });
            }

            return 1;

        } catch (err) {
            throw err;
        }

    },

}