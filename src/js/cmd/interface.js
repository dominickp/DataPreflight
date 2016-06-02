//#!/usr/bin/env node


var argv = require('yargs')

    // Version
    .alias('v', 'version')
    .version(function() { return require('../../../package').version; })
    .describe('v', 'show version information')

    // Command modules
    .command(require('./preflight'))
    .command(require('./preflight-dir'))

    .help()
    .argv;

console.log(argv.command);