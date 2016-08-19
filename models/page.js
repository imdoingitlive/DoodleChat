"use strict";

module.exports = function(sequelize, DataTypes) {
    var Page = sequelize.define('Page', {
        imageUrl: {
            type: DataTypes.STRING 
        }
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'Pages',
        classMethods: {
            associate: function(models) {
                Page.hasOne(models.User, {as: 'author'});
                Page.hasOne(models.Caption, {as: 'caption'});
            }
        }
    });
    return Page;
};