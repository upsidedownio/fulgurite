import FulguriteLogger from '../dist/index.mjs';

const logger = FulguriteLogger({ levels: { file: 'debug', console: 'debug' }, logfilePath: './log' });

const testObj = {
    data: 'some data',
    complex: {
        deepDepth: { insideOfDeppDepth: { number: 100, someString: '124', array: ['1', 0, { obj: { b: 1 } }] } },
    },
};

logger.info('This is an info message', testObj);

logger.info({
    data: 'some data',
    complex: {
        deepDepth: { insideOfDeppDepth: { number: 100, someString: '124', array: ['1', 0, { obj: { b: 1 } }] } },
    },
});

logger.error(new Error('1. This is an error message in message'));
logger.error('2. message', new Error('2. This is an error message in meta'));
logger.error('3. message', 'how', new Error('This is an error message in info'));
