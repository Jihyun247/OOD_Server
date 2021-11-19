module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {

        nickname: { // 닉네임
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: 'nickname'
        },
        email: { // 이메일
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: { // 카카오톡 회원 id
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        ex_cycle: { // 운동 주기
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        week_count: { // 주 운동 횟수
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profile_img: { // 프로필 이미지
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ex_intensity: { // 운동 목표
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        current_group_id: { // 현재 속한 그룹 id
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: true,
    });
};