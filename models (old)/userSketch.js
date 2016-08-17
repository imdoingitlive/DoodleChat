module.exports = function(sequelize, DataTypes) {
    var UserSketch = sequelize.define('UserSketch', {
        sketchUrl: {
            type: DataTypes.STRING 
        }
    }, {
        classMethods: {
            associate: function(models) {
                // One Image is created by One User 
                // during One Session for One Part of the Story
                UserSketch.belongsTo(models.Storyboard);
                UserSketch.hasOne(models.StoryPart);
                UserSketch.hasOne(models.User);
            }
        }
    });
    return UserSketch;
};