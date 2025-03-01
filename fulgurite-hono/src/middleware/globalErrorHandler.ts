import { Context, Env, ErrorHandler, HonoRequest } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import createHttpError from 'http-errors';
import HTTPStatus from 'http-status';

export function getRequestDetails(req: HonoRequest) {
    return {
        url: req.url,
        method: req.method,
        headers: req.header(),
        body: req.parseBody(),
        query: req.query(),
        params: req.param(),
    };
}

export function handleHttpError(
    err: createHttpError.HttpError,
    c: Context,
    // biome-ignore lint/suspicious/noExplicitAny: used for logging
    logger: (msg: string, extra?: any) => void,
    extended?: boolean,
) {
    const body = {
        statusCode: err.statusCode,
        message: err.status.toString(),
        err: {},
        details: {},
    };

    if (err.expose) {
        body.message = err.message;
    }

    if (extended) {
        body.err = {
            message: err.message,
            stack: err.stack,
        };
        body.details = getRequestDetails(c.req);
    }
    logger(err.message, { http: body, stack: err.stack, ...getRequestDetails(c.req) });
    return c.json(body, err.statusCode as ContentfulStatusCode);
}

// TODO jod validate Error

export function handleUnknownError(
    err: Error,
    c: Context,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    logger: (msg: string, extra?: any) => void,
    extended?: boolean,
) {
    const body = {
        statusCode: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR] as string,
        err: {},
        details: {},
    };

    if (extended) {
        body.message = err.message;
        body.err = {
            message: err.message,
            stack: err.stack,
        };
        body.details = getRequestDetails(c.req);
    }
    logger(err.message, { http: body, stack: err.stack, ...getRequestDetails(c.req) });
    return c.json(body, 500);
}

// biome-ignore lint/suspicious/noExplicitAny:
export function globalErrorHandler<T extends Env = any>({
    logger,
    extended,

    // biome-ignore lint/suspicious/noExplicitAny: handling for various unknown environment constraints
}: { logger?: (msg: string, extra?: any) => void; extended?: boolean } = {}): ErrorHandler<T> {
    return function errorHandlerMiddleware(err, c) {
        // TODO add jod validate Error
        if (createHttpError.isHttpError(err)) {
            return handleHttpError(err, c, logger || console.log, extended);
        } else {
            return handleUnknownError(err, c, logger || console.log, extended);
        }
    } as ErrorHandler;
}

export default globalErrorHandler;
