"use strict";

module.exports = function(sequelize, DataTypes) {
    var Caption = sequelize.define('Caption', {
        text: {
            type: DataTypes.STRING 
        }
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'Captions',
        classMethods: {
            associate: function(models) {
                Caption.belongsTo(models.Story, {as: 'story'});
            }
        }
    });
    return Caption;
};