import util from 'node:util';
import { cors } from 'hono/cors';

export function corsFromConfig(
    corsConfig: string,
    log = console.info,
    openCondition = process.env.NODE_ENV === 'development',
) {
    if (openCondition) {
        log('this build is for development, CORS is open');
        return cors();
    } else {
        const corsOriginWhitelist = (corsConfig || '').split(',');
        log(`corsOriginWhitelist: ${util.inspect(corsOriginWhitelist, { colors: true })}`);
        return cors({ origin: corsOriginWhitelist });
    }
}

export * from './middleware';
