#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 --action [action]')
    //.demand(['action', 'input', 'output'])
    .describe('f', 'Load a file')
    .argv;
var PreflightFile = require('./preflightFile');
var PreflightDirectory = require('./preflightDirectory');

if(argv.version){

    console.log('v0.0.3');

} else if(argv.action === 'preflight'){

    // Test if file exists

    argv = require('yargs')
        .usage('Usage: $0 --input [path] --output [path] --format [format] [--debug]')
        .demand(['input'])
        .option('format', {
            alias: 'f',
            describe: 'choose a preflight format',
            default: 'html',
            choices: ['html', 'xml']
        })
        .argv;

    var preflight = new PreflightFile(argv.input, argv.output, argv.format, argv.debug);
    preflight.init(function(){

    });

} else if(argv.action === 'preflight-dir'){

    argv = require('yargs')
        .usage('Usage: $0 --path [--debug]')
        .demand(['path'])
        .option('format', {
            alias: 'f',
            describe: 'choose a preflight format',
            default: 'html',
            choices: ['html', 'xml']
        })
        .argv;

    var preflight = new PreflightDirectory(argv.path, argv.format, argv.debug);
    preflight.init();

} else {

    console.log("Valid --action not specified.");

}