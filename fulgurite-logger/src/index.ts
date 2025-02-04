import winston from 'winston';
import Transport from 'winston-transport';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

interface CreateLoggerOpts {
    userTransports?: Transport[];
    levels?: {
        file?: string;
        console?: string;
    };
    logfilePath?: string;
    fileLogOpts?: winstonDailyRotateFile.DailyRotateFileTransportOptions;
}

const DefaultLogLevel = {
    file: 'debug',
    console: 'debug',
};

export type Logger = winston.Logger;

function createLogger(opts: CreateLoggerOpts = {}): Logger {
    const transports = opts.userTransports || [];
    const logLevels = { ...DefaultLogLevel, ...opts.levels };

    // Winston Daily Rotate File : https://github.com/winstonjs/winston-daily-rotate-file
    const LOG_FILE_LEVEL = logLevels.file || 'debug';
    if (LOG_FILE_LEVEL !== 'disable') {
        const defaultOptions = {
            level: LOG_FILE_LEVEL,
            dirname: opts.logfilePath || './log',
            filename: `${process.env.npm_package_name}-%DATE%.log`,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '50',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
            ),
        };
        const rotatedTransport = new winstonDailyRotateFile(Object.assign({}, defaultOptions, opts.fileLogOpts));
        /**
         * @property {function} winston.transports.DailyRotateFile.prototype.on - rotate hook
         */
        rotatedTransport.on('rotate', (oldFilename, newFilename) => {
            logger.info(`logfile rotated, oldFileName: ${oldFilename}, newFileName: ${newFilename}`);
        });
        transports.push(rotatedTransport);
    }

    // Winston Console Transports
    const LOG_CONSOLE_LEVEL = logLevels.console || 'debug';
    if (LOG_CONSOLE_LEVEL !== 'disabled') {
        // https://github.com/winstonjs/winston/blob/master/docs/transports.md
        const consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({ all: true }),
                winston.format.align(),
                winston.format.errors({ stack: true }),
                winston.format.prettyPrint({depth: 100, colorize: true}),
                winston.format.printf((info) => {
                    const { timestamp, level, message, stack, ...args } = info;
                    const ts = (timestamp as string).replace('T', ' ');
                    return `${ts} [${level}]: ${message} ${stack ? `- ${stack}` : ''} ${Object.keys(args).length ? `\n${prettyJ(args)}` : ''}`;
                }),
            ),
            level: LOG_CONSOLE_LEVEL,
        });
        transports.push(consoleTransport);
    }

    const logger: winston.Logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        transports: transports,
    });

    // colorize stringified json on terminal
    function prettyJ(json: object | string) {
        let jsonStr = '';
        if (typeof json !== 'string') {
            jsonStr = JSON.stringify(json, undefined, 2);
        } else {
            jsonStr = json;
        }
        return jsonStr.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            (match: string) => {
                let cls = '\x1b[36m';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = '\x1b[34m';
                    } else {
                        cls = '\x1b[32m';
                    }
                } else if (/true|false/.test(match)) {
                    cls = '\x1b[35m';
                } else if (/null/.test(match)) {
                    cls = '\x1b[31m';
                }
                return `${cls + match}\x1b[0m`;
            },
        );
    }

    return logger;
}

export default createLogger;
