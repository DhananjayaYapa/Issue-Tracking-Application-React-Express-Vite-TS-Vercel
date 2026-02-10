/**
 * Authentication Middleware
 * =========================
 * JWT authentication and authorization middleware
 *
 * Adapted from: olympus-backend-services/express-server/middleware/auth.js
 * Key difference: Using real JWT verification instead of mock auth
 */

const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("./errorHandler");

/**
 * Authenticate User Middleware
 * Verifies JWT token and attaches user to request
 *
 * Usage: router.get('/protected', authenticate, controller.method)
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("No authorization token provided");
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError(
        "Invalid authorization header format. Use: Bearer <token>",
      );
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token has expired"));
    }
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Verifies JWT if present, but doesn't require it
 * Useful for routes that work differently for authenticated vs anonymous users
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No token provided, but that's okay for this route
      req.user = null;
      return next();
    }

    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || "user",
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, treat as anonymous user
    req.user = null;
    next();
  }
};

/**
 * Generate JWT Token
 * Creates a new JWT token for a user
 *
 * @param {Object} user - User object with userId, email, name
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user.user_id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Decode Token (without verification)
 * Useful for getting user info even from expired tokens
 *
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Role-Based Authorization Middleware
 * Checks if the authenticated user has one of the allowed roles
 * Must be used AFTER the authenticate middleware
 *
 * Usage: router.get('/admin-only', authenticate, authorize('admin'), controller.method)
 * Usage: router.get('/shared', authenticate, authorize('admin', 'user'), controller.method)
 *
 * @param {...string} allowedRoles - Roles that are permitted to access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  generateToken,
  decodeToken,
};
