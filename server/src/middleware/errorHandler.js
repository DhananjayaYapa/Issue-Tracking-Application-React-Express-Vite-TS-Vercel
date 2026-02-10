const { errorResponse } = require('../shared/utils/responseHelper');
class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

//not found error
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

//validation error
class ValidationError extends ApiError {
    constructor(message = 'Validation failed', errors = null) {
        super(message, 400);
        this.errors = errors;
    }
}

//unauthorized error
class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

//forbidden error
class ForbiddenError extends ApiError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}

//Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error('='.repeat(50));
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('='.repeat(50));

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    // Handle specific error types
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    } else if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry - resource already exists';
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
        statusCode = 500;
        message = 'Database table not found';
    }

    // In production, don't expose internal error details
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        message = 'An unexpected error occurred';
        errors = null;
    }

    return errorResponse(res, message, statusCode, errors);
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
    return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    ApiError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    errorHandler,
    notFoundHandler,
    asyncHandler
};
