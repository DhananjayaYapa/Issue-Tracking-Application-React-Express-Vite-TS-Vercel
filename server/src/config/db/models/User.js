const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../index");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: "Email already exists",
      },
      validate: {
        isEmail: { msg: "Invalid email format" },
        notEmpty: { msg: "Email is required" },
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: {
          args: [["admin", "user"]],
          msg: "Role must be either admin or user",
        },
      },
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_enabled",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // Default scope excludes password
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // Include password for authentication
      withPassword: {
        attributes: { include: ["passwordHash"] },
      },
    },
  },
);

// verify password
User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

//hash password
User.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = User;
