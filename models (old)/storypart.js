module.exports = function(sequelize, DataTypes) {
    var StoryPart = sequelize.define('StoryPart', {
        text: {
            type: DataTypes.STRING 
        }
    }, {
        classMethods: {
            associate: function(models) {
                StoryPart.belongsTo(models.Story)
            }
        }
    });
    return StoryPart;
};