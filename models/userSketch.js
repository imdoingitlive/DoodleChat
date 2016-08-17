module.exports = function(sequelize, DataTypes) {
    var UserImage = sequelize.define('UserImage', {
        imageLink: {
            type: DataTypes.STRING 
        }
    }, {
        classMethods: {
            associate: function(models) {
                // One Image is created by One User 
                // during One Session for One Part of the Story
                UserImage.belongsTo(models.Storyboard);
                UserImage.hasOne(models.StoryPart);
                UserImage.hasOne(models.User);
            }
        }
    });
    return UserImage;
};