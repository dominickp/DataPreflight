#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 --action [action]')
    //.demand(['action', 'input', 'output'])
    .argv;
var PreflightFile = require('./preflightFile');
var PreflightDirectory = require('./preflightDirectory');

if(argv.version){
    console.log('v0.0.1');
}

if(argv.action === 'preflight'){

    // Test file exists
    var input = argv.input;
    var output = argv.output;
    var append = argv.append;
    var debug = argv.debug;

    argv = require('yargs')
        .usage('Usage: $0 --input [path] --output [path] [--append] [--debug]')
        .demand(['input'])
        .argv;

    var preflight = new PreflightFile(input, output, append, debug);
    preflight.init();

}

if(argv.action === 'preflight-dir'){

    var path = argv.path;
    var append = argv.append;
    var debug = argv.debug;

    argv = require('yargs')
        .usage('Usage: $0 --path [--debug]')
        .demand(['path'])
        .argv;

    var preflight = new PreflightDirectory(path, append, debug);
    preflight.init();

}