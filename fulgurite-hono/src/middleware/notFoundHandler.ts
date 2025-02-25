import { Env, HonoRequest, NotFoundHandler } from 'hono';
import HTTPStatus from 'http-status';
import _ from 'lodash';

// biome-ignore lint/suspicious/noExplicitAny: handling for various unknown environment constraints
export function notFoundHandler<T extends Env = any>({
    logger,
    log,
    extended,
}: {
    logger?: (message: string) => void;
    log?: (req: HonoRequest) => void;
    extended: boolean | Array<string>;
}): NotFoundHandler<T> {
    return function notFoundHandlingMiddleware(c) {
        if (log) {
            log(c.req);
        } else {
            const notFoundMessage = `Not Found: ${c.req.url}, method: ${c.req.method}, \nheaders: ${JSON.stringify(c.req.header())}\nbody: ${JSON.stringify(c.req.parseBody)}\nquery: ${JSON.stringify(c.req.query())}\nparams: ${JSON.stringify(c.req.param())}`;
            if (logger) {
                logger(notFoundMessage);
            } else {
                console.log(notFoundMessage);
            }
        }
        if (Array.isArray(extended)) {
            c.json(
                {
                    status: HTTPStatus.NOT_FOUND,
                    error: 'route not found',
                    details: _.pick(
                        {
                            url: c.req.url,
                            method: c.req.method,
                            headers: c.req.header(),
                            body: c.req.parseBody,
                            query: c.req.query(),
                            params: c.req.param(),
                        },
                        extended,
                    ),
                },
                HTTPStatus.NOT_FOUND,
            );
        } else if (extended) {
            c.json({
                status: HTTPStatus.NOT_FOUND,
                error: 'route not found',
                details: {
                    url: c.req.url,
                    method: c.req.method,
                    headers: c.req.header(),
                    body: c.req.parseBody,
                    query: c.req.query(),
                    params: c.req.param(),
                },
            });
        } else {
            c.json({
                status: HTTPStatus.NOT_FOUND,
                error: 'route not found',
            });
        }
    } as NotFoundHandler;
}

export default notFoundHandler;
