const log = require('./logging.middleware');

class NotFoundError extends Error {
    constructor(id, resourceName = 'Resource') {
        super();
        this.code = 404;
        this.message = `${resourceName} with id: ${id} not found`;
    }
}

class BadRequestError extends Error {
    constructor(message, detail = {}) {
        super();
        this.code = 400;
        this.message = message;
        this.detail = detail;
    }
}

class InternalServerError extends Error {
    constructor(error) {
        super();
        this.code = 500;
        this.message = "Internal Server Error";
        log.error(error);
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super();
        this.code = 401;
        this.message = message;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super();
        this.code = 403;
        this.message = message;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super();
        this.code = 409;
        this.message = message;
    }
}

const errorHandler = (err, _req, res) => {
    log.debug(`errorHandler(${JSON.stringify(err)})`);
    const errBody = {
        code: err.code || 500,
        message: err.message || "Internal Server Error",
    };
    if (err.detail) {
        errBody.detail = err.detail;
    }
    log.debug(`error response: ${JSON.stringify(errBody, null, 2)}`);
    res.status(err.code).json(errBody).end();
};

const errorSchema = {
    Error: {
        type: "object",
        properties: {
            code: { type: "number" },
            message: { type: "string" },
            detail: { type: "object" },
        },
        required: ["code", "message"],
    },
};

module.exports = {
    NotFoundError,
    BadRequestError,
    InternalServerError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    errorHandler,
    errorSchema,
};
