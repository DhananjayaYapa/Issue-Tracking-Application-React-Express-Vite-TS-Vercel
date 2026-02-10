const AuthModel = require("../auth/authModel");
const {
  successResponse,
  notFoundResponse,
  badRequestResponse,
  forbiddenResponse,
} = require("../../shared/utils/responseHelper");

class UserController {
  //get all users  - admin only
  static async getAllUsers(req, res, next) {
    try {
      const users = await AuthModel.getAllUsers();

      const formattedUsers = users.map((user) => ({
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      return successResponse(
        res,
        formattedUsers,
        "Users retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  //get user by id - admin only
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await AuthModel.findById(parseInt(id));

      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      return successResponse(
        res,
        {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        "User retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  //delete user - admin only
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const adminUserId = req.user.userId;

      if (parseInt(id) === adminUserId) {
        return badRequestResponse(res, "Cannot delete your own admin account");
      }

      const user = await AuthModel.findById(parseInt(id));
      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      if (user.role === "admin") {
        return forbiddenResponse(res, "Cannot delete another admin account");
      }

      await AuthModel.deleteUser(parseInt(id));

      return successResponse(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
