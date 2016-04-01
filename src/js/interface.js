#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 --action [action]')
    //.demand(['action', 'input', 'output'])
    .describe('f', 'Load a file')
    .argv;
var PreflightFile = require('./preflightFile');
var PreflightDirectory = require('./preflightDirectory');

if(argv.version){

    console.log('v0.0.2');

} else if(argv.action === 'preflight'){

    // Test file exists
    var input = argv.input;
    var output = argv.output;
    var debug = argv.debug;

    argv = require('yargs')
        .usage('Usage: $0 --input [path] --output [path] --format [format] [--debug]')
        .demand(['input'])
        .option('format', {
            alias: 'f',
            describe: 'choose a preflight format',
            default: 'html',
            choices: ['html', 'xml', 'json']
        })
        .argv;

    var format = argv.format;

    var preflight = new PreflightFile(input, output, format, debug);
    preflight.init(function(){

    });

} else if(argv.action === 'preflight-dir'){

    var path = argv.path;
    var debug = argv.debug;

    argv = require('yargs')
        .usage('Usage: $0 --path [--debug]')
        .demand(['path'])
        .option('format', {
            alias: 'f',
            describe: 'choose a preflight format',
            default: 'html',
            choices: ['html', 'xml', 'json']
        })
        .argv;

    var format = argv.format;

    var preflight = new PreflightDirectory(path, format, debug);
    preflight.init();

} else {

    console.log("Valid --action not specified.");

}