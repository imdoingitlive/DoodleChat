module.exports = function(sequelize, DataTypes) {
    var Storyboard = sequelize.define('Storyboard', {
        // Not sure if any info is needed here
        // The Storyboard may only be needed to
        // manage the associations.
    }, {
        classMethods: {
            associate: function(models) {
                // Many users collaborate on one Storyboard
                Storyboard.hasMany(models.User);
                // One Story is used for the Storyboard
                Storyboard.hasOne(models.Story);
                // A Storyboard has one Image per User
                Storyboard.hasOne(models.UserImage);
            }
        }
    });
    return Storyboard;
};