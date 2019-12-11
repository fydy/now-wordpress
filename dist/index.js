"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const build_utils_1 = require("@now/build-utils");
exports.shouldServe = build_utils_1.shouldServe;
const utils_1 = require("./utils");
// ###########################
// EXPORTS
// ###########################
exports.version = 3;
async function build({ files, entrypoint, workPath, config = {}, meta = {}, }) {
    // Collect included files
    let includedFiles = await utils_1.getIncludedFiles({ files, entrypoint, workPath, config, meta });
    // Try to install composer deps only on lambda,
    // not in the local now dev mode.
    if (!meta.isDev) {
        // Composer is called only if composer.json is provided,
        // or config.composer is TRUE
        if (includedFiles['composer.json'] || config.composer === true) {
            includedFiles = { ...includedFiles, ...await utils_1.getComposerFiles(workPath) };
        }
    }
    else {
        if (!(await utils_1.ensureLocalPhp())) {
            console.log(`
        It looks like you don't have PHP on your machine.
        Learn more about how to run now dev on your machine.
        https://err.sh/juicyfx/now-php/now-dev-no-local-php
      `);
        }
    }
    // Move all user files to LAMBDA_ROOT/user folder.
    const userFiles = build_utils_1.rename(includedFiles, name => path_1.default.join('user', name));
    // Bridge files contains PHP bins and libs
    let bridgeFiles = {};
    // Append PHP files (bins + shared object)
    bridgeFiles = { ...bridgeFiles, ...await utils_1.getPhpFiles({ meta }) };
    // Append launcher files (server for lambda, cgi for now dev)
    bridgeFiles = { ...bridgeFiles, ...utils_1.getLauncherFiles({ meta }) };
    // Append custom directives into php.ini
    if (config['php.ini']) {
        bridgeFiles['php/php.ini'] = utils_1.modifyPhpIni(bridgeFiles['php/php.ini'], config['php.ini']);
    }
    if (process.env.NOW_PHP_DEBUG === '1') {
        console.log('🐘 Entrypoint:', entrypoint);
        console.log('🐘 Config:', config);
        console.log('🐘 Work path:', workPath);
        console.log('🐘 Meta:', meta);
        console.log('🐘 User files:', Object.keys(userFiles));
        console.log('🐘 Bridge files:', Object.keys(bridgeFiles));
        console.log('🐘 PHP: php.ini', bridgeFiles['php/php.ini'].data.toString());
    }
    const lambda = await build_utils_1.createLambda({
        files: {
            ...userFiles,
            ...bridgeFiles
        },
        handler: 'launcher.launcher',
        runtime: 'nodejs8.10',
        environment: {
            NOW_ENTRYPOINT: entrypoint,
            NOW_PHP_DEV: meta.isDev ? '1' : '0'
        },
    });
    return { output: lambda };
}
exports.build = build;
;
async function prepareCache({ workPath }) {
    return {
        // Composer
        ...(await build_utils_1.glob('vendor/**', workPath)),
        ...(await build_utils_1.glob('composer.lock', workPath)),
        // NPM
        ...(await build_utils_1.glob('node_modules/**', workPath)),
        ...(await build_utils_1.glob('package-lock.json', workPath)),
        ...(await build_utils_1.glob('yarn.lock', workPath)),
    };
}
exports.prepareCache = prepareCache;
