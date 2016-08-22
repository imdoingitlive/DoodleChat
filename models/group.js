module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    groupname: {
      notNull: true,
      type: DataTypes.STRING
    },
    completed: {
      notNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
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