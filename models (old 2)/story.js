"use strict";

module.exports = function(sequelize, DataTypes) {
    var Story = sequelize.define('Story', {
        name: {
            type: DataTypes.STRING 
        }
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'Stories',
        classMethods: {
            associate: function(models) {
                Story.hasMany(models.Page, {as: 'pages'});
            }
        }
    });
    return Story;
};

