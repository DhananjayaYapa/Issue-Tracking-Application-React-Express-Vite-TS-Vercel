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
        isEnabled: user.is_enabled,
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

  //delete user (disable) - admin only
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const adminUserId = req.user.userId;

      if (parseInt(id) === adminUserId) {
        return badRequestResponse(res, "Cannot disable your own admin account");
      }

      const user = await AuthModel.findByIdIncludingDisabled(parseInt(id));
      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      if (user.role === "admin") {
        return forbiddenResponse(res, "Cannot disable another admin account");
      }

      if (!user.is_enabled) {
        return badRequestResponse(res, "User is already disabled");
      }

      await AuthModel.deleteUser(parseInt(id));

      return successResponse(res, null, "User disabled successfully");
    } catch (error) {
      next(error);
    }
  }

  // Enable user - admin only
  static async enableUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await AuthModel.findByIdIncludingDisabled(parseInt(id));
      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      if (user.is_enabled) {
        return badRequestResponse(res, "User is already enabled");
      }

      await AuthModel.enableUser(parseInt(id));

      return successResponse(res, null, "User enabled successfully");
    } catch (error) {
      next(error);
    }
  }

  // Permanently delete user and their issues - admin only
  static async permanentDeleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const adminUserId = req.user.userId;

      if (parseInt(id) === adminUserId) {
        return badRequestResponse(res, "Cannot delete your own admin account");
      }

      const user = await AuthModel.findByIdIncludingDisabled(parseInt(id));
      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      if (user.role === "admin") {
        return forbiddenResponse(res, "Cannot delete another admin account");
      }

      const result = await AuthModel.permanentDeleteUser(parseInt(id));

      return successResponse(
        res,
        { deletedIssues: result.deleted_issues },
        `User and ${result.deleted_issues} related issue(s) permanently deleted`,
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
