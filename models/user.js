module.exports = function(sequelize, DataTypes) {
<<<<<<< HEAD
    var User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING 
        }
        email: {
            type: DataTypes.STRING
        }
        userName: {
            notNull: true;
            type: DataTypes.STRING
        }
        password: {
            notNull: true;
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {
                User.belongsToMany(models.Storyboard)
            }
        }
    });
    return User;
=======
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
    // classMethods: {
    //   associate: function(models) {
    //     User.hasOne(models.Session)
    //   }
    // }
  });
  return User;
>>>>>>> d14ac130f0b9a5065f7a3c7d3441d6de6815082a
};