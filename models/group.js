module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    groupname: {
      notNull: true,
      type: DataTypes.STRING
    },
    totalusers: {
      notNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    completed: {
      notNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    storyID: {
      notNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    part: {
      notNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    classMethods: {
      associate: function(models) {
        Group.belongsToMany(models.User, {
          through: models.UserGroup
        })
      }
    }
  });
  return Group;
};