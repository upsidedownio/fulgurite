import dotenvFlow from 'dotenv-flow';
import _ from 'lodash';

// user environments and NODE_ENV for config loading
// https://man7.org/linux/man-pages/man7/environ.7.html
export const customenv = ['NODE_ENV'];
export const environ = [
    'HOME',
    'SHELL',
    'USER',
    'PATH',
    'LANG',
    'TERM',
    'DISPLAY',
    'EDITOR',
    'LOGNAME',
    'MAIL',
    'MANPATH',
    'PWD',
    'OLDPWD',
    'PS1',
    'PS2',
    'HOSTNAME',
    'HOSTTYPE',
    'OSTYPE',
    'MACHTYPE',
    'IFS',
    'SUDO_USER',
    'SUDO_UID',
    'SUDO_GID',
];

const dotenvFlowConfig = dotenvFlow.config({ default_node_env: 'development' });
const configFromDotenv = _.get(dotenvFlowConfig, 'parsed');
const configFromEnv = process.env || {};

export const config = _.assign(
    {},
    configFromDotenv,
    _.pick(
        configFromEnv,
        _.keysIn(configFromDotenv)
            .filter((key) => configFromEnv[key] !== '')
            .concat(customenv)
            .concat(environ),
    ),
);

let mask: string[] = [];

export default {
    value: config,
    env: configFromEnv,
    dotenv: configFromDotenv,
    get: (key: string, fallback?: string) => _.get(config, key, fallback),
    setMask: (_mask: string[]) => {
        mask = _mask;
    },
    toString: (_mask?: string[]) =>
        JSON.stringify(
            _.mapValues(_.omit(config, [...environ, ...customenv]), (value, key) => {
                if (mask.includes(key) || _mask?.includes(key)) {
                    if (key === '' || !key) {
                        return key;
                    }
                    return '****MASKED****';
                }
                return value;
            }),
            null,
            2,
        ),
    unsafeToString: () => JSON.stringify(config, null, 2),
};
