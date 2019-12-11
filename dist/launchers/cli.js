"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const helpers_1 = require("./helpers");
function query({ entrypoint, body }) {
    console.log(`🐘 Spawning: PHP CLI ${entrypoint}`);
    // php spawn options
    const options = {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: process.env
    };
    // now vs now-dev
    if (!helpers_1.isDev()) {
        options.env.PATH = `${helpers_1.getPhpDir()}:${process.env.PATH}`;
        options.cwd = helpers_1.getPhpDir();
    }
    else {
        options.cwd = helpers_1.getUserDir();
    }
    return new Promise((resolve) => {
        const chunks = [];
        const php = child_process_1.spawn('php', ['-c', 'php.ini', entrypoint], options);
        // Output
        php.stdout.on('data', data => {
            chunks.push(data);
        });
        // Logging
        php.stderr.on('data', data => {
            console.error(`🐘 PHP CLI stderr`, data.toString());
        });
        // PHP script execution end
        php.on('close', (code, signal) => {
            if (code !== 0) {
                console.log(`🐘 PHP CLI process closed code ${code} and signal ${signal}`);
            }
            resolve({
                statusCode: 200,
                headers: {},
                body: Buffer.concat(chunks)
            });
        });
        php.on('error', err => {
            console.error('🐘 PHP CLI errored', err);
            resolve({
                body: Buffer.from(`🐘 PHP CLI process errored ${err}`),
                headers: {},
                statusCode: 500
            });
        });
        // Writes the body into the PHP stdin
        php.stdin.write(body || '');
        php.stdin.end();
    });
}
async function launcher(event) {
    const awsRequest = helpers_1.normalizeEvent(event);
    const input = await helpers_1.transformFromAwsRequest(awsRequest);
    const output = await query(input);
    return helpers_1.transformToAwsResponse(output);
}
exports.launcher = launcher;
// (async function () {
//   const response = await launcher({
//       Action: "test",
//       httpMethod: "GET",
//       body: "",
//       path: "/",
//       host: "https://zeit.co",
//       headers: {
//           'HOST': 'zeit.co'
//       },
//       encoding: null,
//   });
//   console.log(response);
// })();
