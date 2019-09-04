const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const Path = require('path');
const fs = require('fs');
const version = JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'package.json'), 'utf-8')).version;
const compression = require('compression');

let startupTs = Date.now();

/**
 * Start a web server to run simulated applications
 *
 * @param outFolder Location of the build folder with the WASM files
 * @param port Port to run the web server on
 * @param staticMaxAge Max-age cache header to set for static files
 * @param runtimeLogs Whether to enable runtime logs (from e.g. LoRa server)
 * @param callback Callback to invoke when the server is started (or failed to start)
 */
module.exports = function(outFolder, port, staticMaxAge, runtimeLogs, callback) {
    const app = express();
    const server = require('http').Server(app);

    const consoleLog = runtimeLogs ? console.log.bind(console) : function() {};

    app.set('view engine', 'html');
    app.set('views', Path.join(__dirname, '..', 'viewer'));
    app.engine('html', hbs.__express);
    app.use(compression({
        filter: () => true,
        level: 6
    }));

    express.static.mime.define({'application/wasm': ['wasm']});
    app.use('/out', express.static(outFolder, { maxAge: staticMaxAge }));
    app.use(express.static(Path.join(__dirname, '..', 'viewer'), { maxAge: staticMaxAge }));
    app.use(bodyParser.json());

    app.get('/simulator', (req, res, next) => {
        (async function() {
            res.render('viewer.html', {
                version: version
            });
        })().catch(err => {
            return next(err);
        });
    });

    app.use(express.static('micropython/tests'));

    console.log('BBC micro:bit simulator');

    server.listen(port, process.env.HOST || '0.0.0.0', function () {
        console.log('Web server listening on port %s!', port);
        console.log('Access simulator at http://localhost:%s/simulator', port);
    });
};
