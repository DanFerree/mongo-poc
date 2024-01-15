import { ObjectId } from 'mongodb';
import log from '../middleware/logging.middleware';
import { Request, Response } from 'express';

export class NotFoundError extends Error {
    code: number;
    message: string;

    constructor(id: ObjectId, resourceName: string = 'Resource') {
        super();
        this.code = 404;
        this.message = `${resourceName} with id: ${id} not found`;
    }
}

export class BadRequestError extends Error {
    code: number;
    message: string;
    detail: object;

    constructor(message: string, detail: object = {}) {
        super();
        this.code = 400;
        this.message = message;
        this.detail = detail;
    }
}

export class InternalServerError extends Error {
    code: number;
    message: string;

    constructor(error: Error) {
        super();
        this.code = 500;
        this.message = "Internal Server Error";
        log.error(error);
    }
}

export class UnauthorizedError extends Error {
    code: number;
    message: string;

    constructor(message: string) {
        super();
        this.code = 401;
        this.message = message;
    }
}

export class ForbiddenError extends Error {
    code: number;
    message: string;

    constructor(message: string) {
        super();
        this.code = 403;
        this.message = message;
    }
}

export class ConflictError extends Error {
    code: number;
    message: string;

    constructor(message: string) {
        super();
        this.code = 409;
        this.message = message;
    }
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
    if (err instanceof NotFoundError ||
        err instanceof BadRequestError ||
        err instanceof InternalServerError ||
        err instanceof UnauthorizedError ||
        err instanceof ForbiddenError ||
        err instanceof ConflictError) {
        res.status(err.code).json(err).end();
    } else {
        // Handle other types of errors or fallback to a generic error response
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
        }).end();
    }
};
