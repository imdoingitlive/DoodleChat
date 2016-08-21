module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        // Not sure if any info is needed here
        // The Storyboard may only be needed to
        // manage the associations.
    }, {
        classMethods: {
            associate: function(models) {
                // Many users collaborate on one Storyboard
                Session.hasMany(models.User);
                // One Story is used for the Storyboard
                Session.hasOne(models.Story);
                // A Storyboard has one Image per User
                // Since there are many users collaborators
                // i.e. users, there will be many User/Images
                // for one Storyboard
                Session.hasMany(models.UserSketch);
            }
        }
    });
    return Session;
};