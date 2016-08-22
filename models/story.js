module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    storyid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    caption1: {
      notNull: true,
      type: DataTypes.STRING
    },
    caption2: {
      notNull: true,
      type: DataTypes.STRING
    },
    caption3: {
      notNull: true,
      type: DataTypes.STRING
    },
    caption4: {
      notNull: true,
      type: DataTypes.STRING
    }
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true
  });
  return Story;
};