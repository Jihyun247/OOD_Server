const { Group, Join }  = require('../models/');
const moment = require('moment');

const getTodayDate = async () => {
    const td = Date.now();
    const today = new Date(td);
    return new Date(moment.tz(today, 'Asia/Seoul').format());
};

module.exports = {

    getTodayDateOnly : async () => {
        const td = Date.now();
        const today = new Date(td);
        return new Date(moment.tz(today, 'Asia/Seoul').format('YYYY-MM-DD'));
    },

    formatDate: async (date) => {
        const d = new Date(date);
        return new Date(moment.tz(d, 'Asia/Seoul').format('YYYY-MM-DD'));
    },

    parseDate : async (date) => {
    
        try {
            const today = await getTodayDate();
            let td = today;
            if (! date) {
                return null
            }
        
            const diff = td.getTime()- date.getTime();
            const minDiff = diff / 60000;
            
            if (minDiff < 60) {
                return parseInt(minDiff) + '분 전';
            }
            const hrDiff = diff / 3600000;
            if (hrDiff < 24) {
                return parseInt(hrDiff) + '시간 전';
            }
            const dayDiff = hrDiff / 24;
            if (dayDiff < 365) {
                return (moment.tz(date, 'Asia/Seoul').format('M월 D일'));
            }
            return (moment.tz(date, 'Asia/Seoul').format('YYYY년 M월 D일'));
    
        } catch (err) {
            console.error(err);
            throw err;
        }
    
    }
}