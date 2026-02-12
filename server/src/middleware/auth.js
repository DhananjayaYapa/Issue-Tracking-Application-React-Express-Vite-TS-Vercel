const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("./errorHandler");

const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("No authorization token provided");
    }

    // Expected format
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError(
        "Invalid authorization header format. Use: Bearer <token>",
      );
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || "user",
      isEnabled: decoded.isEnabled !== false,
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

//Optional Authentication Middleware
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
        isEnabled: decoded.isEnabled !== false,
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid
    req.user = null;
    next();
  }
};

//Generate JWT Token
const generateToken = (user) => {
  const payload = {
    userId: user.user_id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    isEnabled: user.is_enabled !== false,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

//Decode JWT Token
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

//Role-Based Authorization Middleware
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

//Require Enabled User Middleware
const requireEnabled = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.user.isEnabled === false) {
    return next(
      new ForbiddenError(
        "Your account has been disabled. You cannot perform this action.",
      ),
    );
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  requireEnabled,
  generateToken,
  decodeToken,
};
