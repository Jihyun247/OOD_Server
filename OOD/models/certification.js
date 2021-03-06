module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Certification', {

        ex_time: { // 운동시간
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        certi_sport: { // 운동종목
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ex_intensity: { // 운동강도
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        ex_evalu: { // 운동평가선택
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ex_comment: { // 운동코멘트
            type: DataTypes.TEXT(),
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    });
};