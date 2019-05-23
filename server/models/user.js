'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_\-]+$/i,
      }
    },
    password: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) =>{
    User.hasMany(models.recipe, {
      foreignKey: 'userId',
      as: 'recipes'
    });
  };
  return User;
};