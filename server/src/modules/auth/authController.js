const bcrypt = require("bcryptjs");
const AuthModel = require("./authModel");
const { generateToken } = require("../../middleware/auth");
const {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  forbiddenResponse,
} = require("../../shared/utils/responseHelper");
const {
  ValidationError,
  UnauthorizedError,
} = require("../../middleware/errorHandler");

const SALT_ROUNDS = 10;

class AuthController {
  //register user
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await AuthModel.emailExists(email);
      if (existingUser) {
        return badRequestResponse(res, "Email already registered");
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const createdUser = await AuthModel.createUser({
        name,
        email,
        passwordHash,
      });

      // Generate JWT token
      const token = generateToken(createdUser);

      return createdResponse(
        res,
        {
          user: {
            userId: createdUser.user_id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
            createdAt: createdUser.created_at,
          },
          token,
        },
        "User registered successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  //login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await AuthModel.findByEmail(email);

      if (!user) {
        return unauthorizedResponse(res, "User not found with this email");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return unauthorizedResponse(res, "Invalid password");
      }

      // Generate JWT token
      const token = generateToken(user);

      return successResponse(
        res,
        {
          user: {
            userId: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEnabled: user.is_enabled,
          },
          token,
        },
        "Login successful",
      );
    } catch (error) {
      next(error);
    }
  }

  // Get authenticated user's profile
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;

      const user = await AuthModel.findById(userId);

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
        "Profile retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Update authenticated user's profile
  static async updateProfile(req, res, next) {
    try {
      // Check if user account is disabled
      if (req.user.isEnabled === false) {
        return forbiddenResponse(
          res,
          "Your account has been disabled. You cannot update your profile.",
        );
      }

      const userId = req.user.userId;
      const { name } = req.body;

      await AuthModel.updateUser(userId, { name });

      const user = await AuthModel.findById(userId);

      return successResponse(
        res,
        {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          updatedAt: user.updated_at,
        },
        "Profile updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Change authenticated user's password
  static async changePassword(req, res, next) {
    try {
      // Check if user account is disabled
      if (req.user.isEnabled === false) {
        return forbiddenResponse(
          res,
          "Your account has been disabled. You cannot change your password.",
        );
      }

      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await AuthModel.findByEmail(req.user.email);

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return badRequestResponse(res, "Current password is incorrect");
      }

      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await AuthModel.updatePassword(userId, passwordHash);

      return successResponse(res, null, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
