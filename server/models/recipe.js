'use strict';
module.exports = function(sequelize, DataTypes) {
  const Recipe = sequelize.define('recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Recipe;
};