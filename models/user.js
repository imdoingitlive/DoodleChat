module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING 
        }
        email: {
            type: DataTypes.STRING
        }
        userName: {
            notNull: true;
            type: DataTypes.STRING
        }
        password: {
            notNull: true;
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {
                User.belongsToMany(models.Storyboard)
            }
        }
    });
    return User;
};