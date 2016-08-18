module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    // firstName: {
    //     type: DataTypes.STRING
    // },
    // lastName: {
    //     type: DataTypes.STRING 
    // },
    // email: {
    //     type: DataTypes.STRING
    // },
    username: {
      notNull: true,
      type: DataTypes.STRING
    },
    password: {
      notNull: true,
      type: DataTypes.STRING
    }
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Group, {
          through: models.UserGroup
        })
      }
    }
  });
  return User;
};