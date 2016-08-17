module.exports = function(sequelize, DataTypes) {
    var Story = sequelize.define('Story', {
        name: {
            type: DataTypes.STRING 
        }
    }, {
        classMethods: {
            associate: function(models) {
                Story.hasMany(models.StoryPart {as: parts});
            }
        }
    });
    return Story;
};