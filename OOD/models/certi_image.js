const Certification = require('./certification')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('CertiImage', {
        certi_id: { // 인증게시물 주키
            type: DataTypes.INTEGER,
            reference: {
                model: Certification,
                key: 'id',
            }
        },
        image: { // 인증 게시물 사진
            type: DataTypes.STRING(200),
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    });
};