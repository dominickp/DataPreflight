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

    argv = require('yargs')
        .usage('Usage: $0 --input [path] --output [path] [--append]')
        .demand(['input'])
        .argv;

    var preflight = new PreflightFile(input, output, append);
    preflight.init();

}

if(argv.action === 'preflight-dir'){

    var path = argv.path;

    argv = require('yargs')
        .usage('Usage: $0 --path')
        .demand(['path'])
        .argv;

    var preflight = new PreflightDirectory(path);
    preflight.init();

}