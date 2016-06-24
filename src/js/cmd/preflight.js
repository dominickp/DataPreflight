var PreflightFile = require('./../preflightFile');

exports.command = 'preflight [path]';

exports.describe = 'Preflights a single spreadsheet.';

exports.builder = {
    path: {
        required: true,
        alias: 'p',
        describe: "Path to directory."
    },
    output: {
        required: false,
        alias: 'o',
        describe: "Output file path."
    },
    format: {
        default: 'html',
        choices: ['html', 'xml'],
        alias: 'f',
        describe: "Preflight report format."
    },
    debug: {
        default: false,
        choices: [true, false],
        alias: 'd',
        describe: "Enable debugging messages to console."
    }
};

exports.handler = function (argv) {

    var preflight = new PreflightFile(argv.path, argv.output, argv.format, argv.debug);

    preflight.init(function(){
        console.log("Preflight complete.");
    })

};