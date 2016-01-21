#!/usr/bin/env node

var argv = require('yargs')
    .usage('Usage: $0 --action [action]')
    //.demand(['action', 'input', 'output'])
    .argv;
var PreflightFile = require('./preflightFile');
var PreflightDirectory = require('./preflightDirectory');

// Test file exists
var input = argv.input;
var output = argv.output;

if(argv.version){
    console.log('v0.0.1');
}

if(argv.action === 'preflight'){

    argv = require('yargs')
        .usage('Usage: $0 --input [path] --output [path]')
        .demand(['input', 'output'])
        .argv;

    var preflight = new PreflightFile(input, output);
    preflight.init();

}

if(argv.action === 'preflight-dir'){

    argv = require('yargs')
        .usage('Usage: $0 --path')
        .demand(['path'])
        .argv;

    console.log('dir');

    var preflight = new PreflightDirectory(input, output);
    preflight.init();

}