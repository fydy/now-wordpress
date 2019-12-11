"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const child_process_1 = require("child_process");
const net_1 = __importDefault(require("net"));
const helpers_1 = require("./helpers");
let server;
async function startServer(entrypoint) {
    // Resolve document root and router
    const router = entrypoint;
    const docroot = helpers_1.getUserDir();
    console.log(`🐘 Spawning: PHP Built-In Server at ${docroot} (document root) and ${router} (router)`);
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
    // We need to start PHP built-in server with following setup:
    // php -c php.ini -S ip:port -t /var/task/user /var/task/user/foo/bar.php
    //
    // Path to document root lambda task folder with user prefix, because we move all
    // user files to this folder.
    //
    // Path to router is absolute path, because CWD is different.
    //
    server = child_process_1.spawn('php', ['-c', 'php.ini', '-S', '127.0.0.1:8000', '-t', docroot, router], options);
    server.stderr.on('data', data => {
        console.error(`🐘STDERR: ${data.toString()}`);
    });
    server.on('close', function (code, signal) {
        console.log(`🐘 PHP Built-In Server process closed code ${code} and signal ${signal}`);
    });
    server.on('error', function (err) {
        console.error(`🐘 PHP Built-In Server process errored ${err}`);
    });
    await whenPortOpens(8000, 400);
    process.on('exit', () => {
        server.kill();
    });
    return server;
}
async function query({ entrypoint, uri, path, headers, method, body }) {
    if (!server) {
        await startServer(entrypoint);
    }
    return new Promise(resolve => {
        const options = {
            hostname: '127.0.0.1',
            port: 8000,
            path,
            method,
            headers,
        };
        console.log(`🐘 Accessing ${uri}`);
        console.log(`🐘 Querying ${path}`);
        const req = http_1.default.request(options, (res) => {
            const chunks = [];
            res.on('data', (data) => {
                chunks.push(data);
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode || 200,
                    headers: res.headers,
                    body: Buffer.concat(chunks)
                });
            });
        });
        req.on('error', (error) => {
            console.error('🐘 PHP Built-In Server HTTP errored', error);
            resolve({
                body: Buffer.from(`PHP Built-In Server HTTP error: ${error}`),
                headers: {},
                statusCode: 500
            });
        });
        if (body) {
            req.write(body);
        }
        req.end();
    });
}
function whenPortOpensCallback(port, attempts, cb) {
    const client = net_1.default.connect(port, '127.0.0.1');
    client.on('error', (error) => {
        if (!attempts)
            return cb(error);
        setTimeout(() => {
            whenPortOpensCallback(port, attempts - 1, cb);
        }, 50);
    });
    client.on('connect', () => {
        client.destroy();
        cb();
    });
}
function whenPortOpens(port, attempts) {
    return new Promise((resolve, reject) => {
        whenPortOpensCallback(port, attempts, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
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
