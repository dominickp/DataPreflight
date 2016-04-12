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

} else if(argv.action === 'extract-proof'){

    argv = require('yargs')
        .usage('Usage: $0 --input [path] [--debug] [--fml] [--css [column]] [--random [num]]')
        .demand(['input'])
        .option('first-middle-last', {
            alias: 'fml',
            describe: 'first, middle, last',
            default:false
        })
        .option('random', {
            alias: 'r',
            describe: 'random number of records',
            default:false
        })
        .option('random', {
            alias: 'r',
            describe: 'random number of records',
            default:false
        })
        .option('column-sample-space', {
            alias: 'css',
            describe: 'all possible outcomes for a column\'s value'
        })
        .argv;

    console.log(argv.fml, argv.css);


} else {

    console.log("Valid --action not specified.");

}