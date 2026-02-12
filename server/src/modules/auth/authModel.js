const { User } = require("../../config/db/models");
const { Issue } = require("../../config/db/models");
const { Op } = require("sequelize");

class AuthModel {
 //create new user
  static async createUser(userData) {
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
    });

    return {
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }

  //find user by email
  static async findByEmail(email) {
    const user = await User.scope("withPassword").findOne({
      where: {
        email,
      },
    });

    if (!user) return null;

    return {
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      password_hash: user.passwordHash,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_enabled: user.isEnabled,
    };
  }

  //find user by id (only enabled users)
  static async findById(userId) {
    const user = await User.findOne({
      where: {
        userId,
        isEnabled: true,
      },
    });

    if (!user) return null;

    return {
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  // Check if email exists
  static async emailExists(email) {
    const count = await User.count({
      where: { email },
    });
    return count > 0;
  }
  static async emailExists(email) {
    const count = await User.count({
      where: { email },
    });
    return count > 0;
  }

  //update user details
  static async updateUser(userId, userData) {
    await User.update(
      { name: userData.name },
      { where: { userId, isEnabled: true } },
    );

    const user = await User.findByPk(userId);
    return {
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      updated_at: user.updated_at,
    };
  }

  //update user password
  static async updatePassword(userId, passwordHash) {
    const [affectedRows] = await User.update(
      { passwordHash },
      {
        where: { userId, isEnabled: true },
        individualHooks: false,
      },
    );
    return { user_id: userId };
  }

  //delete user (soft delete by disabling)
  static async deleteUser(userId) {
    await User.update({ isEnabled: false }, { where: { userId } });
    return { user_id: userId };
  }

  //enable user
  static async enableUser(userId) {
    await User.update({ isEnabled: true }, { where: { userId } });
    return { user_id: userId };
  }

  //permanently delete user
  static async permanentDeleteUser(userId) {
    // Delete all issues created by the user first
    const deletedIssuesCount = await Issue.destroy({
      where: { createdBy: userId },
    });

    // Then delete the user
    await User.destroy({ where: { userId } });

    return { user_id: userId, deleted_issues: deletedIssuesCount };
  }

  //get all users
  static async getAllUsers() {
    const users = await User.findAll({
      order: [["created_at", "DESC"]],
    });

    return users.map((user) => ({
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      is_enabled: user.isEnabled,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  //find user by id
  static async findByIdIncludingDisabled(userId) {
    const user = await User.findOne({
      where: { userId },
    });

    if (!user) return null;

    return {
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      is_enabled: user.isEnabled,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

module.exports = AuthModel;
