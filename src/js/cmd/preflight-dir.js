var PreflightDirectory = require('./../preflightDirectory');

exports.command = 'preflight-dir [dir]';

exports.describe = 'Preflights a directory of spreadsheets recursively.';

exports.builder = {
    path: {
        required: true,
        alias: 'p',
        describe: "Path to directory."
    },
    format: {
        default: 'html',
        choices: ['html', 'xml'],
        alias: 'f',
        describe: "Preflight report format."
    },
    debug: {
        default: true,
        choices: [true, false],
        alias: 'd',
        describe: "Enable debugging messages to console."
    }
};

exports.handler = function (argv) {
    
    var preflight = new PreflightDirectory(argv.path, argv.format, argv.debug);
    preflight.init();
    
};