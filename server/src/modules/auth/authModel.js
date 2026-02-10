const { User } = require("../../config/db/models");
const { Op } = require("sequelize");

class AuthModel {
  /**
   * Create a new user
   * @param {Object} userData - { name, email, passwordHash }
   * @returns {Promise<Object>} - Created user with userId
   */
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

  /**
   * Find user by email (includes password for auth)
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null
   */
  static async findByEmail(email) {
    const user = await User.scope("withPassword").findOne({
      where: {
        email,
        isEnabled: true,
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

  /**
   * Find user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} - User object (without password) or null
   */
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

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists
   */
  static async emailExists(email) {
    const count = await User.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Fields to update { name }
   * @returns {Promise<Object>} - Updated user
   */
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

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} passwordHash - New password hash (already hashed)
   * @returns {Promise<Object>} - Update result
   */
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

  /**
   * Soft delete user (disable account)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Update result
   */
  static async deleteUser(userId) {
    await User.update({ isEnabled: false }, { where: { userId } });
    return { user_id: userId };
  }

  /**
   * Get all users (for admin purposes)
   * @returns {Promise<Array>} - Array of user objects
   */
  static async getAllUsers() {
    const users = await User.findAll({
      where: { isEnabled: true },
      order: [["created_at", "DESC"]],
    });

    return users.map((user) => ({
      user_id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }
}

module.exports = AuthModel;
