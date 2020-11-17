"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,  // TODO: make unique, also in migrations!
      password: DataTypes.STRING,
      age: DataTypes.STRING,   // TODO: not string, but number
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
