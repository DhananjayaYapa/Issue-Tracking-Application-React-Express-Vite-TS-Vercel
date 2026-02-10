const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

const createdResponse = (res, data, message = 'Resource created successfully') => {
    return successResponse(res, data, message, 201);
};

const noContentResponse = (res) => {
    return res.status(204).send();
};

const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, message, 404);
};

const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return errorResponse(res, message, 401);
};

const forbiddenResponse = (res, message = 'Access forbidden') => {
    return errorResponse(res, message, 403);
};

const badRequestResponse = (res, message = 'Bad request', errors = null) => {
    return errorResponse(res, message, 400, errors);
};

module.exports = {
    successResponse,
    errorResponse,
    createdResponse,
    noContentResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    badRequestResponse
};
